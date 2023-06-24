import React, { useState, useCallback } from "react";
import jwt_decode from "jwt-decode";
import classes from "./EditProfileComponent.module.css";
import moment from "moment";
import { Buffer } from "buffer";

function EditProfile() {
	const decodedUser = jwt_decode(localStorage.getItem("token"));
	const profilePicture =
		decodedUser.profilePicture ?? "https://i.stack.imgur.com/l60Hf.png";
	const [userImage, setUserImage] = useState(profilePicture);

	const [formState, setFormState] = useState({
		firstName: decodedUser.firstName,
		lastName: decodedUser.lastName,
		birthday: moment(new Date(decodedUser.birthday)).format("YYYY-MM-DD"),
		bio: decodedUser.bio,
	});

	const getBase64 = (file, cb) => {
		const reader = new FileReader();
		reader.addEventListener("load", () => {
			const img = reader.result;

			const fileSize = new Buffer(img, "base64").length;
			return cb(img);
		});
		reader.readAsDataURL(file);
	};

	const onFileChange = (e) => {
		const file = e.target.files[0];
		getBase64(file, (url) => {
			setUserImage(url);
		});
	};

	const onChangeProfile = (e) => {
		setFormState((formData) => ({
			...formData,
			[e.target.name]: e.target.value,
		}));
	};

	const saveProfilePicture = useCallback(async () => {
		try {
			const res = await fetch(
				`${process.env.REACT_APP_URLBACKEND}/profile`,
				{
					method: "PATCH",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${localStorage.getItem(
							"token"
						)}`,
					},
					body: JSON.stringify({ profile_picture_url: userImage }),
				}
			);

			const data = await res.json();

			localStorage.setItem("token", data.token);
			window.location.reload(true);
		} catch (err) {
			console.log(err);
		}
	}, [userImage]);

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
			<div className={classes.EditProfileContainer}>
				<h2 className={classes.Header}>Edit Basic Info</h2>
				<div className={classes.Profile_Container}>
					<div className={classes.firstName}>
						<p>First Name</p>
						<input
							type="text"
							name="firstName"
							value={formState.firstName}
							onChange={onChangeProfile}
						/>
					</div>
					<div className={classes.lastName}>
						<p>Last Name</p>
						<input
							type="text"
							name="lastName"
							value={formState.lastName}
							onChange={onChangeProfile}
						/>
					</div>
					<div className={classes.ProfileBirthday}>
						<p>Birthday</p>
						<input
							type="date"
							name="birthday"
							value={formState.birthday}
							onChange={onChangeProfile}
						/>
					</div>
					<div className={classes.ProfileBio}>
						<p>Bio</p>
						<textarea
							rows="3"
							cols="40"
							onChange={onChangeProfile}
							name="bio"
							value={formState.bio}
						>
							{formState.bio}
						</textarea>
					</div>
					<button
						onClick={onSaveProfile}
						className={classes.saveButton}
					>
						Save
					</button>
				</div>
			</div>
			<hr />
			<div className={classes.EditProfileContainer}>
				<h2 className={classes.Header}>Edit Profile Picture</h2>

				<div className={classes.Profile_Container}>
					<div className={classes.Profile_UploadPic}>
						<div className={classes.Profile_Avatar}>
							<img
								src={userImage}
								className={classes.Profile_Container_Avatar}
							/>
						</div>
						<div>
							<input type="file" onChange={onFileChange} />
						</div>
						<button
							onClick={saveProfilePicture}
							className={classes.saveButton}
						>
							Save File
						</button>
					</div>
				</div>
				<hr />
			</div>
			<hr />
			<div className={classes.EditProfileContainer}>
				<h2 className={classes.Header}>Change Password</h2>

				<div className={classes.Profile_Container}>
					<div className={classes.Profile_Password}>
						<p>Old Password</p>
						<input type="password" name="oldpassword" />
					</div>
					<div className={classes.Profile_PasswordForgot}>
						<p>New Password</p>
						<input type="password" name="newpassword" />
					</div>
					<button onClick={""} className={classes.saveButton}>
						Save Password
					</button>
				</div>
			</div>
		</>
	);
}

export default EditProfile;
