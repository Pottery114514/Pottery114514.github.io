# Yoshino's Blog — VitePress 开发文档

基于 [VitePress](https://vitepress.dev/) 的 Sakurairo 风格博客主题。本文档说明项目结构、配置方式，以及如何新增页面与功能。

---

## 目录

- [快速开始](#快速开始)
- [项目结构](#项目结构)
- [配置体系](#配置体系)
- [页面布局](#页面布局)
- [文章页目录侧边栏（TOC）](#文章页目录侧边栏toc)
- [新增内容指南](#新增内容指南)
- [新增功能指南](#新增功能指南)
- [样式与主题变量](#样式与主题变量)
- [静态资源](#静态资源)
- [常见问题](#常见问题)

---

## 快速开始

```bash
# 安装依赖
npm install

# 本地开发（默认 http://localhost:5173）
npm run docs:dev

# 生产构建（输出到 .vitepress/dist）
npm run docs:build

# 预览构建结果
npm run docs:preview
```

---

## 项目结构

```
vitepress/
├── src/                          # Markdown 源文件
│   ├── index.md                  # 首页（layout: home）
│   └── *.md                      # 文章 / 示例页面
├── public/                       # 静态资源（构建时原样复制到站点根目录）
│   └── res/                      # 图片、图标等 → 引用路径 /res/...
│       ├── avatar.png
│       ├── favicon.png
│       ├── icon.png
│       ├── iro/sakura_icon.svg
│       └── posts/
├── .vitepress/
│   ├── config.mts                # VitePress 站点配置（构建、Markdown、钩子）
│   └── theme/
│       ├── index.ts              # 主题入口（继承默认主题 + 注册全局组件）
│       ├── Iro.vue               # ClientOnly 包装层
│       ├── Layout.vue            # 主布局（导航、页脚、布局分发）
│       ├── iro.data.ts           # 构建时数据加载器
│       ├── config/
│       │   ├── iro.ts            # 主题业务配置（封面、导航、样式等）
│       │   ├── posts.ts          # 首页文章列表
│       │   └── types.mts         # TypeScript 类型定义
│       └── components/
│           ├── Header/           # 顶部导航、搜索、移动端菜单
│           ├── Home/             # 首页封面、文章列表
│           ├── Post/             # 文章页布局 + 目录侧边栏
│           ├── Footer.vue
│           ├── Panel.vue         # 右侧浮动面板（深浅色切换、回到顶部）
│           └── NotFound.vue
├── package.json
└── DEVELOPMENT.md                # 本文档
```

---

## 配置体系

项目有两层配置，职责分离：

| 文件 | 作用 | 典型修改 |
|------|------|----------|
| `.vitepress/config.mts` | VitePress 引擎层：路径、Markdown 插件、构建钩子 | 开启 headers、修改 `srcDir`、Git 时间戳 |
| `.vitepress/theme/config/iro.ts` | 主题展示层：标题、封面、导航、颜色 | 改站点名、头像、导航链接、主题色 |
| `.vitepress/theme/config/posts.ts` | 首页文章卡片列表 | 增删文章条目 |

### `.vitepress/config.mts`

```ts
export default defineConfigWithTheme({
    srcDir: './src',           // Markdown 根目录
    title: "Yoshino's Blog",
    lang: 'zh',
    lastUpdated: true,         // 启用最后更新时间（Post 页会显示）

    markdown: {
        headers: { level: [2, 3] },  // ⚠️ 必须开启，TOC 侧边栏依赖此配置
        config: md => md.use(ruby),  // 注音插件
        math: true,                  // 数学公式
        image: { lazyLoading: true },
    },

    transformPageData(pageData) {
        // 用文件 mtime 覆盖 lastUpdated
        // 未指定 layout 的页面默认设为 post
    },
});
```

**`transformPageData` 行为：**

- 所有未在 frontmatter 中声明 `layout` 的 `.md` 文件，自动设为 `layout: post`（文章页）。
- 首页 `src/index.md` 需显式写 `layout: home`。

### `.vitepress/theme/config/iro.ts`

主题配置通过 `iro.data.ts` 在构建期注入，各组件通过以下方式读取：

```ts
import { data as iro } from '../../iro.data';
```

主要字段：

```ts
{
    title, description, favicon,
    cover: { avatar, signature, background: { random, desktop, mobile } },
    nav: { icon, links: [{ title, url }] },
    search: { path, param },
    social: { links: [{ icon, link, name }] },
    footer: { content },
    error404: { title, text },
    style: {
        themeSkin,           // 浅色主色 → --iro-theme-skin
        themeSkinMatching,   // 强调色   → --iro-theme-skin-matching
        themeSkinDark,       // 深色主色 → --iro-theme-skin-dark
        menuRadius,
        menuSelectionRadius,
    },
    posts,  // 来自 posts.ts
}
```

`Layout.vue` 会把 `iro.style` 中的驼峰键自动转为 CSS 变量（如 `themeSkin` → `--iro-theme-skin`）写入 `:root`。

---

## 页面布局

`Layout.vue` 根据 frontmatter 的 `layout` 字段渲染不同组件：

| layout 值 | 组件 | 用途 |
|-----------|------|------|
| `home` | `Home.vue` | 首页：封面 + 文章列表 |
| `post` | `Post.vue` | 文章页：标题、更新时间、正文、TOC 侧边栏 |
| `page` | 原生 `<Content />` | 纯内容页，无文章样式 |
| `false` | 不渲染内容区 | 特殊用途 |
| 其他 / 缺省（会被 config 改为 post） | `Post.vue` | 同 post |

### Frontmatter 常用字段

```yaml
---
title: 文章标题          # Post 页 h1 显示（缺省为「文章」）
layout: post             # home | post | page
description: 页面描述
outline: deep            # VitePress 内置 outline 深度（与本主题 TOC 无关）
---
```

---

## 文章页目录侧边栏（TOC）

组件位置：`.vitepress/theme/components/Post/TocSidebar.vue`

### 工作原理

1. 从 `useData().page.headers` 读取标题树（h2 / h3）。
2. 构建固定于视口右侧的目录导航。
3. 用 `IntersectionObserver` 高亮当前阅读位置。
4. 点击目录项平滑滚动到对应标题。

### 不显示的常见原因

| 原因 | 说明 | 解决方式 |
|------|------|----------|
| **未开启 `markdown.headers`** | VitePress 默认 `page.headers` 为空数组 | 在 `config.mts` 添加 `headers: { level: [2, 3] }` |
| 页面无 h2/h3 标题 | 只有 `# h1` 或纯段落 | 在 Markdown 中添加 `##` / `###` 标题 |
| 视口宽度 ≤ 1100px | CSS 媒体查询隐藏侧边栏 | 加宽浏览器窗口或在 `TocSidebar.vue` 调整断点 |
| 非 post 布局 | 首页等不使用 Post 组件 | 确认 `layout: post` |

### 自定义 TOC

修改 `TocSidebar.vue`：

- **收集更多标题层级**：在 `config.mts` 改为 `headers: { level: [2, 3, 4] }`，并扩展模板中的层级渲染。
- **调整显示断点**：修改 `@media (max-width: 1100px)` 中的数值。
- **修改位置**：调整 `.iro-toc-sidebar` 的 `top`、`right`、`width`。

---

## 新增内容指南

### 新增一篇博客文章

**步骤 1：** 在 `src/` 下创建 Markdown 文件，例如 `src/my-article.md`：

```markdown
---
title: 我的新文章
description: 简短描述
---

## 第一节

正文内容……

## 第二节

更多内容……
```

> 无需写 `layout: post`，`transformPageData` 会自动设置。

**步骤 2：** 在 `.vitepress/theme/config/posts.ts` 添加首页卡片：

```ts
{
    title: '我的新文章',
    url: '/my-article',        // 对应 src/my-article.md
    date: '2026-8-22',
    description: '简短描述，显示在首页卡片上',
    thumb: '/res/posts/cover.jpg',  // 可选，缺省使用封面背景图
}
```

**步骤 3（可选）：** 在 `iro.ts` 的 `nav.links` 添加入口链接。

### 修改首页

编辑 `src/index.md`：

```yaml
---
layout: home
---
```

首页内容由 `Home.vue` 渲染，数据来自 `iro.ts` 和 `posts.ts`，通常不需要在 `index.md` 中写正文。

### 新增导航链接

编辑 `.vitepress/theme/config/iro.ts`：

```ts
nav: {
    links: [
        { title: '首页', url: '/' },
        { title: '新页面', url: '/new-page' },
    ]
}
```

---

## 新增功能指南

### 1. 新增全局 Vue 组件

在 `.vitepress/theme/index.ts` 的 `enhanceApp` 中注册：

```ts
import MyComponent from './components/MyComponent.vue';

enhanceApp({ app, router, siteData }) {
    app.component('MyComponent', MyComponent);
    // 已有：app.component('fa-i', FontAwesomeIcon)
}
```

### 2. 新增布局类型

1. 在 `.vitepress/theme/components/` 创建布局组件（如 `Archive.vue`）。
2. 在 `Layout.vue` 中添加分支：

```vue
<slot v-else-if="frontmatter.layout == 'archive'" name="iro-archive">
    <Archive>
        <Content class="vp-doc" />
    </Archive>
</slot>
```

3. 在 `Iro.vue` 中转发对应插槽（保持插槽链完整）。
4. 页面 frontmatter 使用 `layout: archive`。

### 3. 新增主题配置项

1. 在 `config/types.mts` 的 `Iro.Config` 接口中添加字段类型。
2. 在 `config/iro.ts` 中填写默认值。
3. 在目标组件中通过 `iro.data` 读取并使用。

### 4. 新增 Markdown 插件

在 `config.mts` 的 `markdown.config` 中注册：

```ts
import { somePlugin } from 'some-package';

markdown: {
    config: md => {
        md.use(ruby);
        md.use(somePlugin);
    },
}
```

### 5. 新增构建时数据

参考 `iro.data.ts` 创建 `.vitepress/theme/xxx.data.ts`：

```ts
export default {
    load() {
        return { /* 构建期静态数据 */ };
    }
};
```

组件中：`import { data as xxx } from '../xxx.data';`

### 6. 覆盖布局插槽

主题在 `Iro.vue` / `Layout.vue` 中定义了命名插槽，可在扩展主题时覆盖：

| 插槽名 | 位置 |
|--------|------|
| `iro-home-page` | 首页 Content 区域 |
| `iro-post-list` | 首页文章列表 |
| `iro-signature` | 封面个性签名 |
| `iro-post` | 整页文章布局 |
| `iro-footer` | 页脚额外内容 |
| `iro-not-found` | 404 页 |

---

## 样式与主题变量

### 全局 CSS 变量（由 iro.style 注入）

| 配置键 | CSS 变量 | 用途 |
|--------|----------|------|
| `themeSkin` | `--iro-theme-skin` | 浅色主色 |
| `themeSkinMatching` | `--iro-theme-skin-matching` | 强调色、进度条、TOC 高亮 |
| `themeSkinDark` | `--iro-theme-skin-dark` | 深色主色 |
| `menuRadius` | `--iro-menu-radius` | 圆角 |
| `menuSelectionRadius` | `--iro-menu-selection-radius` | 选中圆角 |

### 深浅色模式

- 状态：`Layout.vue` 中 `iroDark` ref，通过 `provide('iroDark', iroDark)` 共享。
- 持久化：`localStorage['iro-theme']`（`'dark'` / `'light'`）。
- 切换：`Panel.vue` 中的按钮。
- 组件用法：`inject('iroDark')`，根元素加 `iro-light` / `iro-dark` class。

### 组件内局部变量

许多组件在 `.iro-root.iro-light / .iro-dark` 下定义 `--iro-var-1`、`--iro-var-2` 等局部变量，仅在该组件子树内生效。

---

## 静态资源

VitePress 只会将 **`public/`** 目录下的文件在构建时原样复制到站点根目录；`src/` 内的文件不会自动变成可访问的 URL。

因此所有需要在配置、组件、Markdown 中通过绝对路径引用的图片、图标、字体等，都应放在 `public/` 下。

### 目录与 URL 对应关系

```
public/res/avatar.png   →  /res/avatar.png
public/res/favicon.png  →  /res/favicon.png
public/res/icon.png     →  /res/icon.png
```

### 引用方式

**主题配置（`iro.ts`）— 使用以 `/` 开头的站点根路径：**

```ts
favicon: '/res/favicon.png',
cover: { avatar: '/res/avatar.png', ... },
nav: { icon: '/res/icon.png', ... },
```

**Vue 组件模板 — 同样使用根路径：**

```vue
<img src="/res/iro/sakura_icon.svg" alt="sakura icon">
<img :src="iro.nav.icon">   <!-- iro.ts 中已配置为 /res/icon.png -->
```

**Markdown 正文：**

```markdown
![示例](/res/posts/helloworld.jpg)
```

**首页文章封面（`posts.ts`）：**

```ts
thumb: '/res/posts/helloworld.jpg',
```

### 不要使用的写法

| 写法 | 问题 |
|------|------|
| `src/res/avatar.png` | `src/` 不是静态资源目录，preview/生产环境 404 |
| `../../../src/res/icon.png` | 相对路径依赖源码目录结构，构建后失效 |
| `./res/avatar.png`（在配置中） | 相对路径在运行时解析位置不确定 |

### 可选：在 Vue 中 import 资源

若资源仅在某组件内使用、不需要在 Markdown/配置里写路径，可通过 Vite 导入（会参与打包并带 hash）：

```vue
<script setup>
import sakuraIcon from '../../../public/res/iro/sakura_icon.svg';
</script>
<img :src="sakuraIcon">
```

主题配置与 Markdown 仍推荐 `public/` + `/res/...` 根路径，便于统一维护。

---

## 常见问题

### Q: 目录侧边栏不显示？

见 [文章页目录侧边栏（TOC）](#文章页目录侧边栏toc)。最常见原因是缺少 `markdown.headers` 配置。

### Q: 文章没有出现在首页列表？

检查 `posts.ts` 是否添加了对应条目，且 `url` 与 Markdown 文件路径一致（不含 `.md` 后缀）。

### Q: 最后更新时间为空或报错？

`transformPageData` 使用 `statSync` 读取文件修改时间。确保 `src/` 下对应 `.md` 文件存在。

### Q: Font Awesome 图标不显示？

图标在 `theme/index.ts` 中全局注册为 `<fa-i icon="fa-solid fa-xxx" />`。图标名须来自 `@fortawesome/free-solid-svg-icons` 或 `free-regular-svg-icons`。

### Q: 如何禁用某页的文章布局？

在 frontmatter 中指定其他 layout：

```yaml
---
layout: page   # 或 home
---
```

### 源目录

public/（项目根目录）— 默认的静态资源目录，构建时其内容直接复制到 dist/ 根目录，通过 /xxx 访问。
srcDir（默认也是 ./ 根目录）— 告诉 VitePress markdown 源文件在哪里。
如果设置了 srcDir: './src'，则：
markdown 源文件从 src/ 读取
静态资源目录变为 src/public/（srcDir 下的 public/），构建后复制到 dist/ 根目录，访问路径仍是 /xxx
根目录的 public/ 不再起作用（被 srcDir/public/ 覆盖）

### Q: 部署

项目含 `.github/workflows/deploy.yml`，推送后可通过 GitHub Actions 自动构建部署。本地构建产物位于 `.vitepress/dist/`。

---

## 技术栈

| 依赖 | 用途 |
|------|------|
| vitepress ^1.3 | 静态站点生成 |
| vue ^3.5 | 组件框架 |
| sass | 组件 scoped 样式 |
| @fortawesome/* | 图标 |
| @mdit/plugin-ruby | Markdown 注音 |
| markdown-it-mathjax3 | 数学公式 |
| vitepress-plugin-nprogress | 路由切换进度条 |

---

## 相关链接

- [VitePress 官方文档](https://vitepress.dev/zh/)
- [Runtime API（useData 等）](https://vitepress.dev/zh/reference/runtime-api)
- [站点配置（markdown.headers）](https://vitepress.dev/zh/reference/site-config#markdown)
- [自定义主题](https://vitepress.dev/zh/guide/custom-theme)
