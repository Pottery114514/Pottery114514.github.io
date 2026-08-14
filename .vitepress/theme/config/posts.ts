import { Iro } from "./types.mts";

/**
 * 文章信息列表
 */
export default [
    {
        title: 'Markdown 示例',
        url: '/markdown-examples',
        date: '2024-10-4',
        description: '该页面展示 VitePress 内置的 Markdown 扩展功能，包括语法高亮、代码块、自定义容器等，帮助你快速了解 Markdown 的多样化内容展示能力。'
    }, {
        title: 'Runtime API 示例',
        url: '/api-examples',
        date: '2024-9-6',
        description: '该页面演示如何在 VitePress 中使用 Vue 的组合式 API 和运行时功能，包括 useData、useRoute 等实用工具，为你的站点提供动态能力。'
    }
] satisfies Iro.Post[];