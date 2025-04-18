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
    imageUrl: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=500&auto=format&fit=crop",
    category: "Main Courses",
    isAvailable: true,
  },
  {
    _id: "2",
    name: "Paneer Tikka",
    description: "Grilled cottage cheese marinated in spiced yogurt with bell peppers and onions",
    price: 299,
    imageUrl: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=500&auto=format&fit=crop",
    category: "Appetizers",
    isAvailable: true,
  },
  {
    _id: "3",
    name: "Masala Dosa",
    description: "Crispy rice crepe filled with spiced potato filling, served with sambar and chutney",
    price: 199,
    imageUrl: "https://images.unsplash.com/photo-1630383249896-483b1756db26?q=80&w=500&auto=format&fit=crop",
    category: "Main Courses",
    isAvailable: true,
  },
  {
    _id: "4",
    name: "Chicken Biryani",
    description: "Fragrant basmati rice cooked with tender chicken and aromatic spices",
    price: 349,
    imageUrl: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=500&auto=format&fit=crop",
    category: "Main Courses",
    isAvailable: true,
  },
  {
    _id: "5",
    name: "Garlic Naan",
    description: "Fresh baked Indian bread with garlic and butter",
    price: 79,
    imageUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=500&auto=format&fit=crop",
    category: "Sides",
    isAvailable: true,
  },
  {
    _id: "6",
    name: "Samosa",
    description: "Crispy pastry filled with spiced potatoes and peas",
    price: 89,
    imageUrl: "https://images.unsplash.com/photo-1601050690717-94e538277055?q=80&w=500&auto=format&fit=crop",
    category: "Appetizers",
    isAvailable: true,
  },
  {
    _id: "7",
    name: "Gulab Jamun",
    description: "Sweet milk dough balls soaked in sugar syrup",
    price: 149,
    imageUrl: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?q=80&w=500&auto=format&fit=crop",
    category: "Desserts",
    isAvailable: true,
  },
  {
    _id: "8",
    name: "Mango Lassi",
    description: "Refreshing yogurt drink blended with sweet mango pulp",
    price: 129,
    imageUrl: "https://images.unsplash.com/photo-1626784215021-2e39ccf971cd?q=80&w=500&auto=format&fit=crop",
    category: "Drinks",
    isAvailable: true,
  },
  {
    _id: "9",
    name: "Dal Makhani",
    description: "Creamy black lentils simmered overnight with butter and spices",
    price: 249,
    imageUrl: "https://images.unsplash.com/photo-1626100134610-cb1a3c697c07?q=80&w=500&auto=format&fit=crop",
    category: "Main Courses",
    isAvailable: true,
  },
  {
    _id: "10",
    name: "Rasmalai",
    description: "Soft cottage cheese dumplings in saffron-flavored milk",
    price: 179,
    imageUrl: "https://images.unsplash.com/photo-1589301570440-0714e2d898d6?q=80&w=500&auto=format&fit=crop",
    category: "Desserts",
    isAvailable: true,
  },
  {
    _id: "11",
    name: "Masala Chai",
    description: "Traditional Indian spiced tea with milk",
    price: 89,
    imageUrl: "https://images.unsplash.com/photo-1561336526-2914f13ceb36?q=80&w=500&auto=format&fit=crop",
    category: "Drinks",
    isAvailable: true,
  }
];
