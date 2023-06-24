import React, { useCallback, useState } from "react";
import classes from "./Posts.module.css";
import {
	IoHeartOutline,
	IoDocumentTextOutline,
	IoHeartSharp,
	IoPaperPlaneOutline,
} from "react-icons/io5";
import jwt_decode from "jwt-decode";
import CreateComment from "../CreateComment";
import moment from 'moment';


function Posts({ postId, user, createdAt, post, likes, comments }) {
	const [isShowComment, setIsShowComment] = useState(false);
	const [commentList, setCommentList] = useState(comments);

	const onComment = (comment) => {
		setCommentList((prev) => [ ...prev,comment]);
		console.log(comment)
	};

	// Post details
	const token = localStorage.getItem("token");
	const decodedUser = jwt_decode(token);
	const profilePicture =
		decodedUser.profilePicture ?? "https://i.stack.imgur.com/l60Hf.png";
	const userId = decodedUser.id;
	const isLiked = likes.includes(userId);

	const toggleLike = useCallback(async () => {
		try {
			const response = await fetch(
				`${process.env.REACT_APP_URLBACKEND}/like/${postId}`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${localStorage.getItem(
							"token"
						)}`,
					},
					body: JSON.stringify({ isLiked }),
				}
			);
			const data = await response.json();
			window.location.reload(true);
		} catch (error) {
			console.error(error);
		}
	}, [isLiked]);

	const date = moment(createdAt);
	console.log(date);
	const timePosted = date.format('HH:mm')
	const datePosted  = date.format('MMMM DD')
	return (
		<div className={classes.Posts}>
			<div className={classes.Posts_header}>
				<img
					src={`${
						user.profilePicture ??
						"https://i.stack.imgur.com/l60Hf.png"
					}`}
					alt=""
					className={classes.avator}
				/>
				<div className={classes.Posts_header_info}>
					{user.firstName} {user.lastName}
					<span>
						@{user.firstName}
						{user.lastName}
					</span>
					<span>{datePosted}</span>
					<p>{post}</p>
				</div>
			</div>
			<div className={classes.Posts_Count}>
				<div className={classes.Posts_Likes} onClick={toggleLike}>
					{isLiked ? <IoHeartSharp /> : <IoHeartOutline />}
					<p>{likes.length} Likes</p>
				</div>
				<div
					className={classes.Posts_Comments}
					onClick={() => setIsShowComment((state) => !state)}
				>
					<IoDocumentTextOutline />
					<p>{comments.length} Comments</p>
				</div>
			</div>
			{isShowComment && (
				
				<div className={classes.comments_collection}>
					<CreateComment postId={postId} onComment={onComment} />

					{commentList.map((comment) => (
						<div className={classes.commentsItself}>
							{console.log(comment)}

							<img src={profilePicture} />
							<div className={classes.commentsItself_header}>
							<p>
								{`${comment.userId.first_name} ${comment.userId.last_name}`}
							</p>
								<p>date</p>
							</div>

							<p key={comment._id}>{comment.description}</p>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

export default Posts;
