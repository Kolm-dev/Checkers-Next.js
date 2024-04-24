import { toast } from "react-toastify";

export const errorNotifications = (message: string) => {
	toast.error(message, {
		closeOnClick: true,
		autoClose: 2000,
	});
};

export const successNotifications = (message: string, time: number = 1000) => {
	// Время показа уведомления по умолчанию - 1500 мс
	// Можно изменить, передав вторым аргументом необходимое время в миллисекундах

	toast.success(message, {
		autoClose: time,
		closeOnClick: true,
	});
};
