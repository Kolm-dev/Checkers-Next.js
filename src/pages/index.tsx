import Board from "@/components/Board/Board";
import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function Home() {
	useEffect(() => {
		toast("Хорошей игры!", {
			autoClose: 2000,
			closeOnClick: true,
			position: "top-center",
			closeButton: false,
		});
	}, []);

	return (
		<div>
			<ToastContainer theme="dark" />
			<Board />
		</div>
	);
}
