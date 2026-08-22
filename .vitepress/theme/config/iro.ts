import { Iro } from "./types.mts";
// 文章列表数据抽离到 posts.ts 方便单独维护
import posts from "./posts";

/**
 * VitePress 主题 Sakurairo 的配置文件
 *
 * 所有在这里设置的字段都会通过 iro.data.ts 暴露给主题组件,
 * 并由 Layout.vue 自动把 style 字段转写为 --iro-xxx CSS 自定义属性。
 *
 * satisfies Iro.Config 表示:对象必须符合 Config 的类型结构,
 * 同时保留每个值的字面量类型(不做宽泛的 string 收窄)。
 */
export default {
    /** 站点主标题:与 config.mts 的 title 保持一致 */
    title: "Yoshino's Blog",
    /** 站点简介:同样与 config.mts 对齐,方便后续主题组件取用 */
    description: "A VitePress Site",
    favicon: '/res/favicon.png',

    // ===== 首页封面区 =====
    cover: {
        /** 头像图片 */
        avatar: '/res/avatar.png',
        /** 头像下方个性签名 */
        signature: 'test:心有所向，日复一日，必有精进',
        /** 背景图配置(随机模式开启) */
        background: {
            random: true,
            /** 桌面端背景图 URL */
            desktop: 'https://t.alcy.cc/fj/',
            /** 移动端背景图 URL */
            mobile: 'https://t.alcy.cc/mp/',
        }
    },

    // ===== 顶部导航 =====
    nav: {
        icon: '/res/icon.png',
        links: [
            { title: '首页', url: '/' },
            { title: 'Markdown 示例', url: '/markdown-examples' },
            { title: 'API 示例', url: '/api-examples' },
            { title: '404 页面演示', url: '/404' },
        ]
    },

    // ===== 搜索功能(表单提交 GET 请求) =====
    search: {
        /** 搜索表单的 action=跳转路径,例如搜索引擎或站内搜索页 */
        path: '/',
        /** query 参数名,最终 URL 形如 /?s=<关键字> */
        param: 's',
    },

    // ===== 首页封面下方社交按钮 =====
    social: {
        links: [
            {
                icon: 'github',
                link: 'https://github.com/vuejs/vitepress',
                name: 'GitHub'
            },
        ]
    },

    // ===== 页脚文案 =====
    footer: {
        /** 使用 v-html 渲染,可插入 <a><br> 等简单 HTML */
        content: '感谢您的访问~'
    },

    // ===== 404 页文案 =====
    error404: {
        title: '404 Not Found',
        text: '这里什么都没有...',
    },

    // ===== 全局样式配置(写入 CSS 变量) =====
    style: {
        /** 浅色模式主色:导航、链接、按钮的默认紫色 */
        themeSkin: '#8e78c6',
        /** 配对强调色:进度条、hover 下划线等的亮蓝 */
        themeSkinMatching: '#5892eb',
        /** 深色模式主色:偏暗的深紫 */
        themeSkinDark: '#211a39',
        /** 按钮/卡片/菜单的圆角 */
        menuRadius: '10px',
        /** 选中项/展开面板的圆角 */
        menuSelectionRadius: '10px',
    },
    // 首页文章列表:由 posts.ts 统一管理(详见该文件),避免此文件过长
    posts: posts
} satisfies Iro.Config;