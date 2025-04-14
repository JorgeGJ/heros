<template>
  <div
    class="min-h-screen flex items-center justify-center"
    :style="{
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }"
  >
    <div class="flex flex-col items-center space-y-4">
      <button @click="openModal = true" class="pixel-btn w-64">
        Añadir nuevo Superhéroe
      </button>
      <button @click="router.push('/heroes')" class="pixel-btn w-64">
        Ver todos los Superhéroes
      </button>
      <button @click="router.push('/competencia')" class="pixel-btn w-64">
        Competición
      </button>
      <button @click="refresh()" class="pixel-btn w-64">
        Refrescar Api Key
      </button>
    </div>
    <HeroModalForm v-if="openModal" @close="openModal = false" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import HeroModalForm from '@/components/HeroModalForm.vue'
import backgroundImage from '@/assets/img/menu.webp'
import { heroService } from '@/services/heroService.ts'
const router = useRouter()
const openModal = ref(false)


const refresh = async () => {
  try {
    const response = await heroService.refreshApiKey()
    console.log('API Key refreshed:', response)
  } catch (error) {
    console.error('Error refreshing API Key:', error)
  }
}
</script>

<style scoped>
.pixel-btn {
  @apply bg-yellow-400 text-black font-bold text-center text-lg uppercase tracking-wide border-2 border-black 
    px-6 py-3 shadow-[4px_4px_0px_#000] hover:bg-yellow-300 hover:shadow-[2px_2px_0px_#000] 
    active:translate-x-[2px] active:translate-y-[2px] transition-all duration-150;
  font-family: 'Press Start 2P', monospace;
}
</style>
