import { IConfig, IPlugin } from 'umi-types';
import defaultSettings from './defaultSettings'; // https://umijs.org/config/

import slash from 'slash2';
import webpackPlugin from './plugin.config';
const { pwa, primaryColor } = defaultSettings; // preview.pro.ant.design only do not use in your production ;
// preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。

const { ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION } = process.env;
const isAntDesignProPreview = ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site';
const plugins: IPlugin[] = [
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true,
      },
      locale: {
        // default false
        enable: true,
        // default PT
        default: 'pt-BR',
        // default true, when it is true, will use `navigator.language` overwrite default
        baseNavigator: true,
      },
      // dynamicImport: {
      //   loadingComponent: './components/PageLoading/index',
      //   webpackChunkName: true,
      //   level: 3,
      // },
      pwa: pwa
        ? {
          workboxPluginMode: 'InjectManifest',
          workboxOptions: {
            importWorkboxFrom: 'local',
          },
        }
        : false, // default close dll, because issue https://github.com/ant-design/ant-design-pro/issues/4665
      // dll features https://webpack.js.org/plugins/dll-plugin/
      // dll: {
      //   include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
      //   exclude: ['@babel/runtime', 'netlify-lambda'],
      // },
    },
  ],
  [
    'umi-plugin-pro-block',
    {
      moveMock: false,
      moveService: false,
      modifyRequest: true,
      autoAddMenu: true,
    },
  ],
]; // 针对 preview.pro.ant.design 的 GA 统计代码

if (isAntDesignProPreview) {
  plugins.push([
    'umi-plugin-ga',
    {
      code: 'UA-72788897-6',
    },
  ]);
}

export default {
  plugins,
  block: {
    // 国内用户可以使用码云
    // defaultGitUrl: 'https://gitee.com/ant-design/pro-blocks',
    defaultGitUrl: 'https://github.com/ant-design/pro-blocks',
  },
  hash: true,
  targets: {
    ie: 11,
  },
  devtool: isAntDesignProPreview ? 'source-map' : false,
  // umi routes: https://umijs.org/zh/guide/router.html
  routes: [
    {
      path: '/',
      component: '../layouts/BlankLayout',
      routes: [
        {
          path: '/user',
          component: '../layouts/UserLayout',
          routes: [
            {
              path: '/user',
              redirect: '/user/login',
            },
            {
              name: 'login',
              icon: 'smile',
              path: '/user/login',
              component: './user/login',
            },
            {
              name: 'register-result',
              icon: 'smile',
              path: '/user/register-result',
              component: './user/register-result',
            },
            {
              name: 'register',
              icon: 'smile',
              path: '/user/register',
              component: './user/register',
            },
          ],
        },
        {
          path: '/',
          component: '../layouts/BasicLayout',
          Routes: ['src/pages/Authorized'],

          routes: [
            {
              path: '/',
              redirect: '/user/login',
            },
            {
              path: '/dashboard/analysis',

              name: 'dashboard',
              icon: 'dashboard',
              authority: ['admin', 'user'],
              component: './dashboard/analysis',
            },

            {
              path: '/student',
              icon: 'user',
              name: 'student',
              routes: [
                {
                  name: 'create',
                  icon: 'user-add',
                  path: '/student/create',
                  authority: ['admin', 'user'],
                  component: './student/create',
                },

                {
                  name: 'renew',
                  icon: 'edit',
                  path: '/student/renew',
                  authority: ['admin', 'user'],
                  component: './student/renew',
                },

                {
                  name: 'history',
                  icon: 'history',
                  path: '/student/history',
                  authority: ['admin', 'user'],
                  component: './student/history',
                },

                {
                  name: 'inativate',
                  icon: 'inativate',
                  path: '/student/inativate/:id',
                  authority: ['admin', 'user'],
                  hideInMenu: true,
                  component: './student/inativate',
                },
                {
                  name: 'edit',
                  icon: 'edit',
                  path: '/student/edit/:id',
                  authority: ['admin', 'user'],
                  hideInMenu: true,
                  component: './student/edit',
                },
                {
                  name: 'maitain',
                  icon: 'edit',
                  path: '/student/mantain',
                  authority: ['admin', 'user'],
                  component: './student/mantain',
                },
              ],
            },

            {
              path: '/payment',
              icon: 'dollar',
              name: 'payment',
              routes: [
                {
                  name: 'pay',
                  icon: 'pay-circle',
                  path: '/payment/pay',
                  authority: ['admin', 'user'],
                  component: './payment/pay',
                },
                {
                  name: 'pay.confirm',
                  icon: 'pay-circle',
                  path: '/payment/pay/confirm/:paymentId',
                  component: './payment/pay/confirm',

                  hideInMenu: true,
                },

                {
                  name: 'pay.anull',
                  icon: 'pay-circle',
                  path: '/payment/pay/anull/:paymentId',
                  component: './payment/pay/anull',

                  hideInMenu: true,
                },
                {
                  name: 'pay.details',
                  icon: 'pay-circle',
                  path: '/payment/pay/details/:paymentId',
                  component: './payment/pay/details',
                  hideInMenu: true,
                },

                {
                  name: 'paid',
                  icon: 'credit-card',
                  path: '/payment/paid',
                  authority: ['admin'],
                  component: './payment/paid',
                },

                {
                  name: 'unpaid',
                  icon: 'close-circle',
                  path: '/payment/unpaid',
                  authority: ['admin', 'user'],
                  component: './payment/unpaid',
                },
              ],
            },

            // //TEACHER BEGIN
            // {
            //   path: '/teacher',
            //   icon: 'user',
            //   name: 'teacher',
            //   routes: [
            //     {
            //       name: 'create',
            //       icon: 'user-add',
            //       path: '/teacher/create',
            //       authority: ['admin', 'user'],
            //       component: './teacher/create',
            //     },

            //     {
            //       name: 'edit',
            //       icon: 'edit',
            //       path: '/teacher/edit/:id',
            //       authority: ['admin', 'user'],
            //       hideInMenu: true,
            //       component: './teacher/edit',
            //     },
            //     {
            //       name: 'list',
            //       icon: 'list',
            //       path: '/teacher/list',
            //       authority: ['admin', 'user'],
            //       component: './teacher/list',
            //     },
            //   ],
            // },
            // //END TEACHER

            // //BEGIN CLASS 
            // {
            //   path: '/class',
            //   icon: 'user-add',
            //   name: 'class',
            //   routes: [
            //     {
            //       name: 'allocatestudent',
            //       icon: 'user-add',
            //       path: '/class/allocateStudent',
            //       authority: ['admin', 'user'],
            //       component: './class/allocateStudent',
            //     },
            //     {
            //       name: 'view',
            //       icon: 'list',
            //       path: '/class/view',
            //       authority: ['admin', 'user'],
            //       component: './class/view',
            //     },
            //     {
            //       name: 'configureclasses',
            //       icon: 'user-add',
            //       path: '/class/classConfiguration',
            //       authority: ['admin', 'user'],
            //       component: './class/classConfiguration',
            //     },
            //   ],
            // },
            // //END CLASS

            // //BEGIN AGENDA 
            // {
            //   path: '/agenda',
            //   icon: 'user-add',
            //   name: 'agenda',
            //   routes: [
            //     {
            //       name: 'create',
            //       icon: 'user-add',
            //       path: '/agenda/create',
            //       authority: ['admin', 'user'],
            //       component: './agenda/create',
            //     },

            //     {
            //       name: 'publish',
            //       icon: 'user-add',
            //       path: '/agenda/publish',
            //       authority: ['admin', 'user'],
            //       component: './agenda/publish',
            //     },

            //     {
            //       name: 'list',
            //       icon: 'list',
            //       path: '/agenda/list',
            //       authority: ['admin', 'user'],
            //       component: './agenda/list',
            //     },
            //   ],
            // },
            // //END AGENDA

            {
              path: '/setting',
              icon: 'setting',

              name: 'setting',
              routes: [
                {
                  name: 'payment',
                  icon: 'tool',
                  authority: ['admin'],
                  path: '/setting/payment',
                  component: './setting/payment',
                },
               
              ],
            },
            {
              path: '/report',
              icon: 'pie-chart',

              name: 'report',
              routes: [
                {
                  name: 'student',
                  icon: 'audit',
                  path: '/report/student',
                  authority: ['admin'],
                  component: './report/student',
                },
                {
                  name: 'payment',
                  icon: 'audit',
                  path: '/report/payment',
                  authority: ['admin'],
                  component: './report/payment',
                },
              ],
            },
            {
              name: 'account',
              icon: 'user',
              path: '/account',
              routes: [
                {
                  name: 'center',
                  icon: 'smile',
                  path: '/account/center',
                  authority: ['admin', 'user'],
                  component: './account/center',
                  hideInMenu: true,
                },
                {
                  name: 'settings',
                  icon: 'smile',
                  path: '/account/settings',
                  authority: ['admin', 'user'],
                  component: './account/settings',
                  hideInMenu: true,
                },

                {
                  name: 'create',
                  icon: 'smile',
                  path: '/account/create',
                  authority: ['admin'],
                  component: './user/create',
                },
                {
                  name: 'maintain',
                  icon: 'smile',
                  authority: ['admin'],
                  path: '/account/maintain',
                  component: './user/maintain',
                },
              ],
            },
            {
              name: 'dashboard',
              icon: 'dashboard',
              component: './exception/403',
            },
          ],
        },
        {
          component: '404',
        },
      ],
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': primaryColor,
  },
  define: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION:
      ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION || '', // preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (
      context: {
        resourcePath: string;
      },
      _: string,
      localName: string,
    ) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }

      const match = context.resourcePath.match(/src(.*)/);

      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = slash(antdProPath)
          .split('/')
          .map((a: string) => a.replace(/([A-Z])/g, '-$1'))
          .map((a: string) => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }

      return localName;
    },
  },
  manifest: {
    basePath: '/',
  },
  chainWebpack: webpackPlugin,
  /*
  proxy: {
    '/server/api/': {
      target: 'https://preview.pro.ant.design/',
      changeOrigin: true,
      pathRewrite: { '^/server': '' },
    },
  },
  */
} as IConfig;
