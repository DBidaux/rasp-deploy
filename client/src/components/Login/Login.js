import React, { useState } from "react";
import Cuadrilla from "../../images/Cuadrilla.jpeg";
import "bootstrap/dist/css/bootstrap.css";
import API_URL from "../../setttings";

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await fetch(`${API_URL}/login`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, password }),
			});

			// Verificar si la respuesta es JSON
			const contentType = response.headers.get("content-type");
			if (contentType && contentType.indexOf("application/json") !== -1) {
				const data = await response.json();
				if (data.ok) {
					// Guardar el token en localStorage
					localStorage.setItem("token", data.token);
					//guardar userID en localStorage
					localStorage.setItem("userID", data.userID);
					//guardar nombre usuario
					localStorage.setItem("username", data.username);
					// Redirigir a la página de inicio
					window.location.href = "../LandingPage";
				} else {
					setError(data.error);
				}
			} else {
				const text = await response.text();
				console.error("Response is not JSON:", text);
				setError("Unexpected response from server");
			}
		} catch (err) {
			console.error("Fetch error:", err);
			setError("Error connecting to server");
		}
	};

	return (
		<div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
			<div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
				<div className="flex flex-col overflow-y-auto md:flex-row">
					<div className="h-32 md:h-auto md:w-1/2">
						<img
							aria-hidden="true"
							className="object-cover w-full h-full dark:hidden"
							src={Cuadrilla}
							alt="Foto cuadrilla"
						/>
					</div>
					<div className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
						<div className="w-full">
							<h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
								Inicio de sesión
							</h1>
							<form onSubmit={handleSubmit}>
								<label className="block text-sm">
									<span className="text-gray-700 dark:text-gray-400">
										Email
									</span>
									<input
										className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
										placeholder="Email"
										value={email}
										onChange={(e) =>
											setEmail(e.target.value)
										}
										required
									/>
								</label>
								<label className="block mt-4 text-sm">
									<span className="text-gray-700 dark:text-gray-400">
										Contraseña
									</span>
									<input
										className="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
										placeholder="***************"
										type="password"
										value={password}
										onChange={(e) =>
											setPassword(e.target.value)
										}
										required
									/>
								</label>
								{error && (
									<p className="mt-2 text-sm text-red-600">
										{error}
									</p>
								)}
								<button
									className="block w-full px-4 py-2 mt-4 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
									type="submit"
								>
									Log in
								</button>
							</form>
							<hr className="my-8" />
							<p className="mt-4">
								<a
									className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
									href="../resetpassword"
								>
									¿Olvidaste tu contraseña?
								</a>
							</p>
							<p className="mt-1">
								<a
									className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
									href="../Register"
								>
									Crear cuenta
								</a>
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
