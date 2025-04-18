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
  popular?: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  icon?: string;
}

export const categories: Category[] = [
  { id: "all", name: "All" },
  { id: "appetizers", name: "Appetizers" },
  { id: "main-dishes", name: "Main Dishes" },
  { id: "sides", name: "Sides" },
  { id: "desserts", name: "Desserts" },
  { id: "beverages", name: "Beverages" },
];

export const menuItems: MenuItem[] = [
  {
    _id: "1",
    name: "Butter Chicken",
    description: "Tender chicken pieces in rich, creamy tomato gravy with butter and spices",
    price: 399,
    imageUrl: steakImg,
    category: "Main Courses",
    isAvailable: true,
  },
  {
    _id: "2",
    name: "Paneer Tikka",
    description: "Grilled cottage cheese marinated in spiced yogurt with bell peppers and onions",
    price: 299,
    imageUrl: caesarSaladImg,
    category: "Appetizers",
    isAvailable: true,
  },
  {
    _id: "3",
    name: "Masala Dosa",
    description: "Crispy rice crepe filled with spiced potato filling, served with sambar and chutney",
    price: 199,
    imageUrl: pizzaPepperoniImg,
    category: "Main Courses",
    isAvailable: true,
  },
  {
    _id: "4",
    name: "Chicken Biryani",
    description: "Fragrant basmati rice cooked with tender chicken and aromatic spices",
    price: 349,
    imageUrl: pastaImg,
    category: "Main Courses",
    isAvailable: true,
  },
  {
    _id: "5",
    name: "Garlic Naan",
    description: "Fresh baked Indian bread with garlic and butter",
    price: 79,
    imageUrl: pizzaMargheritaImg,
    category: "Sides",
    isAvailable: true,
  },
  {
    _id: "6",
    name: "Samosa",
    description: "Crispy pastry filled with spiced potatoes and peas",
    price: 89,
    imageUrl: samosaImg,
    category: "Appetizers",
    isAvailable: true,
  },
  {
    _id: "7",
    name: "Gulab Jamun",
    description: "Sweet milk dough balls soaked in sugar syrup",
    price: 149,
    imageUrl: gulabJamunImg,
    category: "Desserts",
    isAvailable: true,
  },
  {
    _id: "8",
    name: "Mango Lassi",
    description: "Refreshing yogurt drink blended with sweet mango pulp",
    price: 129,
    imageUrl: mangoLassiImg,
    category: "Drinks",
    isAvailable: true,
  },
  {
    _id: "9",
    name: "Dal Makhani",
    description: "Creamy black lentils simmered overnight with butter and spices",
    price: 249,
    imageUrl: dalMakhaniImg,
    category: "Main Courses",
    isAvailable: true,
  },
  {
    _id: "10",
    name: "Rasmalai",
    description: "Soft cottage cheese dumplings in saffron-flavored milk",
    price: 179,
    imageUrl: rasmalaiImg,
    category: "Desserts",
    isAvailable: true,
  },
  {
    _id: "11",
    name: "Masala Chai",
    description: "Traditional Indian spiced tea with milk",
    price: 89,
    imageUrl: dessertImg,
    category: "Drinks",
    isAvailable: true,
  }
];
