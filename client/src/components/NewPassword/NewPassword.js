import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApiRequest } from "../../hooks/useFetch.js";

export default function NewPassword() {
	const [password, setPassword] = useState("");
	const { token } = useParams();
	const navigate = useNavigate();
	const { message, sendRequest } = useApiRequest();

	useEffect(() => {
		if (message && message.type === "success") {
			alert(message.text);
			navigate("/");
		} else if (message && message.type === "error") {
			alert(message.text);
		}
	}, [message, navigate]);

	const handleSubmit = async (e) => {
		e.preventDefault();

		await sendRequest({
			url: `newpassword/${token}`,
			method: "POST",
			body: { password },
		});
	};

	return (
		<div>
			<h2>Cambio de contraseña</h2>
			<form onSubmit={handleSubmit}>
				<div>
					<label htmlFor="password">Nueva contraseña:</label>
					<input
						type="password"
						id="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</div>
				<button className="btn btn-primary" type="submit">
					Cambiar contraseña
				</button>
			</form>
			{message && <p className={message.type}>{message.text}</p>}
		</div>
	);
}
