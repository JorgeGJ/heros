<template>
  <div
    class="min-h-screen bg-black text-white font-retro flex items-center justify-center px-4"
    :style="{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }"
  >
    <div class="bg-gray-900 border-4 border-yellow-400 shadow-[6px_6px_0px_#000] p-6 w-full max-w-2xl space-y-6 text-center">
      <h2 v-if="currentStage < pruebas.length" class="text-xl text-yellow-300">
        {{ pruebas[currentStage].nombre }}
      </h2>
      <div v-if="currentStage < pruebas.length">
        <p class="text-sm text-gray-300">Evaluando prueba...</p>
        <ul class="mt-4 space-y-2 text-left">
          <li v-for="h in resultadosParciales" :key="h.name">
            {{ h.name }}: {{ h.valor }} puntos
          </li>
        </ul>
      </div>
      <div v-else>
        <h3 class="text-lg text-yellow-400 mb-2">🏆 Clasificación final</h3>
        <ol class="space-y-4 text-left">
          <li
            v-for="(hero, i) in clasificacionFinal"
            :key="hero.name"
            class="flex items-center gap-4 bg-gray-800 px-4 py-3 border border-yellow-400 shadow-[4px_4px_0px_#000]"
          >
            <span class="text-xl">
              {{ i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉' }}
            </span>
            <img :src="hero.picture" alt="Hero image" class="w-12 h-12 border-2 border-black object-cover" />
            <span class="flex-1 font-bold text-yellow-300 text-sm">{{ hero.name }}</span>
            <span class="text-sm text-white">{{ hero.puntos }} pts</span>
          </li>
        </ol>
        <button
          @click="$router.push('/')"
          class="mt-6 bg-yellow-400 border-2 border-black text-black px-4 py-2 shadow-[3px_3px_0px_#000] hover:shadow-[1px_1px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] transition-all"
        >
           Volver al inicio
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useHeroStore } from '@/stores/heroStore'
import backgroundImage from '@/assets/img/arena.webp'

const store = useHeroStore()
const route = useRoute()

const selectedIds = ((route.query.ids as string) || '').split(',').filter(Boolean)
const selectedHeroes = store.heroes.filter(h => selectedIds.includes(h.id))

const currentStage = ref(0)
const resultadosParciales = ref<any[]>([])
const clasificacion = ref<Record<string, number>>({})
const victorias = ref<Record<string, number>>({})
const lastWinner = ref('')

const pruebas = [
  {
    nombre: 'Trepar rascacielos',
    calcular: (h: any) => h.attributes.strength * 4 - h.attributes.weight * 2
  },
  {
    nombre: 'Contar chiste',
    calcular: (h: any, others: any[]) =>
      h.attributes.charisma ** 2 - others.reduce((sum, o) => sum + o.attributes.charisma, 0)
  },
  {
    nombre: 'Tiro al villano',
    calcular: (h: any, _others: any[], clasif: Record<string, number>) =>
      h.attributes.agility + h.attributes.strength + (getPos(h.name, clasif) === 2 ? 5 : 0)
  },
  {
    nombre: '200km lisos',
    calcular: (h: any, _1: any[], _2: any, prevWinner: string) =>
      h.attributes.agility * 4 + h.attributes.endurance * 2 + (h.name === prevWinner ? 10 : -1)
  },
  {
    nombre: 'Rescate de gatitos',
    calcular: (h: any, _1: any[], _2: any, _3: any, victorias: Record<string, number>) =>
      h.attributes.agility * 2 + (victorias[h.name] >= 2 ? 5 : 0)
  }
]

const getPos = (name: string, clasif: Record<string, number>) => {
  const sorted = Object.entries(clasif).sort((a, b) => a[1] - b[1])
  return sorted.findIndex(([n]) => n === name)
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

onMounted(async () => {
  for (let i = 0; i < pruebas.length; i++) {
    const prueba = pruebas[i]
    currentStage.value = i

    const valores = selectedHeroes.map(h => {
      const otros = selectedHeroes.filter(o => o.id !== h.id)
      const valor = prueba.calcular(h, otros, clasificacion.value, lastWinner.value, victorias.value)
      return { name: h.name, valor, hero: h }
    })

    valores.sort((a, b) => b.valor - a.valor)
    resultadosParciales.value = valores

    const puntos = [5, 3, 1]
    valores.forEach((res, index) => {
      clasificacion.value[res.name] = (clasificacion.value[res.name] || 0) + puntos[index]
      if (index === 0) {
        victorias.value[res.name] = (victorias.value[res.name] || 0) + 1
        lastWinner.value = res.name
      }
    })

    await sleep(5000)
  }

  currentStage.value = pruebas.length
})

const clasificacionFinal = computed(() =>
  Object.entries(clasificacion.value)
    .map(([name, puntos]) => {
      const hero = selectedHeroes.find(h => h.name === name)
      return {
        name,
        puntos,
        picture: hero?.picture || ''
      }
    })
    .sort((a, b) => b.puntos - a.puntos)
)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

.font-retro {
  font-family: 'Press Start 2P', monospace;
}
</style>
