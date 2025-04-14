import { createRouter, createWebHistory } from 'vue-router'

// Importaciones vistas
import Welcome from '@/components/Welcome.vue'
import Home from '@/views/Home.vue'
import Competition from '@/views/Competition.vue'
import CompetitionArena from '@/views/CompetitionArena.vue'

const routes = [
  // Bienvenida al cargar la app
  { path: '/', name: 'Welcome', component: Welcome },

  // Pantalla principal tras entrar
  { path: '/home', name: 'Home', component: Home },

  // CRUD y Competencia
  { path: '/heroes', name: 'Heroes', component: () => import('@/views/HeroList.vue') },
  { path: '/competencia', name: 'Competencia', component: Competition },
  { path: '/arena', name: 'Arena', component: CompetitionArena }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
