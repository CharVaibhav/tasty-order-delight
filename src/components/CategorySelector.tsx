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
    <div className="w-full">
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Categories</h2>
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
        </div>

        <div className="w-full max-w-xs mx-auto">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">Price Range</h3>
          <PriceRangeSlider
            maxPrice={maxPrice}
            value={priceRange}
            onValueChange={onPriceRangeChange}
          />
        </div>
      </div>
    </div>
  );
};

export default CategorySelector;
