import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../views/Home.vue";

const routes = [
    {
        path: '/',
        redirect: '/commonquery'
    }, {
        path: "/",
        name: "Home",
        component: Home,
        children: [
            {
                path: "/video",
                name: "video",
                meta: {
                    title: '视频推荐'
                },
                component: () => import( /* webpackChunkName: "table" */ "../views/VideoRecommand.vue")
            },  {
                path: "/table",
                name: "table",
                meta: {
                    title: '基本表格'
                },
                component: () => import( /* webpackChunkName: "table" */ "../views/BaseTable.vue")
            },{
                path: '/404',
                name: '404',
                meta: {
                    title: '找不到页面'
                },
                component: () => import(/* webpackChunkName: "404" */ '../views/404.vue')
            }, {
                path: '/403',
                name: '403',
                meta: {
                    title: '没有权限'
                },
                component: () => import(/* webpackChunkName: "403" */ '../views/403.vue')
            }, {
                path: '/personal',
                name: 'personal',
                meta: {
                    title: '个人中心'
                },
                component: () => import(/* webpackChunkName: "user" */ '../views/User.vue')
            },  {
                path: '/videoexcel',
                name: 'videoexcel',
                meta: {
                    title: '视频推荐上传'
                },
                component: () => import(/* webpackChunkName: "markdown" */ '../views/VideoUploadExcel.vue')
            },  {
                path: '/commonexcel',
                name: 'commonexcel',
                meta: {
                    title: '规则配置'
                },
                component: () => import(/* webpackChunkName: "markdown" */ '../views/UploadExcel.vue')
            },
            {
                path: '/commonquery',
                name: 'commonquery',
                meta: {
                    title: '规则展示'
                },
                component: () => import(/* webpackChunkName: "markdown" */ '../views/QueryExcel.vue')
            },
            {
                path:'/configimporthistory',
                name:'configimporthistory',
                meta:{
                    title:'配置表导入历史'
                },
                component:()=>import(/* webpackChunkName: "markdown" */ '../views/ConfigImportHistory.vue')
            }
        ]
    }, {
        path: "/login",
        name: "Login",
        meta: {
            title: '登录'
        },
        component: () => import( /* webpackChunkName: "login" */ "../views/Login.vue")
    }
];

const router = createRouter({
    history: createWebHashHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title} | 流量商业化C端`;
    const role = localStorage.getItem('ms_username');
    if (!role && to.path !== '/login') {
        next('/login');
    } else if (to.meta.permission) {
        // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
        role === 'admin'
            ? next()
            : next('/403');
    } else {
        next();
    }
});

export default router;