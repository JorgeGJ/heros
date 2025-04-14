<template>
    <div class="pixel-card text-white text-sm">
        <img
            :src="hero.picture"
            alt="hero image"
            class="w-32 h-32 object-cover border-2 border-black mx-auto mb-4"
        />
        <h2 class="text-base font-retro text-center mb-2">{{ hero.name }}</h2>

        <ul
            class="stat-list font-retro text-xs text-yellow-300 bg-black bg-opacity-30 border-2 border-yellow-500 p-3 space-y-2 rounded"
        >
            <li>
                Agilidad:
                <span class="float-right text-white">{{ hero.attributes.agility }}</span>
            </li>
            <li>
                Fuerza:
                <span class="float-right text-white">{{ hero.attributes.strength }}</span>
            </li>
            <li>
                Peso:
                <span class="float-right text-white">{{ hero.attributes.weight }}</span>
            </li>
            <li>
                Resistencia:
                <span class="float-right text-white">{{ hero.attributes.endurance }}</span>
            </li>
            <li>
                Carisma:
                <span class="float-right text-white">{{ hero.attributes.charisma }}</span>
            </li>
        </ul>

        <div v-if="!readonly" class="flex justify-center gap-2 mt-4">
            <button
                class="pixel-btn bg-blue-500 hover:bg-blue-400"
                @click="editHero(hero)"
            >
                Editar
            </button>
            <button
                class="pixel-btn bg-red-500 hover:bg-red-400"
                @click="askToDelete(hero.id)"
            >
                Borrar
            </button>
            <ConfirmModal
                v-if="showConfirm"
                @cancel="showConfirm = false"
                @confirm="confirmDelete"
            />
        </div>

        <HeroFormModal
            v-if="showModal"
            :hero="editingHero"
            @close="showModal = false"
        />
    </div>
</template>

<script setup lang="ts">
import { useHeroStore } from '@/stores/heroStore'
import HeroFormModal from '@/components/HeroModalForm.vue'
import { ref } from 'vue'
import ConfirmModal from '@/components/ConfirmModal.vue'

const emit = defineEmits(['close', 'save', 'hero-updated', 'hero-deleted'])
const showModal = ref(false)
const editingHero = ref(null)
const store = useHeroStore()
const { removeHero } = store
const showConfirm = ref(false)
const heroToDelete = ref<string | null>(null)
const props = defineProps<{
    hero: any,
    readonly?: boolean
}>()

const editHero = (hero: any) => {
    editingHero.value = hero
    showModal.value = true
}

const askToDelete = (id: string) => {
  heroToDelete.value = id
  showConfirm.value = true
}

const confirmDelete = async () => {
  if (!heroToDelete.value) return
  try {
    await removeHero(heroToDelete.value)
        
  } catch (err: any) {
    console.log('❌ Error al eliminar: ' + err.message)
  } finally {
    showConfirm.value = false
    heroToDelete.value = null
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

.font-retro {
    font-family: 'Press Start 2P', monospace;
}

.pixel-card {
    @apply bg-gray-900 border-4 border-yellow-400 shadow-[6px_6px_0px_#000] p-4 rounded-none;
}

.pixel-btn {
    @apply px-4 py-2 border-2 border-black text-white shadow-[3px_3px_0px_#000] font-retro text-xs
                 hover:shadow-[1px_1px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] transition-all;
}

.stat-list {
    line-height: 1.6;
    letter-spacing: 0.03em;
}
</style>