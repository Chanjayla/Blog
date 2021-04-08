export const pathMap = {
    '/admin/dashboard': {
        name: 'Dashboard',
        icon: 'el-icon-house',
        path: '/admin/dashboard'
    },
    '/admin/articleManager/edit': {
        name: 'Article-Edit',
        icon: 'el-icon-edit',
        path: '/admin/articleManager/edit'
    },
    '/admin/articleManager/view': {
        name: 'Article-View',
        icon: 'el-icon-view',
        path: '/admin/articleManager/view'
    },
    '/admin/articleManager/tag': {
        name: 'Tags',
        icon: 'el-icon-notebook-2',
        path: '/admin/articleManager/tag'
    },
    // '/admin/componentLib/view': {
    //     name: '组件浏览',
    //     icon: 'el-icon-view',
    //     path: '/admin/componentLib/view'
    // },
    '/admin/docManager/edit': {
        name: 'Doc-Edit',
        icon: 'el-icon-edit',
        path: '/admin/docManager/edit'
    },
    '/admin/docManager/view': {
        name: 'Doc-View',
        icon: 'el-icon-view',
        path: '/admin/docManager/view'
    },
    '/admin/resourceManager/pic': {
        name: 'Picture',
        icon: 'el-icon-view',
        path: '/admin/resourceManager/pic'
    },
    '/admin/resourceManager/music': {
        name: 'Music',
        icon: 'el-icon-headset',
        path: '/admin/resourceManager/music'
    },
    // '/admin/theme': {
    //     name: 'Theme',
    //     icon: 'el-icon-picture-outline-round',
    //     path: '/admin/theme'
    // },
    '/admin/profile': {
        name: 'Profile',
        icon: 'el-icon-user',
        path: '/admin/profile'
    },
    
    // '/admin/tool/fnt': {
    //    name: 'fnt',
    //    icon: 'el-icon-magic-stick',
    //    path: '/admin/tool/fnt'
    // }


}
export default {
    dashboard: pathMap['/admin/dashboard'],
    articleManager: {
        name: 'Articles',
        icon: 'el-icon-notebook-2',
        children: [
            pathMap['/admin/articleManager/edit'],
            pathMap['/admin/articleManager/view'],
            pathMap['/admin/articleManager/tag']
        ]
    },
    // componentLib: {
    //     name: '组件库',
    //     icon: 'el-icon-truck',
    //     children: [
    //         pathMap['/admin/componentLib/view']
    //     ]
    // },
    docManager: {
        name: 'Docs',
        icon: 'el-icon-notebook-1',
        children: [
            pathMap['/admin/docManager/edit'],
            pathMap['/admin/docManager/view']
        ]
    },
    resourceManager: {
        name: 'Resources',
        icon: 'el-icon-picture',
        children: [
            pathMap['/admin/resourceManager/pic'],
            pathMap['/admin/resourceManager/music']
        ]
    },
    profile: pathMap['/admin/profile'],
    // theme: pathMap['/admin/theme'],
    // tool: {
    //     name: 'Tools',
    //     icon: 'el-icon-s-tools',
    //     children: [
    //         pathMap['/admin/tool/fnt']
    //     ]
    // }
}