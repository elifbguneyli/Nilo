export type ShopCategory = 'hat' | 'glasses' | 'flower' | 'furniture' | 'toy' | 'decoration'

export interface ShopItem {
  id: string
  name: string
  emoji: string
  price: number
  category: ShopCategory
}

/** Hat/glasses are "worn" by Nilo — only one per category can be active at once. */
export const WEARABLE_CATEGORIES: ShopCategory[] = ['hat', 'glasses']

export function isWearableCategory(category: ShopCategory): boolean {
  return WEARABLE_CATEGORIES.includes(category)
}

/** How many non-wearable decorations can be displayed in the room at once. */
export const ROOM_DECOR_SLOTS = 4

export const CATEGORY_LABELS: Record<ShopCategory, string> = {
  hat: 'Şapkalar',
  glasses: 'Gözlükler',
  flower: 'Çiçekler',
  furniture: 'Mobilyalar',
  toy: 'Oyuncaklar',
  decoration: 'Özel Eşyalar',
}

export const SHOP_ITEMS: ShopItem[] = [
  { id: 'flower-pink', name: 'Pembe Çiçek', emoji: '🌸', price: 3, category: 'flower' },
  { id: 'flower-sun', name: 'Ayçiçeği', emoji: '🌻', price: 3, category: 'flower' },
  { id: 'hat-top', name: 'Silindir Şapka', emoji: '🎩', price: 6, category: 'hat' },
  { id: 'hat-cap', name: 'Kep', emoji: '🧢', price: 6, category: 'hat' },
  { id: 'glasses-sun', name: 'Güneş Gözlüğü', emoji: '🕶️', price: 6, category: 'glasses' },
  { id: 'glasses-round', name: 'Yuvarlak Gözlük', emoji: '👓', price: 6, category: 'glasses' },
  { id: 'furniture-bed', name: 'Yatak', emoji: '🛏️', price: 9, category: 'furniture' },
  { id: 'furniture-computer', name: 'Bilgisayar', emoji: '💻', price: 15, category: 'furniture' },
  { id: 'toy-bear', name: 'Oyuncak Ayı', emoji: '🧸', price: 12, category: 'toy' },
  { id: 'toy-train', name: 'Oyuncak Tren', emoji: '🚂', price: 12, category: 'toy' },
  { id: 'toy-doll', name: 'Oyuncak Bebek', emoji: '🎎', price: 9, category: 'toy' },
  { id: 'toy-car', name: 'Oyuncak Araba', emoji: '🚗', price: 9, category: 'toy' },
  { id: 'toy-robot', name: 'Robot', emoji: '🤖', price: 12, category: 'toy' },
  { id: 'toy-astronaut', name: 'Astronot', emoji: '👨‍🚀', price: 12, category: 'toy' },
  { id: 'toy-rocket', name: 'Roket', emoji: '🚀', price: 9, category: 'toy' },
  { id: 'castle', name: 'Özel Şato', emoji: '🏰', price: 20, category: 'decoration' },
]

export function findShopItem(itemId: string): ShopItem | undefined {
  return SHOP_ITEMS.find((item) => item.id === itemId)
}
