<script setup>
/*
 * 顶层 Layout 包装组件
 *
 * 职责:
 * 1. 外层套 <ClientOnly>,确保 Layout.vue 及其内部所有子组件
 *    只在客户端(浏览器)渲染,避免 SSR 阶段访问 window/localStorage
 *    等浏览器特有 API 导致报错。
 * 2. 作为插槽“转发器”:把 Layout.vue 定义的 10 个命名插槽,
 *    一层不变地透出给上层(主题使用者在 index.ts 或 Markdown 中
 *    可以通过同名插槽覆盖局部内容,比如自定义封面签名区或页脚)。
 */
import Layout from './Layout.vue';
</script>

<template>
    <ClientOnly>
        <Layout>
            <template v-slot:iro-home-page>
                <slot name="iro-home-page"></slot>
            </template>
            <template v-slot:iro-signature>
                <slot name="iro-signature"></slot>
            </template>
            <template v-slot:iro-not-found>
                <slot name="iro-not-found"></slot>
            </template>
            <template v-slot:iro-page>
                <slot name="iro-page"></slot>
            </template>
            <template v-slot:iro-home>
                <slot name="iro-home"></slot>
            </template>
            <template v-slot:iro-post-list>
                <slot name="iro-post-list"></slot>
            </template>
            <template v-slot:iro-post>
                <slot name="iro-post"></slot>
            </template>
            <template v-slot:iro-other>
                <slot name="iro-other"></slot>
            </template>
            <template v-slot:iro-footer>
                <slot name="iro-footer"></slot>
            </template>
        </Layout>
    </ClientOnly>
</template>