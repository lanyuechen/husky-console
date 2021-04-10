export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/Login',
          },
        ],
      },
    ],
  },
  {
    path: '/dashboard',
    name: '仪表盘',
    icon: 'dashboard',
    component: './Dashboard',
  },
  {
    name: '分类管理',
    icon: 'ClusterOutlined',
    path: '/category',
    component: './Category',
  },
  {
    name: '资源管理',
    icon: 'DatabaseOutlined',
    path: '/resource',
    component: './Resource',
  },
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    component: './404',
  },
];
