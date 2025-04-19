import React from 'react';
import { Button } from '@/components/ui/button';

interface Category {
  id: string;
  name: string;
}

interface CategorySelectorProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? 'default' : 'outline'}
          onClick={() => onSelectCategory(category.id)}
          className={`rounded-full ${
            selectedCategory === category.id
              ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
              : 'hover:bg-primary/10'
          }`}
        >
          {category.name}
        </Button>
      ))}
    </div>
  );
};

export default CategorySelector;
