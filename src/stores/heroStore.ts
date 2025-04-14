import { defineStore } from 'pinia'
import { heroService } from '@/services/heroService'

export const useHeroStore = defineStore('hero', {
  state: () => ({
    heroes: JSON.parse(localStorage.getItem('heroes') || '[]'),
    loading: false,
    error: null as string | null
  }),

  actions: {
    async loadHeroes() {
      this.loading = true
      this.error = null
      try {
        this.heroes = await heroService.getAllHeroes()
        localStorage.setItem('heroes', JSON.stringify(this.heroes))
      } catch (err: any) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    async addHero(hero: {
      name: string
      picture: string
      attributes: {
        agility: number
        strength: number
        weight: number
        endurance: number
        charisma: number
      }
    }) {
      try {
        const newHero = await heroService.createHero(hero)
        this.heroes.push(newHero)
      } catch (err: any) {
        this.error = err.message
        throw err
      }
    },

    async removeHero(id: string) {
      try {
        await heroService.deleteHero(id)
        this.heroes = this.heroes.filter(hero => hero.id !== id)
      } catch (err: any) {
        this.error = err.message
        throw err
      }
    },

    async editHero(id: string, updatedData: {
      name: string
      picture: string
      attributes: {
        agility: number
        strength: number
        weight: number
        endurance: number
        charisma: number
      }
    }) {
      try {
        const updatedHero = await heroService.updateHero(id, updatedData)
        const index = this.heroes.findIndex(h => h.id === id)
        if (index !== -1) this.heroes[index] = updatedHero
      } catch (err: any) {
        this.error = err.message
        throw err
      }
    }
  },
  persist: true,
})
