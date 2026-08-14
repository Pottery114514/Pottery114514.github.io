/**
 * VitePress 构建时数据加载器(Build-time Data Loader)
 * 
 * 1. VitePress 会自动识别所有以.data.ts结尾的文件作为数据加载器。
 * 2. 构建阶段 VitePress 会调用默认导出对象的load()方法,获取其返回值。
 * 3. 其他组件可以通过import { data as iro } from './iro.data'来引用这里返回的静态数据。
 * 4. 本文件的作用是:将用户在config/iro.ts中编写的主题配置统一暴露给所有组件,避免每个组件重复 import 配置。
 */
import { Iro } from "./config/types.mts";
import iro from "./config/iro";

export default {
    /**
     * 由 VitePress 在构建/开发时调用,返回 Sakurairo 主题的完整配置对象。
     * @returns Iro.Config 主题配置对象
     */
    load() {
        return iro;
    }
};