
module.exports = {
  telemetry: false,
  mode: 'universal',
  /*
  ** Headers of the page
  */
  html: {
    lang: 'en'
  },
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, user-scalable=0' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' },
      { name: 'description', content: 'Genos Blog' },
      { name: 'referrer', content: 'no-referrer' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
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
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '~plugins/filter',
    '~plugins/directive',
    '~plugins/axios',
    '~plugins/router',
    {
      src: '~plugins/element-ui',
      ssr: true
    },
    {
      src: '~plugins/codemirror',
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
    extend(config, ctx) {
      config.optimization.splitChunks = {
        cacheGroups: {
          blog: {
            test: /pages\/blog/,
            name: 'blog',
            chunks: 'async',
            priority: 1,
            minChunks: 1
          },
          admin: {
            test: /pages\/admin/,
            name: 'admin',
            chunks: 'async',
            priority: 1,
            minChunks: 1
          },
          detail: {
            test: /pages\/post/,
            name: 'post',
            chunks: 'async',
            priority: 1,
            minChunks: 1
          },
          elementui: {
            test: /element-ui/,
            name: 'element-ui',
            chunks: 'initial',
            priority: 1,
            minChunks: 1
          },
          // codemirror: {
          //   test: /codemirror/,
          //   name: 'codemirror',
          //   chunks: 'initial',
          //   priority: 2,
          //   minChunks: 1
          // },
          common: {
            test: /api|utils|assets|styles/,
            name: 'common',
            chunks: 'async',
            priority: 2,
            minChunks: 1
          },
          marked: {
            test: /marked/,
            name: 'marked',
            chunks: 'async',
            priority: 2,
            minChunks: 2
          }
        }
      }
    },
    analyza: {
      analyzeMode: 'static'
    },
    postcss: {
      plugins: {
        // 通过传递 false 来禁用插件

      },
      preset: {
        // 更改postcss-preset-env 设置
        autoprefixer: {
          overrideBrowserslist: [
            "Android 4.1",
            "iOS 7.1",
            "Chrome > 31",
            "ff > 31",
            "ie >= 9"
            //'last 10 versions', // 所有主流浏览器最近2个版本
          ]
        }
      }
    },
    babel: {
      plugins: [
        [
          'component',
          {
            libraryName: 'element-ui',
            styleLibraryName: 'theme-chalk'
          }
        ]
      ]
    }
  },
  vendor: [

  ],
  styleResources: {
    scss: [
      './styles/variables.scss', // 全局 scss 变量
    ]
  },
  server: {
    port: 3000,
    port2: 3001,
    host: '0.0.0.0'
  }
}
