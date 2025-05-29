import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

import counterReducer from "./features/counterSlice";
import cartReducer from "./features/cartSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      counter: counterReducer,
      cart: cartReducer,
    },
    devTools: process.env.NODE_ENV !== "production",
  });
};

// Get the type of our store variable
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = AppStore["dispatch"];

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <TSelected>(
  selector: (state: RootState) => TSelected
) => useSelector(selector);
