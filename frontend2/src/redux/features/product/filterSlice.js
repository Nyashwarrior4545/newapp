import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  filteredProducts: [],
};

const categoryOrder = [
  "Process Safety",
  "Environment",
  "Safety",
  "Accident",
  "Complaint",
  "Loss",
  "Over £100,000",
  "Health",
  "HR",
  "Expenses",
  "Overtime",
  "Holiday",
];

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    FILTER_PRODUCTS(state, action) {
      const { products, search } = action.payload;
      const tempProducts = products.filter(
        (product) =>
          product.name.toLowerCase().includes(search.toLowerCase()) ||
          product.category.toLowerCase().includes(search.toLowerCase())
      );

      state.filteredProducts = tempProducts;
    },
    SORT_PRODUCTS(state) {
      state.filteredProducts.sort((a, b) => {
        return categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category);
      });
    },
  },
});

export const { FILTER_PRODUCTS, SORT_PRODUCTS } = filterSlice.actions;
export const selectFilteredPoducts = (state) => state.filter.filteredProducts;
export default filterSlice.reducer;
