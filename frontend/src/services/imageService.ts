// src/services/imageService.ts
import axios from 'axios';
import { ImageSuggestion } from '@types/index';

// Usando Unsplash Source API (gratuito, sin API key)
const UNSPLASH_SOURCE_URL = 'https://source.unsplash.com';

// Mapeo de categorías a términos de búsqueda en inglés
const categorySearchTerms: Record<string, string[]> = {
  'Bienes electrónicos': ['electronics', 'gadgets', 'technology', 'smartphone', 'laptop'],
  'Indumentaria': ['clothing', 'fashion', 'apparel', 'shoes', 'sneakers'],
  'Electrodomésticos': ['appliances', 'kitchen', 'home-appliances', 'refrigerator', 'washing-machine'],
  'Productos de belleza': ['beauty', 'cosmetics', 'makeup', 'skincare', 'perfume'],
  'Deportes': ['sports', 'fitness', 'exercise', 'gym', 'athletic'],
  'Juguetes': ['toys', 'games', 'kids', 'children', 'play'],
  'Libros': ['books', 'reading', 'literature', 'library', 'novel'],
  'Muebles': ['furniture', 'home', 'interior', 'chair', 'table'],
  'Herramientas': ['tools', 'hardware', 'construction', 'workshop', 'equipment'],
  'Alimentos': ['food', 'grocery', 'cooking', 'ingredients', 'kitchen'],
  'Bebidas': ['drinks', 'beverages', 'coffee', 'tea', 'juice'],
  'Mascotas': ['pets', 'animals', 'dog', 'cat', 'pet-supplies'],
  'Jardinería': ['garden', 'plants', 'flowers', 'gardening', 'outdoor'],
  'Automotriz': ['automotive', 'car', 'vehicle', 'auto-parts', 'motorcycle'],
  'Música': ['music', 'instruments', 'guitar', 'piano', 'audio'],
  'Fotografía': ['photography', 'camera', 'photo', 'lens', 'digital'],
  'Oficina': ['office', 'stationery', 'desk', 'supplies', 'workspace'],
  'Bebés': ['baby', 'infant', 'newborn', 'nursery', 'children'],
  'Salud': ['health', 'medical', 'wellness', 'healthcare', 'medicine'],
  'Joyería': ['jewelry', 'accessories', 'watch', 'necklace', 'ring'],
};

export const imageService = {
  getSuggestions: async (categoria: string, productName?: string): Promise<ImageSuggestion[]> => {
    const searchTerms = categorySearchTerms[categoria] || ['product'];
    const suggestions: ImageSuggestion[] = [];

    // Generar 10 sugerencias usando diferentes términos
    for (let i = 0; i < 10; i++) {
      const term = searchTerms[i % searchTerms.length];
      const randomSeed = Date.now() + i;
      
      suggestions.push({
        url: `${UNSPLASH_SOURCE_URL}/800x600/?${term}&sig=${randomSeed}`,
        thumbnail: `${UNSPLASH_SOURCE_URL}/200x150/?${term}&sig=${randomSeed}`,
        description: `${categoria} - ${term}`,
      });
    }

    return suggestions;
  },

  getImageUrl: (categoria: string, seed?: number): string => {
    const searchTerms = categorySearchTerms[categoria] || ['product'];
    const term = searchTerms[0];
    const randomSeed = seed || Date.now();
    return `${UNSPLASH_SOURCE_URL}/800x600/?${term}&sig=${randomSeed}`;
  },

  uploadImage: async (file: File): Promise<string> => {
    // En un entorno real, aquí subirías la imagen a un servidor
    // Por ahora, retornamos una URL de datos (data URL)
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },
};