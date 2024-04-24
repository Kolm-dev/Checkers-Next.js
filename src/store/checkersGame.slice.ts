import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: BoardState = {
	cells: Array(64)
		.fill(null)
		.map((_, index) => {
			const row = Math.floor(index / 8);
			const col = index % 8;
			const isBlackCell = row % 2 === 0 ? col % 2 === 1 : col % 2 === 0;

			if (isBlackCell && row < 3) {
				return "black"; // Начальные позиции черных шашек - 0, 2, 4 ряды
			} else if (isBlackCell && row > 4) {
				return "white"; // Начальные позиции белых шашек - 5, 6, 7 ряды
			} else {
				return null;
			}
		}),
	gameFinished: false,
	winner: null,
};

const checkersGame = createSlice({
	name: "checkersGame",
	initialState,
	reducers: {
		moveChecker: (state, action: PayloadAction<CheckerPayload>) => {
			const { from, to, checker } = action.payload;
			state.cells[from] = null; // Удаляем шашку с текущей клетки
			state.cells[to] = checker; // Помещаем шашку на новую клетку
		},
		removeChecker: (state, action: PayloadAction<CheckerPayloadRemove>) => {
			state.cells[action.payload.from] = null;
		},

		endGame: (state, action) => {
			state.gameFinished = true;
			state.winner = action.payload.winner === "black" ? "черные" : "белые";
		},
	},
});

export const { moveChecker, removeChecker, endGame } = checkersGame.actions;
export default checkersGame.reducer;
