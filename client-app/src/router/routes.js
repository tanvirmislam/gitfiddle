import Home from '../components/sketch'

export const routes = [
    { name: 'home', path: '/', component: Home, display: 'Home', icon: 'home' },
    { path: '*', redirect: '/' }
];
