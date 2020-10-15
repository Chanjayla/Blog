export const pathMap = {
    '/admin/dashboard': {
        name: '首页',
        icon: 'el-icon-house',
        path: '/admin/dashboard'
    },
    '/admin/articleManager/edit': {
        name: '文章编辑',
        icon: 'el-icon-edit',
        path: '/admin/articleManager/edit'
    },
    '/admin/articleManager/view': {
        name: '文章浏览',
        icon: 'el-icon-view',
        path: '/admin/articleManager/view'
    },
    '/admin/articleManager/tag': {
        name: '标签管理',
        icon: 'el-icon-notebook-2',
        path: '/admin/articleManager/tag'
    },
    '/admin/componentLib/view': {
        name: '组件浏览',
        icon: 'el-icon-view',
        path: '/admin/componentLib/view'
    },
    '/admin/docManager/edit': {
        name: '文档编辑',
        icon: 'el-icon-edit',
        path: '/admin/docManager/edit'
    },
    '/admin/docManager/view': {
        name: '文档浏览',
        icon: 'el-icon-view',
        path: '/admin/docManager/view'
    },
    '/admin/resourceManager/view': {
        name: '资源浏览',
        icon: 'el-icon-view',
        path: '/admin/resourceManager/view'
    },
    '/admin/theme': {
        name: '主题',
        icon: 'el-icon-picture-outline-round',
        path: '/admin/theme'
    },
    '/admin/tool/fnt': {
       name: 'fnt生成',
       icon: 'el-icon-magic-stick',
       path: '/admin/tool/fnt'
    }


}
export default {
    dashboard: pathMap['/admin/dashboard'],
    articleManager: {
        name: '文章管理',
        icon: 'el-icon-notebook-2',
        children: [
            pathMap['/admin/articleManager/edit'],
            pathMap['/admin/articleManager/view'],
            pathMap['/admin/articleManager/tag']
        ]
    },
    componentLib: {
        name: '组件库',
        icon: 'el-icon-truck',
        children: [
            pathMap['/admin/componentLib/view']
        ]
    },
    docManager: {
        name: '文档管理',
        icon: 'el-icon-notebook-1',
        children: [
            pathMap['/admin/docManager/edit'],
            pathMap['/admin/docManager/view']
        ]
    },
    resourceManager: {
        name: '资源管理',
        icon: 'el-icon-picture',
        children: [
            pathMap['/admin/resourceManager/view']
        ]
    },
    theme: pathMap['/admin/theme'],
    tool: {
        name: '工具',
        icon: 'el-icon-s-tools',
        children: [
            pathMap['/admin/tool/fnt']
        ]
    }
}