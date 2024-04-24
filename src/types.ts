type Checker = "black" | "white" | null;

interface BoardState {
	cells: Checker[];
	gameFinished: boolean;
	winner: string | null;
}

interface CheckerPayload {
	from: number;
	to: number;
	checker: Checker;
}

interface CheckerPayloadRemove {
	from: number;
}
