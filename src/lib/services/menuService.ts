import { MenuItem } from '../db/models/MenuItem';

export const MenuService = {
  async getAllMenuItems() {
    try {
      const menuItems = await MenuItem.find({ isAvailable: true });
      return menuItems;
    } catch (error) {
      console.error('Error fetching menu items:', error);
      throw error;
    }
  },

  async getMenuItemsByCategory(category: string) {
    try {
      const menuItems = await MenuItem.find({ 
        category, 
        isAvailable: true 
      });
      return menuItems;
    } catch (error) {
      console.error(`Error fetching menu items for category ${category}:`, error);
      throw error;
    }
  },

  async getMenuItemById(id: string) {
    try {
      const menuItem = await MenuItem.findById(id);
      return menuItem;
    } catch (error) {
      console.error(`Error fetching menu item with id ${id}:`, error);
      throw error;
    }
  },

  async createMenuItem(menuItemData: {
    name: string;
    description: string;
    price: number;
    category: string;
    imageUrl?: string;
  }) {
    try {
      const menuItem = new MenuItem(menuItemData);
      await menuItem.save();
      return menuItem;
    } catch (error) {
      console.error('Error creating menu item:', error);
      throw error;
    }
  },

  async updateMenuItem(id: string, updateData: {
    name?: string;
    description?: string;
    price?: number;
    category?: string;
    imageUrl?: string;
    isAvailable?: boolean;
  }) {
    try {
      const menuItem = await MenuItem.findByIdAndUpdate(
        id,
        { ...updateData, updatedAt: new Date() },
        { new: true }
      );
      return menuItem;
    } catch (error) {
      console.error(`Error updating menu item with id ${id}:`, error);
      throw error;
    }
  },

  async deleteMenuItem(id: string) {
    try {
      await MenuItem.findByIdAndDelete(id);
      return { success: true };
    } catch (error) {
      console.error(`Error deleting menu item with id ${id}:`, error);
      throw error;
    }
  }
}; 