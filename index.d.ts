import { 
    Layout,
    LayoutContent,
    LayoutFooter,
    LayoutHeader,
    LayoutSider
} from 'ant-design-vue';

declare module '@vue/runtime-core' {
    export interface ComponentCustomProperties {
        'a-layout': typeof Layout,
        'a-layout-header': typeof LayoutHeader,
        'a-layout-sider': typeof LayoutSider,
        'a-layout-content': typeof LayoutContent,
        'a-layout-footer': typeof LayoutFooter,
    }
}
