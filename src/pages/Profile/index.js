import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import classes from "./Profile.module.css";
import jwt_decode from "jwt-decode";
import Post from "../../components/Posts/index";

import Navbar from "../../components/Navbar";

function Profile() {
	const { id } = useParams();
	const [postsOfUser, setPostsOfUser] = useState([]);
	const [userDetails, setUserDetails] = useState();
	const token = localStorage.getItem("token");
	const decodedUser = jwt_decode(token);
	const profilePicture =
		decodedUser.profilePicture ?? "https://i.stack.imgur.com/l60Hf.png";

	const fetchUserInformation = useCallback(async () => {
		try {
			const res = await fetch(
				`${process.env.REACT_APP_URLBACKEND}/profile/${id}`,
				{
					method: "GET",
					headers: {
						Authorization: `Bearer ${localStorage.getItem(
							"token"
						)}`,
					},
				}
			);

			const data = await res.json();
			setUserDetails(data.user);
		} catch (err) {
			console.log(err);
		}
	}, [id]);

	const fetchUserBlogs = useCallback(async () => {
		try {
			const res = await fetch(
				`${process.env.REACT_APP_URLBACKEND}/blog/userblogs/${id}`,
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
			setPostsOfUser(data.postsData);
		} catch (err) {
			console.log(err);
		}
	}, [id]);

	useEffect(() => {
		fetchUserInformation();
		fetchUserBlogs();
	}, [fetchUserBlogs, fetchUserInformation]);

	const onDeleteHandler = (postId) => {
		const filteredPost = postsOfUser.filter((post) => post._id !== postId);
		setPostsOfUser(filteredPost);
	};

	return (
		<>
			<section>
				<div className={classes.color}></div>
				<div className={classes.color}></div>
				<div className={classes.color}></div>
				<div className={classes.box}>
					<div className={classes.square}></div>
					<div className={classes.square}></div>
					<div className={classes.square}></div>
					<div className={classes.square}></div>
					<div className={classes.square}></div>
				</div>
				<div className={classes.container}>
					{/* </div> */}
					<Navbar />
					<div className={classes.container_Post}>
						{userDetails && (
							<>
								<div className={classes.profilePicture}>
									<img
										src={userDetails.profile_picture_url}
										className={
											classes.profilePicture_avatar
										}
									></img>
								</div>
								<div className={classes.profileHeader}>
									<p>
										{userDetails.first_name}{" "}
										{userDetails.last_name}
									</p>
								</div>
								<div className={classes.profileSubHeader}>
									<p>{userDetails.birthday}</p>
									<p>{userDetails.bio}</p>
								</div>
							</>
						)}
						<hr />
						{postsOfUser?.map((post) => (
							<Post
								key={post._id}
								postId={post._id}
								post={post.description}
								user={{
									profilePicture:
										post.user_id.profile_picture_url,
									firstName: post.user_id.first_name,
									lastName: post.user_id.last_name,
									id: post.user_id._id,
								}}
								createdAt={post.createdAt}
								likes={post.likes}
								comments={post.comments}
								onPostDelete={onDeleteHandler}
							/>
						))}
					</div>
				</div>
			</section>
		</>
	);
}

export default Profile;
