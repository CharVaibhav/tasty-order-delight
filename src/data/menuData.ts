
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  popular?: boolean;
  spicy?: boolean;
  vegetarian?: boolean;
  vegan?: boolean;
  glutenFree?: boolean;
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
    id: "1",
    name: "Classic Burger",
    description: "Juicy beef patty with lettuce, tomato, onion, and our special sauce on a toasted brioche bun",
    price: 12.99,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=500&auto=format&fit=crop",
    category: "main-dishes",
    popular: true,
  },
  {
    id: "2",
    name: "Margherita Pizza",
    description: "Traditional pizza with tomato sauce, fresh mozzarella, basil, and extra virgin olive oil",
    price: 14.99,
    image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?q=80&w=500&auto=format&fit=crop",
    category: "main-dishes",
    vegetarian: true,
  },
  {
    id: "3",
    name: "Caesar Salad",
    description: "Crisp romaine lettuce, parmesan cheese, croutons, and creamy Caesar dressing",
    price: 9.99,
    image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?q=80&w=500&auto=format&fit=crop",
    category: "appetizers",
    vegetarian: true,
  },
  {
    id: "4",
    name: "Buffalo Wings",
    description: "Crispy chicken wings tossed in spicy buffalo sauce, served with blue cheese dressing",
    price: 11.99,
    image: "https://images.unsplash.com/photo-1608039755401-742074f0548d?q=80&w=500&auto=format&fit=crop",
    category: "appetizers",
    spicy: true,
  },
  {
    id: "5",
    name: "French Fries",
    description: "Crispy golden fries seasoned with sea salt",
    price: 4.99,
    image: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?q=80&w=500&auto=format&fit=crop",
    category: "sides",
    vegetarian: true,
    vegan: true,
  },
  {
    id: "6",
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with a molten center, served with vanilla ice cream",
    price: 7.99,
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=500&auto=format&fit=crop",
    category: "desserts",
    vegetarian: true,
    popular: true,
  },
  {
    id: "7",
    name: "Iced Tea",
    description: "Refreshing house-brewed iced tea with lemon",
    price: 2.99,
    image: "https://images.unsplash.com/photo-1499638673689-79a0b5115d87?q=80&w=500&auto=format&fit=crop",
    category: "beverages",
    vegetarian: true,
    vegan: true,
    glutenFree: true,
  },
  {
    id: "8",
    name: "Grilled Salmon",
    description: "Fresh Atlantic salmon fillet, grilled to perfection with lemon herb butter",
    price: 18.99,
    image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=500&auto=format&fit=crop",
    category: "main-dishes",
    glutenFree: true,
  },
  {
    id: "9",
    name: "Cheesecake",
    description: "Creamy New York style cheesecake with graham cracker crust",
    price: 6.99,
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=500&auto=format&fit=crop",
    category: "desserts",
    vegetarian: true,
  },
  {
    id: "10",
    name: "Garlic Bread",
    description: "Toasted baguette with garlic butter and herbs",
    price: 5.99,
    image: "https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?q=80&w=500&auto=format&fit=crop",
    category: "sides",
    vegetarian: true,
  },
  {
    id: "11",
    name: "Chicken Alfredo",
    description: "Fettuccine pasta in creamy Alfredo sauce with grilled chicken breast",
    price: 15.99,
    image: "https://images.unsplash.com/photo-1645112411341-6c4fd023882c?q=80&w=500&auto=format&fit=crop",
    category: "main-dishes",
  },
  {
    id: "12",
    name: "Fresh Lemonade",
    description: "Homemade lemonade with fresh-squeezed lemons and a touch of mint",
    price: 3.99,
    image: "https://images.unsplash.com/photo-1621263764928-df1444c5c429?q=80&w=500&auto=format&fit=crop",
    category: "beverages",
    vegetarian: true,
    vegan: true,
    glutenFree: true,
  },
];
