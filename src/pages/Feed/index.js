import React, { useState, useCallback, useEffect } from "react";
import jwt_decode from "jwt-decode";
import classes from "./MainPage.module.css";
import { useNavigate } from "react-router-dom";
import ToastContainer, { toaster } from "../../components/ToastContainer";
import Post from "../../components/Posts/index";
import NavBar from "../../components/Navbar/index";
import UserPosts from "../../components/UserPosts";

function Feed() {
	const [posts, setPosts] = useState([]);
	const [post, setPost] = useState("");
	const navigate = useNavigate();

	const decodedUser = jwt_decode(localStorage.getItem("token"));
	const profilePicture =
		decodedUser.profilePicture ?? "https://i.stack.imgur.com/l60Hf.png";

	const onLogout = () => {
		localStorage.removeItem("token");
		toaster.success("Logout succesfully!");
		setTimeout(() => {
			navigate("/login");
		}, 2000);
	};

	const fetchPosts = useCallback(async () => {
		try {
			const res = await fetch(
				`${process.env.REACT_APP_URLBACKEND}/blog`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${localStorage.getItem(
							"token"
						)}`,
					},
				}
			);

			const data = await res.json();
			setPosts(data.postsData);
		} catch (err) {
			console.log(err);
		}
	}, []);

	const onSavePost = async () => {
		try {
			const res = await fetch(
				`${process.env.REACT_APP_URLBACKEND}/blog`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${localStorage.getItem(
							"token"
						)}`,
					},
					body: JSON.stringify({ description: post }),
				}
			);
			console.log(res);

			const data = await res.json();
			if (res.status === 422) {
				toaster.error(data.message[0].msg);
				throw res;
			} else if (res.status === 403) {
				toaster.error(data.message);
				throw res;
			}
			toaster.success(data.message);
			setTimeout(() => {
				window.location.reload(true);
			}, 2000);
		} catch (err) {
			console.log(err);
		}
	};

	const onChangePost = (e) => {
		setPost(e.target.value);
	};

	useEffect(() => {
		fetchPosts();
	}, [fetchPosts]);

	return (
		<>
			<ToastContainer />
			<body>
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
						<NavBar />
						<UserPosts profilePicture={profilePicture} />
					</div>
				</section>
			</body>
		</>
	);
}

export default Feed;
