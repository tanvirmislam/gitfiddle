import Home from '../components/sketch'

export const routes = [
    { name: 'home', path: '/', component: Home, display: 'GitFiddle', meta: { title: 'GitFiddle' }, icon: 'home' },
    { path: '*', redirect: '/' }
];
