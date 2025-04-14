const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = 'https://codetest-api.applivery.io/pentathlon';
let currentApiKey = API_KEY
export const heroService = {
  async  refreshApiKey() {
    const res = await fetch(`https://codetest-api.applivery.io/api-keys/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}), 
    });
  
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Error al refrescar la API key');
    }
  
    const data = await res.json();
    currentApiKey = data.id;
    return currentApiKey;
  },
  async getAllHeroes() {
    const res = await fetch(`${BASE_URL}/heroes`, {
      headers: { authorization: currentApiKey },
    });
    if (!res.ok) throw new Error('Error al obtener héroes');
    return await res.json();
  },

  async createHero(hero: {
    name: string;
    picture: string;
    attributes: {
      agility: number;
      strength: number;
      weight: number;
      endurance: number;
      charisma: number;
    };
  }) {
    const res = await fetch(`${BASE_URL}/heroes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: currentApiKey,
      },
      body: JSON.stringify(hero),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Error al crear superhéroe');
    }
    return await res.json();
  },

  async deleteHero(id: string) {
    const res = await fetch(`${BASE_URL}/heroes/${id}`, {
      method: 'DELETE',
      headers: {
        authorization: API_KEY,
      },
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Error al eliminar el superhéroe');
    }
  },

  async updateHero(
    id: string,
    hero: {
      name: string;
      picture: string;
      attributes: {
        agility: number;
        strength: number;
        weight: number;
        endurance: number;
        charisma: number;
      };
    }
  ) {
    const res = await fetch(`${BASE_URL}/heroes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        authorization: API_KEY,
      },
      body: JSON.stringify(hero),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Error al actualizar el superhéroe');
    }
    return await res.json();
  },
};
