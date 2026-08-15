<script setup>
/**
 * 404 页面组件
 *
 * 当 VitePress 找不到匹配的页面(page.isNotFound=true)时,
 * Layout.vue 会调用这个组件显示 404 文案。
 *
 * 文本来源优先级:
 *   1. 配置文件 iro.ts 中 error404.title / error404.text
 *   2. 若未配置,降级为英文 '404 Not Found' + 中文 '这里什么都没有...'
 *
 * 使用 v-html 而非 {{ }} 渲染,允许用户在配置中插入简单 HTML 标签(
 * 如 <br>、<span style> 等)做轻量排版。
 */
import { useData } from 'vitepress';
const { theme } = useData(); // 保留以兼容老写法,未实际使用

// 通过构建时数据加载器读取主题配置
import { data as iro } from './iro.data';

</script>

<template>
    <div class="iro-container">
        <div class="iro-center">
            <!-- 用可选链 iro?.error404?.title 防止配置缺段时报错,再用 ?? 做硬兜底 -->
            <h1 v-html="iro?.error404?.title ?? '404 Not Found'"></h1>
            <p v-html="iro?.error404?.text ?? '这里什么都没有...'"></p>
        </div>
    </div>
</template>

<style scoped lang="scss">
/* 404 居中容器:距离顶部 160px,水平+垂直双居中 */
.iro-container {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    top: 160px;

    .iro-center {
        font-size: 20px;

        h1 {
            font-size: 48px;
            line-height: 48px;
        }
    }
}
</style>