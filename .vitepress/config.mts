import { defineConfigWithTheme } from 'vitepress';
import { ruby } from "@mdit/plugin-ruby";
import { statSync } from 'fs';
import { join } from 'path';
import iro from './theme/config/iro';

export default defineConfigWithTheme({
    base: '/',
    srcDir: 'src',
    title: "Yoshino's Blog",
    description: "A VitePress Site",
    lang: 'zh',
    //cleanUrls: true,
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

        const filePath = join('src', pageData.filePath);// 这里的 filePath 是相对于项目根目录的路径,如 src/guide/index.md
        pageData.lastUpdated = statSync(filePath).mtimeMs;

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