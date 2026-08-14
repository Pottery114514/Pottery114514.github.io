# VitePress建站

## 初始化

1.在目标位置安装vitepress

```sh
npm add -D vitepress@next
```

此时目录应包含`node_modules`文件夹和两个json配置文件.

2.初始化 VitePress 配置,都默认选择

```sh
npx vitepress init
```

3.Vue 作为 peer dependency

如果打算使用 Vue 组件或 API 进行自定义，还应该明确地将 `vue` 安装为 dependency。

```sh
npm install vue
```

4.项目结构

`docs` 目录作为 VitePress 站点的项目**根目录**。`.vitepress` 目录是 VitePress 配置文件、开发服务器缓存、构建输出和可选主题自定义代码的位置。

