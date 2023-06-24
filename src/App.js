import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import auth from "./utils/auth";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MainPage from "./pages/Feed";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import SinglePost from "./pages/SinglePost";

const myRouter = createBrowserRouter([
	{
		path: "/",
		children: [
			{ path: "login", element: <Login /> },
			{ path: "signup", element: <Signup /> },
			{ path: "feed", element: <MainPage />, loader: auth },
			{ path: "post/:id", element: <SinglePost />, loader: auth },
			{ path: "profile/:id", element: <Profile />, loader: auth },
			{ path: "edit-profile", element: <EditProfile />, loader: auth },

			{ index: true, element: <div></div> },
		],
	},
]);
function App() {
	return <RouterProvider router={myRouter} />;
}
export default App;
