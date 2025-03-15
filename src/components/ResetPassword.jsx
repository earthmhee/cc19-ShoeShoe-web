// src/components/ResetPassword.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router"; // Corrected import
import { useAuth, useSignIn } from "@clerk/clerk-react";

const ResetPassword = ({ onSubmit }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [code, setCode] = useState("");
	const [successfulCreation, setSuccessfulCreation] = useState(false);
	const [secondFactor, setSecondFactor] = useState(false);
	const [error, setError] = useState("");

	const navigate = useNavigate();
	const { isSignedIn } = useAuth();
	const { isLoaded, signIn, setActive } = useSignIn();

	useEffect(() => {
		if (isSignedIn) {
			navigate("/");
		}
	}, [isSignedIn, navigate]);

	if (!isLoaded) {
		return null;
	}

	// Send the password reset code to the user's email
	async function create(e) {
		e.preventDefault();
		await signIn
			?.create({
				strategy: "reset_password_email_code",
				identifier: email,
			})
			.then((_) => {
				setSuccessfulCreation(true);
				setError("");
			})
			.catch((err) => {
				console.error("error", err.errors[0].longMessage);
				setError(err.errors[0].longMessage);
			});
	}

	// Reset the user's password
	async function reset(e) {
		e.preventDefault();
		await signIn
			?.attemptFirstFactor({
				strategy: "reset_password_email_code",
				code,
				password,
			})
			.then((result) => {
				if (result.status === "needs_second_factor") {
					setSecondFactor(true);
					setError("");
				} else if (result.status === "complete") {
					setActive({ session: result.createdSessionId });
					setError("");
					navigate("/");
				} else {
					console.log(result);
				}
			})
			.catch((err) => {
				console.error("error", err.errors[0].longMessage);
				setError(err.errors[0].longMessage);
			});
	}

	// Handle submission based on whether onSubmit is provided
	const handleSubmit = onSubmit
		? (e) =>
				onSubmit(e, {
					email,
					password,
					code,
					submitFunction: successfulCreation ? reset : create,
				})
		: (e) => (successfulCreation ? reset(e) : create(e));

	return (
		<div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}>
			<h1>Reset Password</h1>
			{!successfulCreation && (
				<>
					<label htmlFor="email">Provide your email address</label>
					<input
						type="email"
						placeholder="e.g john@doe.com"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						style={{ display: "block", width: "100%", margin: "10px 0" }}
					/>
					<button
						type="submit"
						onClick={handleSubmit}
						style={{ width: "100%", padding: "10px" }}
					>
						Send password reset code
					</button>
					{error && <p style={{ color: "red" }}>{error}</p>}
				</>
			)}

			{successfulCreation && (
				<>
					<label htmlFor="password">Enter your new password</label>
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						style={{ display: "block", width: "100%", margin: "10px 0" }}
					/>

					<label htmlFor="code">
						Enter the password reset code that was sent to your email
					</label>
					<input
						type="text"
						value={code}
						onChange={(e) => setCode(e.target.value)}
						style={{ display: "block", width: "100%", margin: "10px 0" }}
					/>

					<button
						type="submit"
						onClick={handleSubmit}
						style={{ width: "100%", padding: "10px" }}
					>
						Reset
					</button>
					{error && <p style={{ color: "red" }}>{error}</p>}
				</>
			)}

			{secondFactor && (
				<p style={{ color: "orange" }}>
					2FA is required, but this UI does not handle that
				</p>
			)}
		</div>
	);
};

export default ResetPassword;
