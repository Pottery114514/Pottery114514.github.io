/**
 * Sakurairo 主题入口文件
 *
 * VitePress 的主题就是一个导出Theme类型的对象,核心三个字段:
 *   - `extends`:继承(复用)VitePress 默认主题的所有能力(如 search、markdown 渲染等)
 *   - `Layout`:自定义布局组件,用于覆盖默认主题的整体外观(导航、封面、文章卡片等)
 *   - `enhanceApp`:应用加载阶段的钩子,可以在这里注册全局组件、插件、路由守卫等
 */
import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import { h } from 'vue';

// ========== FontAwesome 图标库全局注册 ==========
// 将 solid(实心) 与 regular(空心) 两套图标一次性加入图标库,
// 组件中通过 <fa-i icon="fa-solid fa-xxx" /> 形式引用图标。
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons'
library.add(fas, far);

// ========== 路由切换进度条(NProgress) ==========
// 在页面切换过程中在顶部显示一条蓝色细线,提升 SPA 切换的感知体验。
import vitepressNprogress from 'vitepress-plugin-nprogress';
import 'vitepress-plugin-nprogress/lib/css/index.css'

// 主题的顶层 Layout 包装组件,内部再调用真正的 Layout.vue 并转发所有插槽
import IroLayout from './Iro.vue';
// 全局样式(当前被注释掉,改为在各组件内通过 scoped scss 声明)
//import './style.scss';

export default {
    // 继承 VitePress 默认主题的全部行为(VP 文档里的 markdown 特性、默认数据接口等)
    extends: DefaultTheme,
    // 覆盖默认主题的主布局组件,换成 Sakurairo 自己的 UI 结构
    Layout: IroLayout,
    /**
     * 应用初始化钩子,在 VitePress 创建 Vue 应用实例时调用。
     * @param app      Vue 应用实例,可注册全局组件/插件
     * @param router   VitePress 路由实例,可挂路由守卫
     * @param siteData 站点数据(由 config.mts 生成)
     */
    enhanceApp({ app, router, siteData }) {
        // 把 <fa-i> 注册为全局组件名,避免每个组件重复 import FontAwesomeIcon
        app.component('fa-i', FontAwesomeIcon);
        // 启用 NProgress 路由进度条
        vitepressNprogress({ app, router, siteData });
    }
} satisfies Theme;