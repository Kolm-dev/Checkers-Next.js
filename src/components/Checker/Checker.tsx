import React from "react";
import styles from "./Checker.module.scss";
import { useAppDispatch } from "@/hooks";

interface CheckerComponentProps {
	color: "black" | "white";
}

const Checker = ({ color }: CheckerComponentProps) => {
	const dispatch = useAppDispatch();

	return (
		<div
			className={`
			${styles.checker}
				${color === "black" ? styles.black : styles.white}
	`}
		></div>
	);
};

export default Checker;
