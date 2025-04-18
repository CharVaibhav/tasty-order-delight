export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export type MenuCategory = 'appetizers' | 'mains' | 'desserts' | 'drinks';

export interface MenuState {
  items: MenuItem[];
  loading: boolean;
  error: string | null;
  selectedCategory: MenuCategory | 'all';
} 