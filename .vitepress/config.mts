import { defineConfigWithTheme } from 'vitepress';
import { ruby } from "@mdit/plugin-ruby";
import { statSync } from 'fs';
import { join } from 'path';
import iro from './theme/config/iro';


//参考https://vitepress.dev/zh/reference/site-config#overview
export default defineConfigWithTheme({
    base: '/',
    srcDir: './src',//决定 VitePress 从哪里找 markdown 源文件，修改后必须同步更新所有硬编码的路径引用
    title: "Yoshino's Blog",
    description: "A VitePress Site",
    lang: 'zh',
    //cleanUrls: true,
    ignoreDeadLinks: true,
    lastUpdated: true,//使用 Git 获取每个页面的最后更新时间戳
    
    markdown: {
        // 必须开启，TocSidebar 才能通过 useData().page.headers 获取标题树
        headers: { level: [2, 3] },
        config: md => {
            md.use(ruby);
        },
        math: true,
        image: {
            lazyLoading: true
        }
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
        publicDir: 'public',
        vue: {
            template: {
                transformAssetUrls: {
                    img: ['src']
                }
            }
        },
        assetsInclude: ['**/*.svg'],
        css: {
            preprocessorOptions: {
                scss: {
                    api: 'modern-compiler'
                }
            }
        }
    }
});