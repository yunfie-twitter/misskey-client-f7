import HomePage from '@/pages/HomePage.vue';
import LoginPage from '@/pages/LoginPage.vue';
import TimelinePage from '@/pages/TimelinePage.vue';
import NotificationsPage from '@/pages/NotificationsPage.vue';
import ProfilePage from '@/pages/ProfilePage.vue';
import PostPage from '@/pages/PostPage.vue';
import SettingsPage from '@/pages/SettingsPage.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage,
  },
  {
    path: '/timeline/:type',
    name: 'timeline',
    component: TimelinePage,
    meta: { requiresAuth: true }
  },
  {
    path: '/notifications',
    name: 'notifications',
    component: NotificationsPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile/:userId?',
    name: 'profile',
    component: ProfilePage,
    meta: { requiresAuth: true }
  },
  {
    path: '/post',
    name: 'post',
    component: PostPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingsPage,
  }
];

export default routes;
