import { dishImages } from '../lib/constants/images';
import burgerImg from '../assets/images/dishes/burger.jpg';
import pizzaMargheritaImg from '../assets/images/dishes/pizza-margherita.jpg';
import pastaImg from '../assets/images/dishes/pasta.jpg';
import sushiImg from '../assets/images/dishes/sushi.jpg';
import pizzaPepperoniImg from '../assets/images/dishes/pizza-pepperoni.jpg';
import steakImg from '../assets/images/dishes/steak.jpg';
import caesarSaladImg from '../assets/images/dishes/caesar-salad.jpg';
import dessertImg from '../assets/images/dishes/dessert.jpg';
import dalMakhaniImg from '../assets/images/dishes/Dal-Makhani-Blog.jpg';
import rasmalaiImg from '../assets/images/dishes/Rasmalai-recipe@palates-desire.jpg';
import gulabJamunImg from '../assets/images/dishes/gulabjamun.jpeg';
import mangoLassiImg from '../assets/images/dishes/mango-lassi.jpg';
import samosaImg from '../assets/images/dishes/Samosas-with-Potatoes-and-Peas-2-1.jpg';
import masalaDosaImg from '../assets/images/dishes/masala-dosa.jpg';
import biryaniImg from '../assets/images/dishes/Chicken-Biryani.jpg';

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
    name: 'Dal Makhani',
    description: 'Creamy black lentils slow-cooked overnight with rich spices and butter',
    price: 299,
    category: 'Main Dishes',
    imageUrl: dalMakhaniImg,
    isAvailable: true,
  },
  {
    _id: '2',
    name: 'Masala Dosa',
    description: 'Crispy rice and lentil crepe filled with spiced potato masala, served with sambar and chutneys',
    price: 199,
    category: 'Main Dishes',
    imageUrl: masalaDosaImg,
    isAvailable: true,
  },
  {
    _id: '3',
    name: 'Butter Chicken',
    description: 'Tender chicken in a rich, creamy tomato-based curry with butter and aromatic spices',
    price: 349,
    category: 'Main Dishes',
    imageUrl: steakImg,
    isAvailable: true,
  },
  {
    _id: '4',
    name: 'Paneer Tikka Masala',
    description: 'Grilled cottage cheese cubes in a spiced creamy tomato gravy',
    price: 299,
    category: 'Main Dishes',
    imageUrl: pizzaMargheritaImg,
    isAvailable: true,
  },
  {
    _id: '5',
    name: 'Chicken Biryani',
    description: 'Fragrant basmati rice cooked with tender chicken, aromatic spices, and caramelized onions',
    price: 399,
    category: 'Main Dishes',
    imageUrl: biryaniImg,
    isAvailable: true,
  },
  {
    _id: '6',
    name: 'Vegetable Biryani',
    description: 'Aromatic rice cooked with mixed vegetables, saffron, and special biryani spices',
    price: 299,
    category: 'Main Dishes',
    imageUrl: biryaniImg,
    isAvailable: true,
  },
  {
    _id: '7',
    name: 'Palak Paneer',
    description: 'Fresh spinach curry with homemade cottage cheese cubes and aromatic spices',
    price: 279,
    category: 'Main Dishes',
    imageUrl: pizzaMargheritaImg,
    isAvailable: true,
  },
  {
    _id: '8',
    name: 'Jeera Rice',
    description: 'Fragrant basmati rice tempered with cumin seeds',
    price: 149,
    category: 'Sides',
    imageUrl: biryaniImg,
    isAvailable: true,
  },
  {
    _id: '9',
    name: 'Garlic Naan',
    description: 'Soft bread topped with garlic and butter, baked in tandoor',
    price: 69,
    category: 'Sides',
    imageUrl: pizzaMargheritaImg,
    isAvailable: true,
  },
  {
    _id: '10',
    name: 'Raita',
    description: 'Yogurt dip with mild spices and grated cucumber',
    price: 79,
    category: 'Sides',
    imageUrl: mangoLassiImg,
    isAvailable: true,
  },
  {
    _id: '11',
    name: 'Papadum',
    description: 'Crispy lentil wafers served with chutney',
    price: 49,
    category: 'Sides',
    imageUrl: samosaImg,
    isAvailable: true,
  },
  {
    _id: '12',
    name: 'Mango Lassi',
    description: 'Refreshing yogurt-based drink blended with sweet mangoes and cardamom',
    price: 129,
    category: 'Beverages',
    imageUrl: mangoLassiImg,
    isAvailable: true,
  },
  {
    _id: '13',
    name: 'Masala Chai',
    description: 'Traditional Indian spiced tea with milk',
    price: 79,
    category: 'Beverages',
    imageUrl: gulabJamunImg,
    isAvailable: true,
  },
  {
    _id: '14',
    name: 'Sweet Lassi',
    description: 'Creamy yogurt drink sweetened with rose syrup',
    price: 99,
    category: 'Beverages',
    imageUrl: mangoLassiImg,
    isAvailable: true,
  },
  {
    _id: '15',
    name: 'Fresh Lime Soda',
    description: 'Refreshing lime soda with your choice of sweet, salt, or mixed',
    price: 89,
    category: 'Beverages',
    imageUrl: sushiImg,
    isAvailable: true,
  },
  {
    _id: '16',
    name: 'Buttermilk',
    description: 'Spiced yogurt-based drink with curry leaves and cumin',
    price: 69,
    category: 'Beverages',
    imageUrl: mangoLassiImg,
    isAvailable: true,
  },
  {
    _id: '17',
    name: 'Fresh Coconut Water',
    description: 'Natural coconut water served in the shell',
    price: 99,
    category: 'Beverages',
    imageUrl: dessertImg,
    isAvailable: true,
  },
  {
    _id: '18',
    name: 'Samosa',
    description: 'Crispy pastry filled with spiced potatoes and peas',
    price: 79,
    category: 'Appetizers',
    imageUrl: samosaImg,
    isAvailable: true,
  },
  {
    _id: '19',
    name: 'Gulab Jamun',
    description: 'Soft milk-solid dumplings soaked in rose-scented sugar syrup',
    price: 149,
    category: 'Desserts',
    imageUrl: gulabJamunImg,
    isAvailable: true,
  },
  {
    _id: '20',
    name: 'Rasmalai',
    description: 'Soft cottage cheese patties immersed in creamy saffron-flavored milk',
    price: 169,
    category: 'Desserts',
    imageUrl: rasmalaiImg,
    isAvailable: true,
  }
];
