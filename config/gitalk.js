export default {
    clientID: '7500fc21d4d214b71b18', //上面申请的Client ID
    clientSecret: 'e25b00f89a648965d59a702595cef7b0c93baed1', //上面申请的Client Secret
    repo: 'Blog', //GitHub仓库，评论可以在里面查询
    owner: 'Chanjayla', //GitHub的用户名
    admin: ['Chanjayla'], //这里也是填GitHub的用户名，不过是数组形式，如['user1','user2']
    id: location.pathname, // Ensure uniqueness and length less than 50 唯一值，如果和其他页面一样，则两个页面显示的评论都一样
    distractionFreeMode: false
}