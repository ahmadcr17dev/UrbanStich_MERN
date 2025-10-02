import { createSlice } from "@reduxjs/toolkit";

// Load from localStorage
const LoadCart = () => {
  const cart = localStorage.getItem("cart");
  return cart ? JSON.parse(cart) : [];
};

// Save to localStorage
const SaveCart = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

const CartSlice = createSlice({
  name: "cart",
  initialState: {
    items: LoadCart(),
  },
  reducers: {
    AddToCart: (state, action) => {
      const product = action.payload;

      const existing = state.items.find(
        (item) =>
          item._id === product._id &&
          item.variation.color === product.variation.color &&
          item.variation.size === product.variation.size
      );
      if (existing) {
        // ❌ Do not mutate or return new state, just mark error
        action.payload.error = true;
      } else {
        state.items.push({ ...product, quantity: 1, stock: product.variation.stock });
        SaveCart(state.items);
        action.payload.error = false;
      }
    },
    RemoveFromCart: (state, action) => {
      const { _id, variation } = action.payload;

      state.items = state.items.filter(
        (item) =>
          !(
            item._id === _id &&
            item.variation.color === variation.color &&
            item.variation.size === variation.size
          )
      );

      SaveCart(state.items);
    },
    IncrementProduct: (state, action) => {
      const { _id, variation } = action.payload;
      const item = state.items.find((i) => i._id === _id && i.variation.color === variation.color && i.variation.size === variation.size);
      if (item) {
        item.quantity += 1;
        SaveCart(state.items);
      }
    },
    DecrementProduct: (state, action) => {
      const { _id, variation } = action.payload;
      const item = state.items.find((i) => i._id === _id && i.variation.color === variation.color && i.variation.size === variation.size);
      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        state.items = state.items.filter((i) => !(i._id === _id && i.variation.color === variation.color && i.variation.size === variation.size));
      }
      SaveCart(state.items);
    },
    ClearCart: (state) => {
      state.items = [];
      SaveCart([]);
    },
  },
});

export const { AddToCart, RemoveFromCart, ClearCart, IncrementProduct, DecrementProduct } = CartSlice.actions;
export default CartSlice.reducer;