/**
 * 全局 TypeScript 环境声明文件
 *
 * Vite/TypeScript 原生不认识.vue后缀的模块,当 TS 代码(如 .ts、.tsx)
 * 中 import Vue 单文件组件时,会报 “找不到模块 'xxx.vue'” 的错误。
 * 该声明文件告诉 TS 编译器:任何以 .vue 结尾的文件都视为一个 DefineComponent,
 * 从而让 TS 能顺利通过类型检查。
 */
declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    // 统一把 *.vue 声明为 Vue 组件类型,props/emits 均放宽为 any 以适配自定义组件
    const component: DefineComponent<{}, {}, any>
    export default component
}