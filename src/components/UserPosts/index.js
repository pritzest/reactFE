import React, { useState, useCallback, useEffect } from "react";
import classes from "./UserPosts.module.css";
import { IoNewspaperOutline } from "react-icons/io5";
import Post from "../../components/Posts/index";
import ToastContainer, { toaster } from "../../components/ToastContainer";

function UserPosts({ profilePicture }) {
	const [posts, setPosts] = useState([]);
	const [post, setPost] = useState("");

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
		<div className={classes.container_Post}>
			<div className={classes.Navbar_Feed}>
				<IoNewspaperOutline className={classes.icons_feed} />
				<p>My Feed</p>
				<IoNewspaperOutline className={classes.icons_feed} />
			</div>
			<div className={classes.WritePost}>
				<img src={profilePicture} className={classes.avator} />
				<input
					type="text"
					placeholder="What's Happening?"
					onChange={onChangePost}
					value={post}
				></input>
				<div>
					<button onClick={onSavePost}>Write a Post</button>
				</div>
			</div>
			{posts.map((post) => (
				<Post
					key={post._id}
					postId={post._id}
					post={post.description}
					user={{
						profilePicture: post.user_id.profile_picture_url,
						firstName: post.user_id.first_name,
						lastName: post.user_id.last_name,
						id: post.user_id._id,
					}}
					createdAt={post.createdAt}
					likes={post.likes}
					comments={post.comments}
				/>
			))}
		</div>
	);
}

export default UserPosts;
