import React from "react";
import { Formik, Field, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";
import ToastContainer, { toaster } from "../../components/ToastContainer";
import classes from "./Signup.module.css";

function Signup() {
	const navigate = useNavigate();

	const onSubmit = async (values, { setSubmitting }) => {
		setSubmitting(true);
		try {
			const res = await fetch(
				`${process.env.REACT_APP_URLBACKEND}/signup`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(values),
				}
			);
			const data = await res.json();

			if (res.status === 422) {
				toaster.error(data.message[0].msg);
				throw res;
			} else if (res.status === 403) {
				toaster.error(data.message);
				throw res;
			}

			setSubmitting(false);
			toaster.success(data.message);
			localStorage.setItem("token", data.token);
			setTimeout(() => {
				navigate("/feed");
			}, 1500);
		} catch (err) {
			setSubmitting(false);
			throw err;
		}
	};

	return (
		<>
			<body>
				<ToastContainer />

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

						<div className={classes.container}>
							<div className={classes.form}>
								<h2>Create an Account!</h2>
								<Formik
									initialValues={{
										first_name: "",
										last_name: "",
										email: "",
										password: "",
										bio: "",
										birthday: "",
										profile_picture: "",
									}}
									validate={(values) => {
										const errors = {};

										return errors;
									}}
									onSubmit={onSubmit}
								>
									{({
										values,
										errors,
										touched,
										handleChange,
										handleBlur,
										handleSubmit,
										isSubmitting,
									}) => (
										<form onSubmit={handleSubmit}>
											<div className={classes.inputBox}>
												<Field
													type="text"
													placeholder="First Name"
													name="first_name"
												/>
											</div>
											<div className={classes.inputBox}>
												<Field
													type="text"
													placeholder="Last Name"
													name="last_name"
												/>
											</div>
											<div className={classes.inputBox}>
												<Field
													type="text"
													placeholder="Email"
													name="email"
												/>
											</div>
											<div className={classes.inputBox}>
												<Field
													type="password"
													placeholder="Password"
													name="password"
												/>
											</div>
											<div className={classes.inputBox}>
												<Field
													type="date"
													name="birthday"
												/>
											</div>
											<div className={classes.inputBox}>
												<textarea
													rows="5"
													cols="43"
													placeholder="Bio"
													name="bio"
													onChange={handleChange}
													onBlur={handleBlur}
													value={values.bio}
												></textarea>
											</div>
											<div className={classes.inputBox}>
												<button
													type="submit"
													value={"Sign Up"}
													disabled={isSubmitting}
												>
													Submit
												</button>
											</div>
											<p className={classes.forget}>
												Already have an account?
												<a
													href="/login"
													onClick={() =>
														navigate("/login")
													}
												>
													Login
												</a>
											</p>
										</form>
									)}
								</Formik>
							</div>
						</div>
					</div>
				</section>
			</body>
		</>
	);
}

export default Signup;
