<template>
  <div class="modal-overlay">
    <div class="modal-box">
      <h2 class="text-xl mb-6 text-center font-retro text-black">
        {{ hero ? ' Editar Superhéroe' : ' Añadir Superhéroe' }}
      </h2>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <input
          v-model="form.name"
          type="text"
          placeholder="Nombre del superhéroe"
          class="input"
          :disabled="hero"
          required
        />
        <div>
          <label class="block mb-1 font-retro text-sm text-black">
            Imagen 
          </label>
          <input
            type="file"
            @change="handleImageUpload"
            accept="image/*"
            class="file-input"
            :required="!hero"
          />
          <div v-if="form.imageBase64" class="mt-2">
            <img
              :src="form.imageBase64"
              alt="preview"
              class="w-32 h-32 object-contain border-2 border-black"
            />
          </div>
        </div>
        <div
          v-for="attr in attributes"
          :key="attr"
          class="flex items-center justify-between gap-4"
        >
          <label class="font-retro text-xs text-black w-32">
            {{ attr.charAt(0).toUpperCase() + attr.slice(1) }}
          </label>
          <input
            type="number"
            v-model.number="form[attr]"
            :min="0"
            :max="10"
            class="input max-w-[100px] text-right"
            required
          />
        </div>
        <div class="flex justify-end mt-6 space-x-4">
          <button type="button" @click="$emit('close')" class="btn-cancel">
            Cancelar
          </button>
          <button type="submit" class="btn-save">Guardar</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import { useHeroStore } from '@/stores/heroStore'

const emit = defineEmits(['close', 'save'])

const props = defineProps<{
  hero?: any
}>()

const store = useHeroStore()

const form = reactive({
  name: '',
  imageBase64: '',
  agilidad: 0,
  fuerza: 0,
  peso: 0,
  resistencia: 0,
  carisma: 0
})

const attributes = ['agilidad', 'fuerza', 'peso', 'resistencia', 'carisma'] as Array<keyof typeof form>

watch(
  () => props.hero,
  (newHero) => {
    if (newHero) {
      form.name = newHero.name
      form.imageBase64 = newHero.picture || ''
      form.agilidad = newHero.attributes?.agility ?? 0
      form.fuerza = newHero.attributes?.strength ?? 0
      form.peso = newHero.attributes?.weight ?? 0
      form.resistencia = newHero.attributes?.endurance ?? 0
      form.carisma = newHero.attributes?.charisma ?? 0
    }
  },
  { immediate: true }
)

const handleImageUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = 128
      canvas.height = 128
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        alert('Error al procesar la imagen.')
        return
      }

      ctx.clearRect(0, 0, 128, 128)
      ctx.drawImage(img, 0, 0, 128, 128)

      form.imageBase64 = canvas.toDataURL('image/png')
    }

    img.src = e.target?.result as string
  }

  reader.readAsDataURL(file)
}

const handleSubmit = async () => {
  const heroData = {
    name: form.name,
    picture: form.imageBase64,
    attributes: {
      agility: form.agilidad,
      strength: form.fuerza,
      weight: form.peso,
      endurance: form.resistencia,
      charisma: form.carisma
    }
  }

  try {
    if (props.hero?.id) {
      await store.editHero(props.hero.id, heroData)
    } else {
      await store.addHero(heroData)
    }

    emit('save')
    emit('close')
  } catch (err: any) {
    alert(err.message)
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

.font-retro {
  font-family: 'Press Start 2P', monospace;
}

.input {
  @apply w-full border-2 border-black rounded-none px-4 py-2 bg-white font-retro text-sm text-black appearance-none;
}

.file-input {
  @apply border-2 border-black bg-white px-2 py-1 font-retro text-xs w-full text-black;
}

.btn-cancel {
  @apply px-4 py-2 bg-gray-300 border-2 border-black shadow-[3px_3px_0px_#000] font-retro text-sm 
         hover:shadow-[1px_1px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] transition-all;
}

.btn-save {
  @apply px-4 py-2 bg-yellow-400 border-2 border-black text-black font-bold shadow-[3px_3px_0px_#000] font-retro text-sm
         hover:bg-yellow-300 hover:shadow-[1px_1px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] transition-all;
}

.modal-box {
  @apply bg-white p-6 border-4 border-black shadow-[6px_6px_0px_#000] w-[90%] max-w-lg;
  font-family: 'Press Start 2P', monospace;
}

.modal-overlay {
  @apply fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50;
}
</style>
