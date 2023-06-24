import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import classes from "./SinglePage.module.css";
import ToastContainer, { toaster } from "../../components/ToastContainer";
import Navbar from "../../components/Navbar";
import GetOnePost from "../../components/GetOnePost/GetOnePost";
import jwt_decode from "jwt-decode";

function SinglePage() {
	const token = localStorage.getItem("token");
	const decodedUser = jwt_decode(token);
	const profilePicture =
		decodedUser.profilePicture ?? "https://i.stack.imgur.com/l60Hf.png";
	const userId = decodedUser.id;

	const [postDetails, setPostDetails] = useState();
	const { id } = useParams();

	const fetchPost = useCallback(async () => {
		try {
			const res = await fetch(
				`${process.env.REACT_APP_URLBACKEND}/blog/${id}`,
				{
					method: "GET",
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			const data = await res.json();
			setPostDetails(data.blog);

			console.log("bloggeristt", data.blog);
		} catch (err) {
			console.log(err);
		}
	}, []);

	useEffect(() => {
		fetchPost();
	}, [fetchPost]);

	return (
		<>
			<ToastContainer />
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
					{postDetails && (
						<GetOnePost
							key={postDetails._id}
							postId={postDetails._id}
							post={postDetails.description}
							user={{
								profilePicture:
									postDetails.user_id.profile_picture_url,
								firstName: postDetails.user_id.first_name,
								lastName: postDetails.user_id.last_name,
								id: postDetails.user_id._id,
							}}
							createdAt={postDetails.createdAt}
							likes={postDetails.likes || []}
							comments={postDetails.comments || []}
							// onPostDelete={onDeleteHandler}
						/>
					)}
				</div>
			</section>
		</>
	);
}

export default SinglePage;
