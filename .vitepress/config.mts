import { defineConfigWithTheme } from 'vitepress';
import { ruby } from "@mdit/plugin-ruby";
import { statSync } from 'fs';
import { join } from 'path';
import iro from './theme/config/iro';

export default defineConfigWithTheme({
    base: '/pottery114514/',
    srcDir: "docs",
    title: "Yoshino's Blog",
    description: "A VitePress Site",
    lang: 'zh',
    cleanUrls: true,
    ignoreDeadLinks: true,
    lastUpdated: true,
    markdown: {
        config: md => {
            md.use(ruby);
        },
        math: true
    },
    head: [
        ['link', { rel: 'icon', href: iro.favicon }],
    ],
    transformPageData(pageData) {
        if (pageData.isNotFound) return;

        pageData.lastUpdated = statSync(join('docs', pageData.filePath)).mtimeMs;

        if (!('layout' in pageData.frontmatter)) {
            pageData.frontmatter.layout = 'post';
        }

        const title = '自述文件';
        if (pageData.filePath == 'readme.md') {
            pageData.title = title;
            pageData.frontmatter.title = title;
        }
    },
    vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler'
        }
      }
    }
    }
});