import React, { useState } from "react";
import classes from "./CreateComment.module.css";
import { IoPaperPlaneOutline } from "react-icons/io5";
import jwt_decode from "jwt-decode";

function CreateComment({ postId, onComment }) {
	const [commentData, setCommentData] = useState();
	const token = localStorage.getItem("token");
	const decodedUser = jwt_decode(token);
	const profilePicture =
		decodedUser.profilePicture ?? "https://i.stack.imgur.com/l60Hf.png";

	const onChangeComment = (e) => setCommentData(e.target.value);
	const onSaveComment = async () => {
		try {
			const response = await fetch(
				`${process.env.REACT_APP_URLBACKEND}/comment/${postId}`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({ description: commentData }),
				}
			);

			const data = await response.json();
			onComment(data.comment);
			console.log("aaaa", data);
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<div className={classes.commentUser}>
			<hr className={classes.divider} />
			<div className={classes.comment_createComment}>
				<img src={profilePicture} />
				<input
					type="text"
					placeholder="Write a comment..."
					onChange={onChangeComment}
					value={commentData}
				/>
				<button onClick={onSaveComment}>
					<IoPaperPlaneOutline />
				</button>
			</div>
		</div>
	);
}

export default CreateComment;
