import Sketch from '../components/sketch'

export const routes = [
    { name: 'Sketch', path: '/', component: Sketch, display: 'Sketch', meta: { title: 'GitFiddle' } },
    { path: '*', redirect: '/' }
];
