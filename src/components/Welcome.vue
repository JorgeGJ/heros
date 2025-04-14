<template>
  <div
    class="h-screen w-full flex flex-col items-center justify-center text-white"
    :style="{
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }"
  >
    <button
      @click="router.push('/home')"
      class="relative font-retro px-6 py-3 bg-yellow-400 text-black font-bold text-lg uppercase tracking-wide shadow-[4px_4px_0px_#000] border-2 border-black 
      hover:bg-yellow-300 hover:shadow-[2px_2px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] transition-all duration-150"
    >
      Entrar al Pentatlón
    </button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import backgroundImage from '@/assets/img/pentalon.webp'

const router = useRouter()
</script>