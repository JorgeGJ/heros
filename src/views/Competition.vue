<template>
  <div
    class="min-h-screen bg-black bg-opacity-70 text-white relative font-retro"
    :style="{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }"
  >
    <button
      @click="$router.back()"
      class="absolute top-6 left-6 bg-yellow-400 text-black border-4 border-black shadow-[4px_4px_0px_#000] px-4 py-2 text-xs sm:text-sm hover:shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] transition-all z-50"
    >
      ◀ Volver
    </button>

    <div class="max-w-5xl mx-auto px-6 py-20 space-y-10">
      <div class="bg-gray-900 border-4 border-yellow-400 shadow-[6px_6px_0px_#000] p-6 text-center space-y-4">
        <h1 class="text-xl text-yellow-300"> Selecciona a 3 campeones</h1>
        <select
          v-model="selectedId"
          @change="handleSelect"
          class="border-2 border-black px-4 py-2 bg-white text-black w-full max-w-md text-sm shadow-[3px_3px_0px_#000]"
        >
          <option disabled value="">-- Elige un campeón --</option>
          <option
            v-for="hero in availableHeroes"
            :key="hero.id"
            :value="hero.id"
          >
            {{ hero.name }}
          </option>
        </select>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div
          v-for="hero in selectedHeroes"
          :key="hero.id"
          class="relative"
        >
          <button
            @click="removeSelectedHero(hero.id)"
            class="absolute -top-2 -right-2 bg-red-400  font-retro border-2 border-black px-2 py-1 text-xs shadow-[2px_2px_0px_#000] hover:bg-red-500 active:translate-x-[1px] active:translate-y-[1px] transition-all z-10"
          >
            ❌
          </button>
          <cardHero :hero="hero" :readonly="true" />
        </div>
      </div>
      <div class="flex justify-center pt-6">
        <button
          @click="goToArena"
          :disabled="selectedHeroes.length < 3"
          class="bg-yellow-400 border-2 border-black px-6 py-3 text-black text-sm shadow-[4px_4px_0px_#000] hover:shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] transition-all disabled:opacity-50"
        >
         Arena
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useHeroStore } from '@/stores/heroStore'
import cardHero from '@/components/cardHero.vue'
import { useRouter } from 'vue-router'
import backgroundImage from '@/assets/img/arena.webp' 

const store = useHeroStore()
const { heroes, loadHeroes } = store
const router = useRouter()
const selectedId = ref('')
const selectedHeroes = ref<any[]>([])

onMounted(() => {
  if (!heroes.length) loadHeroes()
})

const availableHeroes = computed(() =>
  heroes.filter(h => !selectedHeroes.value.some(sel => sel.id === h.id))
)

const handleSelect = () => {
  if (selectedId.value && selectedHeroes.value.length < 3) {
    const hero = heroes.find(h => h.id === selectedId.value)
    if (hero) selectedHeroes.value.push(hero)
    selectedId.value = ''
  }
}

const removeSelectedHero = (id: string) => {
  selectedHeroes.value = selectedHeroes.value.filter(h => h.id !== id)
}

const goToArena = () => {
  const ids = selectedHeroes.value.map(h => h.id).join(',')
  router.push({
    path: '/arena',
    query: { ids }
  })
}
</script>
