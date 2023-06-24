import React from "react";
import classes from "./Login.module.css";
import { useNavigate } from "react-router-dom";
import { Formik, Field, ErrorMessage, Form } from "formik";
import ToastContainer, { toaster } from "../../components/ToastContainer";

function Login() {
	const navigate = useNavigate();

	const onSubmit = async (values, { setSubmitting }) => {
		setSubmitting(true);
		try {
			const res = await fetch(
				`${process.env.REACT_APP_URLBACKEND}/login`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(values),
				}
			);
			const data = await res.json();

			console.log(data);
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
			{" "}
			<ToastContainer />
			<body>
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
								<h2>Login</h2>
								<Formik
									initialValues={{ email: "", password: "" }}
									validate={(values) => {
										const errors = {};
										if (!values.email) {
											errors.email = "Required";
										} else if (
											!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,}$/i.test(
												values.email
											)
										) {
											errors.email =
												"Invalid email address";
										}
										return errors;
									}}
									onSubmit={onSubmit}
								>
									{({ isSubmitting, handleSubmit }) => (
										<Form onSubmit={handleSubmit}>
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
												<button type="submit">
													Login
												</button>
											</div>
											<p className={classes.forget}>
												Forgot Password?{" "}
												<a href="/forgot">Click here!</a>
											</p>
											<p className={classes.forget}>
												Don't have an account?
												<a
													href="/signup"
													onClick={() =>
														navigate("/signup")
													}
												>
													{" "}
													Sign Up
												</a>
											</p>
										</Form>
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

export default Login;
