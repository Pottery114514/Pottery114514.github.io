<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useData, useRoute } from 'vitepress';

interface TocItem {
    slug: string;
    title: string;
    level: number;
    children: TocItem[];
}

const { page } = useData();
const route = useRoute();

/** 当前高亮的标题 slug */
const activeSlug = ref('');
/** 展开到 h3 的父级 slug 集合 */
const expandedSlugs = ref(new Set<string>());

// 将扁平的 headers 按 level 构建为树形结构
const tocItems = computed(() => {
    const headers = page.value.headers ?? [];
    const root: TocItem[] = [];
    const stack: TocItem[] = [];

    for (const h of headers) {
        const item: TocItem = {
            slug: h.slug,
            title: h.title,
            level: h.level,
            children: [],
        };
        // 从栈顶弹出 level >= 当前 level 的项
        while (stack.length > 0 && stack[stack.length - 1].level >= item.level) {
            stack.pop();
        }
        if (stack.length > 0) {
            stack[stack.length - 1].children.push(item);
        } else {
            root.push(item);
        }
        stack.push(item);
    }
    return root;
});

// 扁平化所有 slug 用于 Observer 选择器
const allSlugs = computed(() => {
    const slugs: string[] = [];
    function walk(items: TocItem[]) {
        for (const item of items) {
            slugs.push(item.slug);
            walk(item.children);
        }
    }
    walk(tocItems.value);
    return slugs;
});

// 判断某个标题是否应该展开显示子项
function isExpanded(slug: string) {
    return expandedSlugs.value.has(slug) || activeSlug.value === slug;
}

// 收集页面上所有标题元素
let observer: IntersectionObserver | null = null;

function getHeaderElements() {
    const slugs = allSlugs.value;
    if (slugs.length === 0) return [];
    const selectors = slugs.map(s => `#${CSS.escape(s)}`).join(',');
    return Array.from(document.querySelectorAll(selectors)) as HTMLElement[];
}

function updateActive(slug: string) {
    activeSlug.value = slug;
    // 展开当前 slug 的父级
    function findParent(items: TocItem[], target: string): boolean {
        for (const item of items) {
            if (item.slug === target) {
                expandedSlugs.value.add(item.slug);
                return true;
            }
            for (const c of item.children) {
                if (c.slug === target) {
                    expandedSlugs.value.add(item.slug);
                    expandedSlugs.value.add(c.slug);
                    return true;
                }
            }
            if (findParent(item.children, target)) {
                expandedSlugs.value.add(item.slug);
                return true;
            }
        }
        return false;
    }
    findParent(tocItems.value, slug);
}

function initObserver() {
    if (observer) observer.disconnect();
    const els = getHeaderElements();
    if (els.length === 0) return;

    observer = new IntersectionObserver(
        (entries) => {
            const visible = entries
                .filter(e => e.isIntersecting)
                .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
            if (visible.length > 0) {
                updateActive(visible[0].target.id);
            }
        },
        { rootMargin: '-60px 0px -60% 0px', threshold: 0 }
    );

    els.forEach(el => observer?.observe(el));
}

watch(() => route.path, () => {
    setTimeout(initObserver, 100);
});

onMounted(() => {
    setTimeout(initObserver, 100);
});

onUnmounted(() => {
    if (observer) observer.disconnect();
});

function scrollTo(slug: string) {
    const el = document.getElementById(slug);
    if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        updateActive(slug);
    }
}
</script>

<template>
    <aside class="iro-toc-sidebar" :class="{ 'iro-toc-empty': tocItems.length === 0 }">
        <div class="iro-toc-header">
            <span class="iro-toc-title">Index</span>
        </div>
        <nav class="iro-toc-nav">
            <ul class="iro-toc-list">
                <li v-for="h in tocItems" :key="h.slug" class="iro-toc-item iro-toc-level-1">
                    <a
                        :href="`#${h.slug}`"
                        :class="{ 'iro-toc-active': activeSlug === h.slug }"
                        @click.prevent="scrollTo(h.slug)"
                    >
                        {{ h.title }}
                    </a>
                    <ul v-if="h.children.length > 0 && isExpanded(h.slug)" class="iro-toc-children">
                        <li v-for="c in h.children" :key="c.slug" class="iro-toc-item iro-toc-level-2">
                            <a
                                :href="`#${c.slug}`"
                                :class="{ 'iro-toc-active': activeSlug === c.slug }"
                                @click.prevent="scrollTo(c.slug)"
                            >
                                {{ c.title }}
                            </a>
                        </li>
                    </ul>
                </li>
            </ul>
        </nav>
    </aside>
</template>

<style scoped lang="scss">
.iro-toc-sidebar {
    position: fixed;
    top: 100px;
    right: 20px;
    width: 220px;
    max-height: calc(100vh - 160px);
    overflow-y: auto;
    padding: 12px 0;
    border-left: 1px solid var(--iro-var-1);
    transition: opacity 0.3s, border-color 0.8s ease;
    z-index: 100;                         
    scroll-behavior: smooth;

    &.iro-toc-empty {
        display: none;
    }

    &::-webkit-scrollbar {
        width: 4px;
    }

    &::-webkit-scrollbar-thumb {
        background: var(--iro-theme-skin-matching, #5892eb);
        border-radius: 2px;
    }
}

.iro-toc-header {
    padding: 0 16px 8px;
    font-size: 15px;
    font-weight: 600;
    color: var(--iro-font-color);
    opacity: 0.6;
}

.iro-toc-nav {
    font-size: 14px;
}

.iro-toc-list {
    list-style: none;
    margin: 0;
    padding: 0;
}

.iro-toc-children {
    list-style: none;
    margin: 0;
    padding: 0 0 0 16px;
}

.iro-toc-item {
    margin: 0;

    a {
        display: block;
        padding: 4px 16px;
        color: var(--iro-font-color);
        text-decoration: none;
        opacity: 0.5;
        border-left: 2px solid transparent;
        transition: all 0.2s;
        word-break: break-word;
        line-height: 1.5;

        &:hover {
            opacity: 0.8;
        }

        &.iro-toc-active {
            opacity: 1;
            color: var(--iro-theme-skin-matching, #5892eb);
            border-left-color: var(--iro-theme-skin-matching, #5892eb);
        }
    }
}

/* 响应式：窄屏隐藏侧边栏 */
@media (max-width: 1380px) {
    .iro-toc-sidebar {
        display: none;
    }
}
</style>