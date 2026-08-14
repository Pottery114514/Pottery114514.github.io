export namespace Iro {
    /**
     * 封面设置
     */
    export interface Cover {
        signature: string;
        avatar: string;
        background: {
            random?: boolean;
            desktop: string;
            mobile: string;
        };
    };

    /**
     * 导航栏相关设置
     */
    export interface Nav {
        icon: string;
        links?: {
            title: string;
            url: string;
        }[];
    };

    /**
     * 拼接出用于搜索的 url
     */
    export interface Search {
        path?: string;
        param?: string;
    };

    /**
     * 社交网络链接
     */
    export interface SocialLink {
        icon: string;
        iconUrl?: string;
        link: string;
        name: string;
    }

    export interface Social {
        iconUrl?: string;
        iconPkg?: string;
        links?: SocialLink[];
    };

    /**
     * 页脚相关配置
     */
    export interface Footer {
        content?: string;
        beforeSlot?: boolean;
    };

    /**
     * 404 页面相关配置
     */
    export interface Error404 {
        title?: string;
        text?: string;
    };

    /**
     * 主题样式的 CSS 变量
     */
    export interface Style {
        themeSkin: string;
        themeSkinMatching: string;
        themeSkinDark: string;
        menuRadius: string;
        menuSelectionRadius: string;
    };

    /**
     * 文章信息
     */
    export interface Post {
        title: string;
        url: string;
        thumb?: string;
        date: any;
        description: string;
    };

    /**
     * VitePress 主题 Sakurairo 的配置类型
     */
    export interface Config {
        title: string;
        titleTemplate?: string;
        description: string;
        favicon: string;
        cover: Cover;
        nav?: Nav;
        search?: Search;
        social?: Social;
        footer?: Footer;
        error404?: Error404;
        style?: Style;
        posts?: Post[];
    };
}