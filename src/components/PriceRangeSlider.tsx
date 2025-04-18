import React from 'react';
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";

interface PriceRangeSliderProps {
  maxPrice: number;
  value: number;
  onValueChange: (value: number) => void;
}

const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({
  maxPrice,
  value,
  onValueChange,
}) => {
  return (
    <Card className="p-4 bg-white dark:bg-gray-800">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            Price Range
          </h3>
          <span className="text-sm font-medium text-food-orange">
            ₹{value}
          </span>
        </div>
        <Slider
          defaultValue={[maxPrice]}
          max={maxPrice}
          step={1}
          value={[value]}
          onValueChange={([newValue]) => onValueChange(newValue)}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>₹0</span>
          <span>₹{maxPrice}</span>
        </div>
      </div>
    </Card>
  );
};

export default PriceRangeSlider; 