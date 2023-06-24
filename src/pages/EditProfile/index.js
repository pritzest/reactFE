import React, { useState } from "react";
import jwt_decode from "jwt-decode";
import classes from "./EditProfile.module.css";
import moment from "moment";
import Navbar from "../../components/Navbar";
import EditProfileComponent from "../../components/EditProfile";
function EditProfile() {
	const decodedUser = jwt_decode(localStorage.getItem("token"));
	const [formState, setFormState] = useState({
		firstName: decodedUser.firstName,
		lastName: decodedUser.lastName,
		birthday: moment(new Date(decodedUser.birthday)).format("YYYY-MM-DD"),
		bio: decodedUser.bio,
	});

	const onChangeProfile = (e) => {
		setFormState((formData) => ({
			...formData,
			[e.target.name]: e.target.value,
		}));
	};

	const onSaveProfile = async () => {
		try {
			const res = await fetch(
				`${process.env.REACT_APP_URLBACKEND}/profile`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${localStorage.getItem(
							"token"
						)}`,
					},
					body: JSON.stringify(formState),
				}
			);

			const data = await res.json();
			localStorage.setItem("token", data.token);
			window.location.reload(true);
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<>
			<section>
				<div className={classes.color}></div>
				<div className={classes.color}></div>
				<div className={classes.color}></div>
				{/* <div className="box">
            <div className="square"></div>
            <div className="square" ></div>
            <div className="square" ></div>
            <div className="square" ></div>
            <div className="square" ></div> */}

				<div className={classes.container}>
					{/* </div> */}
					<Navbar />
					<div className={classes.container_Post}>
						<EditProfileComponent />
					</div>
				</div>
			</section>
		</>
	);
}

export default EditProfile;
