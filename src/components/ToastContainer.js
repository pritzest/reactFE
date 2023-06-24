import React from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

function ToasterContainer() {
	return (
		<ToastContainer
			position="bottom-center"
			autoClose={5000}
			hideProgressBar={false}
			newestOnTop={false}
			closeOnClick
			rtl={false}
			pauseOnFocusLoss
			draggable
			pauseOnHover={false}
			theme="dark"
		/>
	);
}

export const toaster = {
	success(msg) {
		toast.success(msg, {
			position: "bottom-center",
			autoClose: 5000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			theme: "dark",
		});
	},
	error(msg) {
		toast.error(msg, {
			position: "bottom-center",
			autoClose: 5000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			theme: "dark",
		});
	},
};

export default ToasterContainer;
