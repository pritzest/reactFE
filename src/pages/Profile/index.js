import React, { useCallback, useEffect, useState } from "react";
import classes from "./Profile.module.css";
import jwt_decode from "jwt-decode";
import Post from "../../components/Posts/index";

import Navbar from "../../components/Navbar";

function Profile() {
	const [postsOfUser, setPostsOfUser] = useState([]);
	const token = localStorage.getItem("token");
	const decodedUser = jwt_decode(token);
	const profilePicture =
		decodedUser.profilePicture ?? "https://i.stack.imgur.com/l60Hf.png";

	const fetchUserBlogs = useCallback(async () => {
		try {
			const res = await fetch(
				`${process.env.REACT_APP_URLBACKEND}/blog/userblogs`,
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
			setPostsOfUser(data.blogs);
		} catch (err) {
			console.log(err);
		}
	}, []);

	useEffect(() => {
		fetchUserBlogs();
	}, [fetchUserBlogs]);

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
						<div className={classes.profilePicture}>
							<img
								src={profilePicture}
								className={classes.profilePicture_avatar}
							></img>
						</div>
						<div className={classes.profileHeader}>
							<p>
								{decodedUser.firstName} {decodedUser.lastName}
							</p>
						</div>
						<div className={classes.profileSubHeader}>
							<p>{decodedUser.birthday}</p>
							<p>{decodedUser.bio}</p>
						</div>
						<hr />
						{postsOfUser.map((post) => (
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
								likes={[]}
								comments={[]}
							/>
						))}
					</div>
				</div>
			</section>
		</>
	);
}

export default Profile;
