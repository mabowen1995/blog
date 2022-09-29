module.exports = {
  title: 'Mabowen`s blog',
  description: '聚焦刹那，时光永存',
  theme: 'reco',
  themeConfig: {
    type: 'blog',
    author: 'Mabowen',
    record: '辽ICP备2022003747号-1',
    recordLink: 'https://beian.miit.gov.cn/',
    startYear: '2018',
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
    ['link', { rel: 'icon', href: '/avatar.jpg' }],
    ['script', { src: '/sakuraPlus.js' }]
  ],
  plugins: [['@vuepress-reco/comments', {
    solution: 'valine',
    options: {
      appId: 'MvZhG7RpKfUxEzQ3QyZVfSQm-gzGzoHsz',
      appKey: 'vuOZhBlXD1gUMH63LCTzWz4s',
    }
  }]] 
}
