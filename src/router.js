import { createWebHistory, createRouter } from 'vue-router'
import HomePage from './components/HomePage.vue'
import LoginPage from './components/LoginPage.vue'
import RegisterPage from './components/RegisterPage.vue'
// lazy-loaded
const ProfilePage = () => import('./components/ProfilePage.vue')
const BoardAdmin = () => import('./components/BoardAdmin.vue')
const BoardModerator = () => import('./components/BoardModerator.vue')
const BoardUser = () => import('./components/BoardUser.vue')

const routes = [
    {
        path: '/',
        name: 'home',
        component: HomePage,
    },
    {
        path: '/home',
        component: HomePage,
    },
    {
        path: '/login',
        component: LoginPage,
    },
    {
        path: '/register',
        component: RegisterPage,
    },
    {
        path: '/profile',
        name: 'profile',
        // lazy-loaded
        component: ProfilePage,
    },
    {
        path: '/admin',
        name: 'admin',
        // lazy-loaded
        component: BoardAdmin,
    },
    {
        path: '/mod',
        name: 'moderator',
        // lazy-loaded
        component: BoardModerator,
    },
    {
        path: '/user',
        name: 'user',
        // lazy-loaded
        component: BoardUser,
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach((to, from, next) => {
    const publicPages = ['/login', '/register', '/home']
    const authRequired = !publicPages.includes(to.path)
    const loggedIn = localStorage.getItem('user')

    // trying to access a restricted page + not logged in
    // redirect to login page
    if (authRequired && !loggedIn) {
        console.log('redirect to login page')
        next('/login')
    } else {
        next()
    }
})

export default router