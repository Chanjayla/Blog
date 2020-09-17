
module.exports = {
  telemetry: false,
  mode: 'universal',
  /*
  ** Headers of the page
  */
  // head: {
  //   title: process.env.npm_package_name || '',
  //   meta: [
  //     { charset: 'utf-8' },
  //     { name: 'viewport', content: 'width=device-width, initial-scale=1' },
  //     { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
  //   ],
  //   link: [
  //     { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
  //   ]
  // },
  env: {
    baseUrl: process.env.NODE_ENV === 'development' ? process.env.DEV_BASE_URL : process.env.PRO_BASE_URL
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
    '@/styles/main.scss',
    'element-ui/lib/theme-chalk/index.css',
    // lib css
    'codemirror/lib/codemirror.css',
    // theme css
    'codemirror/theme/zenburn.css'

  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~plugins/filter',
    '~plugins/directive',
    '~plugins/axios',
    {
      src: '~plugins/element-ui',
      ssr: true
    },
    {
      src:  '~plugins/index',
      ssr: false
    }
   
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // '@nuxt/typescript-build',
    '@nuxtjs/svg'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/style-resources',
    '@nuxtjs/axios'
  ],
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
   extractCSS: true,
    extend (config, ctx) {
    }
  },
  vendor: [
    
  ],
  styleResources: {
    scss: [
      './styles/variables.scss', // 全局 scss 变量
    ]
  }
}
