module.exports = {
  router: {
    linkActiveClass: 'active',
    extendRoutes(routes, resolve) {
      routes.splice(0)

      routes.push(...[
        {
          path: '/',
          component: resolve(__dirname, 'pages/layout/'),
          children: [
            {
              path: '',
              name: 'Home',
              component: resolve(__dirname, 'pages/home/')
            },
            {
              path: '/login',
              name: 'Login',
              component: resolve(__dirname, 'pages/login/')
            },
            {
              path: '/register',
              name: 'Register',
              component: resolve(__dirname, 'pages/login/')
            },
            {
              path: '/profile/:username',
              name: 'Profile',
              component: resolve(__dirname, 'pages/profile/')
            },
            {
              path: '/settings',
              name: 'Settings',
              component: resolve(__dirname, 'pages/settings/')
            },
            {
              path: '/editor',
              name: 'Editor',
              component: resolve(__dirname, 'pages/editor/')
            },
            {
              path: '/article/:slug',
              name: 'Article',
              component: resolve(__dirname, 'pages/article/')
            }
          ]
        }
      ])
      // routes.push({
      //   name: 'custom',
      //   path: '*',
      //   component: resolve(__dirname, 'pages/404.vue')
      // })
    }
  },

  server: {
    host: '0.0.0.0',
    port: 3306
  },

  plugins: [
    '~/plugins/request.js',
    '~/plugins/dayjs.js'
  ]
}