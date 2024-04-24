import { configureStore } from "@reduxjs/toolkit";
import boardReducer from "./checkersGame.slice";

const store = configureStore({
	reducer: {
		checkersGame: boardReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
