import { dishImages } from '@/lib/constants/images';
import burgerImg from '@/assets/images/dishes/burger.jpg';
import pizzaMargheritaImg from '@/assets/images/dishes/pizza-margherita.jpg';
import pastaImg from '@/assets/images/dishes/pasta.jpg';
import sushiImg from '@/assets/images/dishes/sushi.jpg';
import pizzaPepperoniImg from '@/assets/images/dishes/pizza-pepperoni.jpg';
import steakImg from '@/assets/images/dishes/steak.jpg';
import caesarSaladImg from '@/assets/images/dishes/caesar-salad.jpg';
import dessertImg from '@/assets/images/dishes/dessert.jpg';
import dalMakhaniImg from '@/assets/images/dishes/Dal-Makhani-Blog.jpg';
import rasmalaiImg from '@/assets/images/dishes/Rasmalai-recipe@palates-desire.jpg';
import gulabJamunImg from '@/assets/images/dishes/gulabjamun.jpeg';
import mangoLassiImg from '@/assets/images/dishes/mango-lassi.jpg';
import samosaImg from '@/assets/images/dishes/Samosas-with-Potatoes-and-Peas-2-1.jpg';
import masalaDosaImg from '@/assets/images/dishes/masala-dosa.jpg';

export interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  isAvailable: boolean;
}

export type CartItem = MenuItem & {
  quantity: number;
};

export const categories = [
  { id: 'appetizers', name: 'Appetizers' },
  { id: 'main-dishes', name: 'Main Dishes' },
  { id: 'sides', name: 'Sides' },
  { id: 'desserts', name: 'Desserts' },
  { id: 'beverages', name: 'Beverages' },
];

export const menuItems: MenuItem[] = [
  {
    _id: '1',
    name: 'Classic Margherita Pizza',
    description: 'Fresh tomatoes, mozzarella, basil, and olive oil',
    price: 14.99,
    category: 'Main Courses',
    imageUrl: pizzaMargheritaImg,
    isAvailable: true,
  },
  {
    _id: '2',
    name: 'Chicken Caesar Salad',
    description: 'Crisp romaine lettuce, grilled chicken, parmesan, and Caesar dressing',
    price: 12.99,
    category: 'Appetizers',
    imageUrl: caesarSaladImg,
    isAvailable: true,
  },
  {
    _id: '3',
    name: 'Spaghetti Carbonara',
    description: 'Pasta with creamy egg sauce, pancetta, and pecorino cheese',
    price: 16.99,
    category: 'Main Courses',
    imageUrl: pastaImg,
    isAvailable: true,
  },
  {
    _id: '4',
    name: 'Garlic Bread',
    description: 'Toasted bread with garlic butter and herbs',
    price: 5.99,
    category: 'Sides',
    imageUrl: burgerImg,
    isAvailable: true,
  },
  {
    _id: '5',
    name: 'Tiramisu',
    description: 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone cream',
    price: 8.99,
    category: 'Desserts',
    imageUrl: dessertImg,
    isAvailable: true,
  },
  {
    _id: '6',
    name: 'Italian Red Wine',
    description: 'Premium red wine from Italian vineyards',
    price: 29.99,
    category: 'Drinks',
    imageUrl: mangoLassiImg,
    isAvailable: true,
  },
  {
    _id: '7',
    name: 'Bruschetta',
    description: 'Toasted bread topped with tomatoes, garlic, and fresh basil',
    price: 9.99,
    category: 'Appetizers',
    imageUrl: samosaImg,
    isAvailable: true,
  },
  {
    _id: '8',
    name: 'Grilled Salmon',
    description: 'Fresh salmon fillet with lemon herb butter',
    price: 24.99,
    category: 'Main Courses',
    imageUrl: steakImg,
    isAvailable: true,
  },
  {
    _id: '9',
    name: 'Chocolate Lava Cake',
    description: 'Warm chocolate cake with a molten center',
    price: 9.99,
    category: 'Desserts',
    imageUrl: gulabJamunImg,
    isAvailable: true,
  },
];
