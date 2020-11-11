export default {
    bilibili: [
        {
            target: '/bilibili/bangumi/media/:bid[?limit=num]',
            title: '番剧'
        },
        {
            target: '/bilibili/user/dynamic/:uid[?limit=num]',
            title: 'UP主动态'
        },
        {
            target: '/bilibili/user/video/:uid[?limit=num]',
            title: 'UP主投稿'
        },
        {
            target: '/bilibili/user/article/:uid[?limit=num]',
            title: 'UP主专栏'
        },
        {
            target: '/bilibili/user/bangumi/:uid[?limit=num]',
            title: '用户追番'
        },
        {
            target: '/bilibili/manga/update/:comicid[?limit=num]',
            title: '漫画更新'
        }
    ],
    github: [
        {
            target: '/github/repos/:user[?limit=num]',
            title: '用户仓库'
        },
        {
            target: '/github/issue/:user/:repo[?limit=num]',
            title: '仓库issue'
        },
        {
            target: 'github/pull/:user/:repo[?limit=num]',
            title: '仓库pull request'
        }
    ],
    zhihu: [
        {
            target: '/zhihu/people/activities/:id[?limit=num]',
            title: '用户动态'
        },
        {
            target: '/zhihu/people/answers/:id[?limit=num]',
            title: '用户回答'
        },
        {
            target: '/zhihu/people/posts/:id[?limit=num]',
            title: '用户文章'
        },
        {
            target: '/zhihu/question/:questionId[?limit=num]',
            title: '用户问题'
        }, 
        {
            target: '/zhihu/topic/:topicId[?limit=num]',
            title: '话题关注'
        }
    ],
    qidian: [
        {
            target: '/qidian/chapter/:id[?limit=num]',
            title: '小说章节'
        }
    ]
}