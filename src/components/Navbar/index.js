import React from "react";
import {
	IoHomeOutline,
	IoPersonAddOutline,
	IoLogOutOutline,
	IoSettingsOutline,
} from "react-icons/io5";
import logo from "../../assets/Logo.png";
import classes from "./navbar.module.css";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";

import ToastContainer, { toaster } from "../../components/ToastContainer";

function Navbar() {
	const navigate = useNavigate();
	const decodedUser = jwt_decode(localStorage.getItem("token"));
	const userId = decodedUser.id;
	const profilePicture =
		decodedUser.profilePicture ?? "https://i.stack.imgur.com/l60Hf.png";

	const onLogout = () => {
		localStorage.removeItem("token");
		toaster.success("Logout succesfully!");
		setTimeout(() => {
			navigate("/login");
		}, 2000);
	};
	return (
		<div className={classes.container_Nav}>
			<div className={classes.container_logo}>
				<img src={logo} className={classes.logo} />
				<div className={classes.logo_text}>SUPERNOVA</div>
			</div>
			<div className={classes.container_profile}>
				<img src={profilePicture} className={classes.avator} />
				<div className={classes.container_profile_text}>
					<span>{decodedUser.name}</span>
					<p> {decodedUser.email}</p>
				</div>
				<div
					className={classes.container_profile_settings}
					onClick={() => navigate("/edit-profile")}
				>
					<IoSettingsOutline className={classes.icons} />
				</div>
			</div>
			<div className={classes.Navbar}>
				<div
					className={classes.Navbar_Link}
					onClick={() => navigate("/feed")}
				>
					<IoHomeOutline className={classes.icons} />
					<p>Home</p>
				</div>
				<div
					className={classes.Navbar_Link}
					onClick={() => navigate(`/profile/${userId}`)}
				>
					<IoPersonAddOutline className={classes.icons} />
					<p>Profile</p>
				</div>
				<div className={classes.Navbar_Link} onClick={onLogout}>
					<IoLogOutOutline className={classes.icons} />
					<p>Logout</p>
				</div>
			</div>
		</div>
	);
}

export default Navbar;
