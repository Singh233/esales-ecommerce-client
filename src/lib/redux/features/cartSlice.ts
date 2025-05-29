import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Cart } from "~/lib/api";

interface CartItem {
  id: string;
  productId: string;
  title: string;
  price: number;
  image: string | null;
  brand: string;
  category: string;
  selectedColor: string | null;
  selectedSize: string | null;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
}

interface AddToCartPayload {
  product: {
    id: string;
    title: string;
    price: number;
    images: string | string[];
    brand: string;
    category: string;
  };
  selectedColor?: string;
  selectedSize?: string;
  quantity: number;
}

interface UpdateQuantityPayload {
  itemId: string;
  quantity: number;
}

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalAmount: 0,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<AddToCartPayload>) => {
      const { product, selectedColor, selectedSize, quantity } = action.payload;

      // Create a unique identifier for the cart item
      const itemId = `${product.id}-${selectedColor || "default"}-${
        selectedSize || "default"
      }`;

      // Check if item already exists in cart
      const existingItemIndex = state.items.findIndex(
        (item) => item.id === itemId
      );

      if (existingItemIndex >= 0) {
        // Update existing item quantity
        state.items[existingItemIndex].quantity += quantity;
      } else {
        // Add new item to cart
        const newItem: CartItem = {
          id: itemId,
          productId: product.id,
          title: product.title,
          price: product.price,
          image: Array.isArray(product.images)
            ? product.images[0]
            : product.images,
          brand: product.brand,
          category: product.category,
          selectedColor: selectedColor || null,
          selectedSize: selectedSize || null,
          quantity: quantity,
        };
        state.items.push(newItem);
      }

      // Recalculate totals
      state.totalItems = state.items.reduce(
        (total, item) => total + item.quantity,
        0
      );
      state.totalAmount = state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      const itemId = action.payload;
      state.items = state.items.filter((item) => item.id !== itemId);

      // Recalculate totals
      state.totalItems = state.items.reduce(
        (total, item) => total + item.quantity,
        0
      );
      state.totalAmount = state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    },

    updateItemQuantity: (
      state,
      action: PayloadAction<UpdateQuantityPayload>
    ) => {
      const { itemId, quantity } = action.payload;
      const itemIndex = state.items.findIndex((item) => item.id === itemId);

      if (itemIndex >= 0) {
        if (quantity <= 0) {
          // Remove item if quantity is 0 or negative
          state.items.splice(itemIndex, 1);
        } else {
          state.items[itemIndex].quantity = quantity;
        }
      }

      // Recalculate totals
      state.totalItems = state.items.reduce(
        (total, item) => total + item.quantity,
        0
      );
      state.totalAmount = state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    },

    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalAmount = 0;
    },

    setCartFromAPI: (state, action: PayloadAction<Cart>) => {
      const apiCart = action.payload;

      // Transform API cart items to match the Redux cart item structure
      state.items = apiCart.items.map((apiItem) => {
        const itemId = `${apiItem.product.id}-${apiItem.color || "default"}-${
          apiItem.size || "default"
        }`;

        return {
          id: itemId,
          productId: apiItem.product.id,
          title: apiItem.product.title,
          price: apiItem.price,
          image: Array.isArray(apiItem.product.images)
            ? apiItem.product.images[0]
            : apiItem.product.images,
          brand: apiItem.product.brand,
          category: apiItem.product.category,
          selectedColor: apiItem.color || null,
          selectedSize: apiItem.size || null,
          quantity: apiItem.quantity,
        };
      });

      // Use totals from API or recalculate
      state.totalItems = apiCart.totalItems;
      state.totalAmount = apiCart.totalAmount;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateItemQuantity,
  clearCart,
  setCartFromAPI,
} = cartSlice.actions;

export default cartSlice.reducer;
