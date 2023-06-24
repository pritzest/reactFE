import { redirect } from "react-router-dom";

const getAuthToken = () => {
	const token = localStorage.getItem("token");
	return token;
};

const isAuth = () => {
	const token = getAuthToken();

	if (!token) {
		return redirect("/login");
	}

	return null;
};

export default isAuth;
