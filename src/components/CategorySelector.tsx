
import { useState } from 'react';
import { Category } from '@/data/menuData';
import { cn } from "@/lib/utils";

interface CategorySelectorProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

const CategorySelector = ({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategorySelectorProps) => {
  const [isScrollable, setIsScrollable] = useState(false);

  return (
    <div className="w-full mb-8">
      <h2 className="text-2xl font-bold mb-4 text-food-gray-dark">Categories</h2>
      <div 
        className={cn(
          "flex gap-2 pb-2 overflow-x-auto scrollbar-hide", 
          isScrollable ? "justify-start" : "justify-start md:justify-center"
        )}
      >
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className={cn(
              "px-4 py-2 rounded-full whitespace-nowrap transition-all",
              selectedCategory === category.id
                ? "bg-food-orange text-white shadow-md"
                : "bg-white border border-gray-200 text-food-gray-dark hover:bg-food-orange-light hover:text-white"
            )}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategorySelector;
