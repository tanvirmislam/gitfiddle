import Sketch from '../components/sketch'

export const routes = [
  { name: 'Home', path: '/', component: Sketch, display: 'Home', meta: { title: 'GitFiddle' } },
  { path: '*', redirect: '/' }
]
