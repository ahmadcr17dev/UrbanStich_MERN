import { createSlice } from "@reduxjs/toolkit";

// load wishlist from LocalStorage
const LoadWishlist = () => {
    const wish = localStorage.getItem("wishlist");

    if (!wish || wish === "undefined") {
        return [];
    }

    try {
        return JSON.parse(wish);
    } catch (e) {
        console.error("Invalid wishlist data in localStorage:", e);
        return [];
    }
};

// save to local storage
const SaveWishlist = (wish) => {
    localStorage.setItem("wishlist", JSON.stringify(wish));
};

const WishSlice = createSlice({
    name: "wishlist",
    initialState: {
        items: LoadWishlist(),
    },
    reducers: {
        AddToWishlist: (state, action) => {
            const product = action.payload;
            const ExistProduct = state.items.find(
                (item) => item._id === product._id && item.variation.color === product.variation.color && item.variation.size === product.variation.size
            );
            if (ExistProduct) {
                action.payload.error = true;
            } else {
                state.items.push({ ...product, quantity: 1, stock: product.variation.stock });
                SaveWishlist(state.items);
                action.payload.error = false;
            }
        },
        RemoveFromWishlist: (state, action) => {
            const { _id, variation } = action.payload;
            state.items = state.items.filter(
                (items) => !(items._id === _id && items.variation.color === variation.color && items.variation.size === variation.size)
            )
            SaveWishlist(state.items);
        },
        ClearWishlist: (state) => {
            state.items = [];
            SaveWishlist();
        }
    }
});

export const { AddToWishlist, RemoveFromWishlist, ClearWishlist } = WishSlice.actions;
export default WishSlice.reducer;