import React from 'react';
import { Button } from '@/components/ui/button';
import PriceRangeSlider from './PriceRangeSlider';

interface CategorySelectorProps {
  categories: { id: string; name: string }[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  maxPrice: number;
  priceRange: number;
  onPriceRangeChange: (value: number) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
  maxPrice,
  priceRange,
  onPriceRangeChange,
}) => {
  return (
    <div className="w-full space-y-6">
      <div className="flex flex-wrap gap-3 justify-center">
        <Button
          key="all"
          variant={selectedCategory === 'all' ? 'default' : 'outline'}
          onClick={() => onSelectCategory('all')}
          className={`rounded-full ${
            selectedCategory === 'all'
              ? 'bg-food-orange hover:bg-food-orange-dark text-white'
              : 'text-food-gray-dark hover:text-food-orange hover:border-food-orange dark:text-gray-300'
          }`}
        >
          All
        </Button>
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? 'default' : 'outline'}
            onClick={() => onSelectCategory(category.id)}
            className={`rounded-full ${
              selectedCategory === category.id
                ? 'bg-food-orange hover:bg-food-orange-dark text-white'
                : 'text-food-gray-dark hover:text-food-orange hover:border-food-orange dark:text-gray-300'
            }`}
          >
            {category.name}
          </Button>
        ))}
      </div>

      <div className="w-full md:w-72 ml-auto">
        <PriceRangeSlider
          maxPrice={maxPrice}
          value={priceRange}
          onValueChange={onPriceRangeChange}
        />
      </div>
    </div>
  );
};

export default CategorySelector;
