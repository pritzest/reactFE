import React, { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import classes from "./Posts.module.css";
import {
	IoHeartOutline,
	IoDocumentTextOutline,
	IoHeartSharp,
	IoTrashOutline,
} from "react-icons/io5";
import jwt_decode from "jwt-decode";
import CreateComment from "../CreateComment";
import moment from "moment";
import { toaster } from "../ToastContainer";

function Posts({
	postId,
	user,
	createdAt,
	post,
	likes,
	comments,
	onPostDelete,
}) {
	const [isShowComment, setIsShowComment] = useState(false);
	const [commentList, setCommentList] = useState(comments);
	const [showDeleteOption, setShowDeleteOption] = useState(false);

	const onComment = (comment) => {
		setCommentList((prev) => [...prev, comment]);
	};

	// Post details
	const token = localStorage.getItem("token");
	const decodedUser = jwt_decode(token);
	const profilePicture =
		decodedUser.profilePicture ?? "https://i.stack.imgur.com/l60Hf.png";
	const userId = decodedUser.id;
	const [isUserLiked, setIsUserLiked] = useState(likes.includes(userId));
	const [likesLength, setLikesLength] = useState(likes.length);

	const toggleLike = useCallback(async () => {
		try {
			const response = await fetch(
				`${process.env.REACT_APP_URLBACKEND}/like/${postId}`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({ isLiked: isUserLiked }),
				}
			);

			if (!response.ok) {
				throw response;
			}
		} catch (error) {
			console.error(error);
		}
	}, [isUserLiked]);

	// console.log(comments);

	const dateFormat = (commentCreatedDate) => {
		const date = moment(createdAt);
		const datePosted = date.format("MMMM DD");
		return datePosted;
	};

	const onPostDeleteHandler = async (postId) => {
		setShowDeleteOption(false);
		try {
			const response = await fetch(
				`${process.env.REACT_APP_URLBACKEND}/blog/${postId}`,
				{
					method: "DELETE",
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			if (!response.ok) {
				throw response;
			}

			const data = await response.json();
			toaster.success(data.message);
			onPostDelete(postId);
		} catch (error) {
			console.error(error);
		}
	};

	const onLikeClick = () => {
		setIsUserLiked((prev) => !prev);
		if (!isUserLiked) setLikesLength((prev) => prev + 1);
		else setLikesLength((prev) => prev - 1);
	};

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
					<Link
						to={`/profile/${user.id}`}
						className={classes.profile_link}
					>
						{user.firstName} {user.lastName}
						<span>
							@{user.firstName}
							{user.lastName}
						</span>
					</Link>
					<Link to={`/post/${postId}`} className={classes.PostLink}>
						<span>{dateFormat(createdAt)}</span>
						{console.log(createdAt)}
						<p>{post}</p>
					</Link>
				</div>

				{userId === user.id && (
					<div className={classes.Post_deleteContainer}>
						<button
							type="button"
							className={classes.Post_delete}
							onClick={() => setShowDeleteOption((prev) => !prev)}
						>
							<IoTrashOutline />
						</button>
						{showDeleteOption && (
							<div className={classes.Popup}>
								<button
									type="button"
									onClick={() => onPostDeleteHandler(postId)}
								>
									Delete Post
								</button>
							</div>
						)}
					</div>
				)}
			</div>
			<div className={classes.Posts_Count}>
				<div className={classes.Posts_Likes} onClick={toggleLike}>
					<button
						onClick={onLikeClick}
						className={classes.likeButton}
					>
						{isUserLiked ? (
							<IoHeartSharp style={{ cursor: "pointer" }} />
						) : (
							<IoHeartOutline style={{ cursor: "pointer" }} />
						)}
					</button>

					<p>{likesLength} Likes</p>
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
							<img src={comment.userId.profile_picture_url} />
							<div className={classes.commentsItself_header}>
								<p>
									{`${comment.userId.first_name} ${comment.userId.last_name}`}
								</p>
								<p>{dateFormat(comment.createdAt)}</p>
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
