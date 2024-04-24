import React from "react";
import styles from "./Board.module.scss";
import { useAppDispatch, useAppSelector } from "@/hooks";
import Checker from "../Checker/Checker";
import { moveChecker, removeChecker, endGame } from "@/store/checkersGame.slice";
import { errorNotifications, successNotifications } from "@/Notifications";

const Board = () => {
	const dispatch = useAppDispatch();
	const { cells, gameFinished, winner } = useAppSelector(state => state.checkersGame);
	const [selected, setSelected] = React.useState<number | null>(null);
	const [isWhiteNext, setIsWhiteNext] = React.useState(true);

	const handleSelect = (index: number) => {
		if (cells[index]) {
			setSelected(index);
		}
	};

	const cancelCheckerMove = (e: React.MouseEvent) => {
		e.preventDefault();
		setSelected(null);
		successNotifications("Выбор шашки отменен");
	};

	const handleMove = (index: number) => {
		if (selected !== null && validateMove(selected, index, cells)) {
			dispatch(
				moveChecker({
					from: selected,
					to: index,
					checker: cells[selected],
				})
			);
			setIsWhiteNext(!isWhiteNext);
			setSelected(null);
		}
	};

	const handleCellClick = (index: number) => {
		if (selected === null) {
			handleSelect(index);
		} else {
			handleMove(index);
		}
	};

	const validateMove = (fromIndex: number, toIndex: number, cells: Checker[]) => {
		const fromRow = Math.floor(fromIndex / 8); // to куда, from откуда - ряд и столбец
		const toRow = Math.floor(toIndex / 8); 
		const fromCol = fromIndex % 8;
		const toCol = toIndex % 8;

		// Игра закончена
		// 1. Нет шашек одного цвета
		// 2. Нет возможности хода
		// 3. Нет возможности взятия
		// 4. Одна шашка осталась

		// Проверка на 1 и 4

		const whiteCheckers = cells.filter(checker => checker === "white").length;  
		const blackCheckers = cells.filter(checker => checker === "black").length;

		if (whiteCheckers === 0) {
			dispatch(endGame({ winner: "black" }));
		}

		if (blackCheckers === 0) {
			dispatch(endGame({ winner: "white" }));
		}

		// Проверка на 2 и 3

		let hasValidMove = false; // Есть ли возможность хода
		let hasValidCapture = false; // Есть ли возможность взятия

		// Проверка на возможность хода и взятия
		for (let i = 0; i < cells.length; i++) {
			if (cells[i] === (isWhiteNext ? "white" : "black")) {
				const row = Math.floor(i / 8);
				const col = i % 8;

				const possibleMoves = [
					{ row: row - 1, col: col - 1 },
					{ row: row - 1, col: col + 1 },
					{ row: row + 1, col: col - 1 },
					{ row: row + 1, col: col + 1 },
				];

				// Проверка на возможность взятия

				for (const move of possibleMoves) {
					const index = move.row * 8 + move.col;
					if (move.row >= 0 && move.row < 8 && move.col >= 0 && move.col < 8 && cells[index] === null) {
						hasValidMove = true;
					}

					const middleIndex = ((row + move.row) / 2) * 8 + (col + move.col) / 2;
					if (
						move.row >= 0 &&
						move.row < 8 &&
						move.col >= 0 &&
						move.col < 8 &&
						cells[index] === null &&
						cells[middleIndex] !== null &&
						cells[middleIndex] !== cells[i]
					) {
						hasValidCapture = true;
					}
				}
			}
		}

		if (!hasValidMove && !hasValidCapture) { 
			dispatch(endGame({ winner: isWhiteNext ? "black" : "white" }));
		}

		// Проверка на 4 (ничья)

		if (whiteCheckers === 1 && blackCheckers === 1) {
			dispatch(endGame({ winner: "ничья" }));
		}

		if ((isWhiteNext && cells[fromIndex] !== "white") || (!isWhiteNext && cells[fromIndex] !== "black")) { // Проверка на очередность хода
			errorNotifications(`Сейчас ходят другие шашки - ${isWhiteNext ? "белые" : "черные"}`);
			return false;
		}

		if (fromIndex === toIndex) {  // Если шашка находится на той же клетке, выберите другую клетку
			errorNotifications("Шашка находится на той же клетке, выберите другую клетку");
			return false;
		}

		if (Math.abs(fromRow - toRow) !== Math.abs(fromCol - toCol)) {
			errorNotifications("Ход не по диагонали");
			return false;
		}

		if (cells[toIndex] !== null) {
			errorNotifications("Клетка занята");
			return false;
		}

		if (Math.abs(fromRow - toRow) === 1) { // Обычный ход
			successNotifications("Ход выполнен");
			return true;
		}

		if (Math.abs(fromRow - toRow) === 2) {
			const middleIndex = Math.floor((fromIndex + toIndex) / 2);
			if (cells[middleIndex] !== null && cells[middleIndex] !== cells[fromIndex]) {
				dispatch(removeChecker({ from: middleIndex }));
				successNotifications("Ход выполнен, шашка противника удалена");
				return true;
			}
		}

		errorNotifications("Ход не удовлетворяет правилам взятия или перемещения");
		return false;
	};

	console.log(gameFinished);

	const playAgain = () => {
		window.location.reload();
	};

	return (
		<>
			{gameFinished && (
				<div className={styles.gameOver}>
					<h2 className={styles.winner}>Игра окончена! Итог: {winner}</h2>
					<button onClick={() => playAgain()}>Начать сначала</button>
				</div>
			)}
			<div
				className={styles.board}
				onContextMenu={cancelCheckerMove}
			>
				{!gameFinished &&
					cells.map((checker, index) => {
						const row = Math.floor(index / 8);
						const col = index % 8;
						const cellClass = (row % 2 === 0 ? col % 2 === 1 : col % 2 === 0) ? styles.black : styles.white; 
						return (
							<div
								key={index}
								onClick={() => handleCellClick(index)}
								className={`${styles.cell} ${cellClass} ${selected === index ? styles.selected : ""}`}
							>
								{checker && <Checker color={checker} />}
							</div>
						);
					})}
			</div>
		</>
	);
};

export default Board;
