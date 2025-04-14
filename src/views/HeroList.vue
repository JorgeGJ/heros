<template>
  <div
    class="min-h-screen bg-opacity-70 text-white relative"
    :style="{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }"
  >
    <button
      @click="$router.back()"
      class="fixed top-1 left-6 bg-yellow-400 text-black font-retro border-4 border-black shadow-[4px_4px_0px_#000] px-4 py-2 text-xs sm:text-sm hover:shadow-[2px_2px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] transition-all"
    >
      ◀ Volver
    </button>

    <div class="max-w-7xl mx-auto px-4 py-10">
      <div v-if="loading" class="text-center font-retro text-yellow-300 text-xl py-20 animate-pulse">
  ⏳ Cargando héroes...
</div>

<div v-else>
  <div v-if="heroes.length === 0" class="text-center font-retro text-white text-xl py-20">
    🫤 No hay superhéroes aún.
  </div>

  <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-5">
    <div v-for="hero in heroes" :key="hero.id">
      <cardHero :hero="hero"  @hero-updated="loadHeroes"
      @hero-deleted="loadHeroes" />
    </div>
  </div>
</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import cardHero from '@/components/cardHero.vue';
import { useHeroStore } from '@/stores/heroStore';
import { storeToRefs } from 'pinia';
import backgroundImage from '@/assets/img/heros.webp'
const store = useHeroStore();
const { heroes, loading  } = storeToRefs(store);
const { loadHeroes } = store
onMounted(() => {
  if (!heroes.value.length) {
    store.loadHeroes();
  }
});
</script>
