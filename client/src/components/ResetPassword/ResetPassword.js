import React, { useState, useEffect } from "react";
import Footer from "../Footer/Footer";
import { useApiRequest } from "../../hooks/useFetch";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
	const [email, setEmail] = useState("");
	const { message, sendRequest } = useApiRequest();
	const navigate = useNavigate();

	const handleChange = (e) => {
		setEmail(e.target.value);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		sendRequest({
			url: "resetpassword",
			method: "POST",
			body: { email },
		});
	};

	useEffect(() => {
		if (message && message.type === "success") {
			const timer = setTimeout(() => {
				navigate("/");
			}, 5000);

			return () => clearTimeout(timer); // reset timer cuando actualiza componente
		}
	}, [message, navigate]);

	return (
		<div>
			<div className="container mt-3 min-vh-100">
				<div className="card">
					<h2 className="h2 p-3">Solicitar nueva contraseña:</h2>
					<form onSubmit={handleSubmit}>
						<div className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input">
							<label
								htmlFor="email form-label"
								className="form-label h5"
							>
								Correo electrónico
							</label>

							<input
								type="email"
								id="email"
								className="form-control "
								value={email}
								onChange={handleChange}
								required
							/>

							<button
								type="submit"
								className="btn btn-primary mt-3"
							>
								Enviar
							</button>
						</div>
					</form>
					{message && (
						<div
							className={`alert mt-3 ${
								message.type === "success"
									? "alert-success"
									: "alert-danger"
							}`}
						>
							{message.text}
						</div>
					)}
				</div>
			</div>
			<Footer></Footer>
		</div>
	);
}
