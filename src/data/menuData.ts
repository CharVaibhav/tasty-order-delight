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
import chickenBiryaniImg from '../assets/images/dishes/Chicken-Biryani.jpg';
import vegetableBiryaniImg from '../assets/images/dishes/vegetable-biryani.jpg';
import palakPaneerImg from '../assets/images/dishes/palak-panner.jpeg';
import jeeraRiceImg from '../assets/images/dishes/jeera-rice.jpeg';
import garlicNaanImg from '../assets/images/dishes/garlic-naan.jpeg';
import raitaImg from '../assets/images/dishes/raita.jpeg';
import papadumImg from '../assets/images/dishes/papudum.jpeg';
import sweetLassiImg from '../assets/images/dishes/sweet-lassi.jpeg';
import butterChickenImg from '../assets/images/dishes/butter-chicken-ac2ff98.jpg';
import coconutWaterImg from '../assets/images/dishes/Coconut-Juice.jpg';

export interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  isAvailable: boolean;
  label?: 'vegetarian' | 'non-vegetarian' | 'vegan' | 'spicy';
}

export type CartItem = MenuItem & {
  quantity: number;
};

export const categories = [
  { id: 'Appetizers', name: 'Appetizers' },
  { id: 'Main Dishes', name: 'Main Dishes' },
  { id: 'Sides', name: 'Sides' },
  { id: 'Desserts', name: 'Desserts' },
  { id: 'Beverages', name: 'Beverages' },
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
    label: 'vegetarian'
  },
  {
    _id: '2',
    name: 'Masala Dosa',
    description: 'Crispy rice and lentil crepe filled with spiced potato masala, served with sambar and chutneys',
    price: 199,
    category: 'Main Dishes',
    imageUrl: masalaDosaImg,
    isAvailable: true,
    label: 'vegetarian'
  },
  {
    _id: '3',
    name: 'Butter Chicken',
    description: 'Tender chicken in a rich, creamy tomato-based curry with butter and aromatic spices',
    price: 349,
    category: 'Main Dishes',
    imageUrl: butterChickenImg,
    isAvailable: true,
    label: 'non-vegetarian'
  },
  {
    _id: '4',
    name: 'Paneer Tikka Masala',
    description: 'Grilled cottage cheese cubes in a spiced creamy tomato gravy',
    price: 299,
    category: 'Main Dishes',
    imageUrl: pizzaMargheritaImg, // Keep using this image as there's no specific paneer tikka masala image
    isAvailable: true,
    label: 'vegetarian'
  },
  {
    _id: '5',
    name: 'Chicken Biryani',
    description: 'Fragrant basmati rice cooked with tender chicken, aromatic spices, and caramelized onions',
    price: 399,
    category: 'Main Dishes',
    imageUrl: chickenBiryaniImg,
    isAvailable: true,
    label: 'non-vegetarian'
  },
  {
    _id: '6',
    name: 'Vegetable Biryani',
    description: 'Aromatic rice cooked with mixed vegetables, saffron, and special biryani spices',
    price: 299,
    category: 'Main Dishes',
    imageUrl: vegetableBiryaniImg,
    isAvailable: true,
    label: 'vegetarian'
  },
  {
    _id: '7',
    name: 'Palak Paneer',
    description: 'Fresh spinach curry with homemade cottage cheese cubes and aromatic spices',
    price: 279,
    category: 'Main Dishes',
    imageUrl: palakPaneerImg,
    isAvailable: true,
    label: 'vegetarian'
  },
  {
    _id: '8',
    name: 'Jeera Rice',
    description: 'Fragrant basmati rice tempered with cumin seeds',
    price: 149,
    category: 'Sides',
    imageUrl: jeeraRiceImg,
    isAvailable: true,
    label: 'vegetarian'
  },
  {
    _id: '9',
    name: 'Garlic Naan',
    description: 'Soft bread topped with garlic and butter, baked in tandoor',
    price: 69,
    category: 'Sides',
    imageUrl: garlicNaanImg,
    isAvailable: true,
    label: 'vegetarian'
  },
  {
    _id: '10',
    name: 'Raita',
    description: 'Yogurt dip with mild spices and grated cucumber',
    price: 79,
    category: 'Sides',
    imageUrl: raitaImg,
    isAvailable: true,
    label: 'vegetarian'
  },
  {
    _id: '11',
    name: 'Papadum',
    description: 'Crispy lentil wafers served with chutney',
    price: 49,
    category: 'Sides',
    imageUrl: papadumImg,
    isAvailable: true,
    label: 'vegetarian'
  },
  {
    _id: '12',
    name: 'Mango Lassi',
    description: 'Refreshing yogurt-based drink blended with sweet mangoes and cardamom',
    price: 129,
    category: 'Beverages',
    imageUrl: mangoLassiImg,
    isAvailable: true,
    label: 'vegetarian'
  },
  {
    _id: '13',
    name: 'Masala Chai',
    description: 'Traditional Indian spiced tea with milk',
    price: 79,
    category: 'Beverages',
    imageUrl: gulabJamunImg,
    isAvailable: true,
    label: 'vegetarian'
  },
  {
    _id: '14',
    name: 'Sweet Lassi',
    description: 'Creamy yogurt drink sweetened with rose syrup',
    price: 99,
    category: 'Beverages',
    imageUrl: sweetLassiImg,
    isAvailable: true,
    label: 'vegetarian'
  },
  {
    _id: '15',
    name: 'Fresh Lime Soda',
    description: 'Refreshing lime soda with your choice of sweet, salt, or mixed',
    price: 89,
    category: 'Beverages',
    imageUrl: sushiImg,
    isAvailable: true,
    label: 'vegan'
  },
  {
    _id: '16',
    name: 'Buttermilk',
    description: 'Spiced yogurt-based drink with curry leaves and cumin',
    price: 69,
    category: 'Beverages',
    imageUrl: mangoLassiImg,
    isAvailable: true,
    label: 'vegetarian'
  },
  {
    _id: '17',
    name: 'Fresh Coconut Water',
    description: 'Natural coconut water served in the shell',
    price: 99,
    category: 'Beverages',
    imageUrl: coconutWaterImg,
    isAvailable: true,
    label: 'vegan'
  },
  {
    _id: '18',
    name: 'Samosa',
    description: 'Crispy pastry filled with spiced potatoes and peas',
    price: 79,
    category: 'Appetizers',
    imageUrl: samosaImg,
    isAvailable: true,
    label: 'vegetarian'
  },
  {
    _id: '19',
    name: 'Gulab Jamun',
    description: 'Soft milk-solid dumplings soaked in rose-scented sugar syrup',
    price: 149,
    category: 'Desserts',
    imageUrl: gulabJamunImg,
    isAvailable: true,
    label: 'vegetarian'
  },
  {
    _id: '20',
    name: 'Rasmalai',
    description: 'Soft cottage cheese patties immersed in creamy saffron-flavored milk',
    price: 169,
    category: 'Desserts',
    imageUrl: rasmalaiImg,
    isAvailable: true,
    label: 'vegetarian'
  }
];
