m<template>
    <div class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div class="bg-white border-4 border-black shadow-[6px_6px_0px_#000] w-[90%] max-w-md p-6 font-retro text-black">
        <h2 class="text-lg mb-4">¿Seguro que quieres eliminar este superhéroe?</h2>
        <div class="flex justify-end gap-4">
          <button @click="$emit('cancel')" class="btn-cancel">Cancelar</button>
          <button @click="$emit('confirm')" class="btn-confirm">Eliminar</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  defineEmits(['confirm', 'cancel'])
  </script>
  
  <style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
  
  .font-retro {
    font-family: 'Press Start 2P', monospace;
  }
  
  .btn-cancel {
    @apply px-4 py-2 bg-gray-300 border-2 border-black shadow-[3px_3px_0px_#000] text-sm
           hover:shadow-[1px_1px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] transition-all;
  }
  
  .btn-confirm {
    @apply px-4 py-2 bg-red-500 border-2 border-black text-white shadow-[3px_3px_0px_#000] text-sm
           hover:bg-red-400 hover:shadow-[1px_1px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] transition-all;
  }
  </style>
  