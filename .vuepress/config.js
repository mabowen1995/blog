module.exports = {
  title: 'Mabowen`s blog',
  description: '聚焦刹那，时光永存',
  theme: 'reco',
  themeConfig: {
    type: 'blog',
    nav: [
      {
        text: '主页',
        link: '/',
        icon: 'reco-home'
      },
      { text: '时间轴', link: '/timeline/', icon: 'reco-date' }
    ],
    blogConfig: {
      category: {
        location: 2,
        text: '分类'
      },
      tag: {
        location: 3,
        text: '标签'
      },
      socialLinks: [
        { icon: 'reco-github', link: 'https://github.com/mabowen1995' },
        { icon: 'reco-juejin', link: 'https://juejin.cn/user/3298190615395703' }
      ]
    },
    logo: '/avatar.jpg',
    authorAvatar: '/avatar.jpg',
    noFoundPageByTencent: false
  },
  head: [
    ['link', { rel: 'icon', href: '/avatar.jpg' }]
  ]
}