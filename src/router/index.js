import { createRouter, createWebHistory } from 'vue-router';

import Home from '../views/Home.vue'
import About from '../views/About.vue'


const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About,
  },
  {
    path: '/contact',
    name: 'Contact',
    component: () => import(/* webpackChunkName: "route-contact" */ '../views/Contact.vue')
  },
  {
    path: '/documentation',
    name: 'Docs',
    component: () => import(/* webpackChunkName: "route-contact" */ '../views/Docs.vue')
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})
export default router
