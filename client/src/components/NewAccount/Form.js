import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import API_URL from "../../setttings";

Modal.setAppElement("#root");

export default function Form() {
	const [formData, setFormData] = useState({
		username: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [errors, setErrors] = useState({});
	const [serverResponse, setServerResponse] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const navigate = useNavigate();

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const validate = () => {
		const newErrors = {};
		if (formData.password !== formData.confirmPassword) {
			newErrors.confirmPassword = "Las contraseñas no coinciden";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const feedbackUser = () => {
		if (!serverResponse) {
			alert("Rellena el formulario primero");
		} else {
			alert(serverResponse);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (validate()) {
			try {
				const response = await fetch(`${API_URL}/Register`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(formData),
				});
				const data = await response.json();
				if (data.ok) {
					setServerResponse("Usuario creado exitosamente");
					setIsModalOpen(true);
					setTimeout(() => {
						setIsModalOpen(false);
						navigate("/");
					}, 5000);
				} else {
					setServerResponse(`Error: ${data.error}`);
					setIsModalOpen(true);
				}
			} catch (error) {
				setServerResponse(`Error: ${error.message}`);
				setIsModalOpen(true);
			}
		}
	};

	const closeModal = () => {
		setIsModalOpen(false);
	};

	return (
		<div className="min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
			<div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl dark:bg-gray-800">
				<div className="flex-col overflow-y-auto md:flex-row">
					<div className="flex items-center justify-center p-6 ">
						<div className="w-full">
							<h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
								Registro de Nuevo Usuario
							</h1>
							<form onSubmit={handleSubmit}>
								<div className="mb-4">
									<label
										htmlFor="username"
										className="block text-sm text-gray-700 dark:text-gray-400"
									>
										Nombre de Usuario
									</label>
									<input
										id="username"
										name="username"
										type="text"
										className="block w-full mt-1 text-sm border-gray-600 bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple text-gray-300 dark:focus:shadow-outline-gray form-input"
										placeholder="Nombre de Usuario"
										value={formData.username}
										onChange={handleChange}
									/>
								</div>

								<div className="mb-4">
									<label
										htmlFor="email"
										className="block text-sm text-gray-700 dark:text-gray-400"
									>
										Correo Electrónico
									</label>
									<input
										id="email"
										name="email"
										type="email"
										className="block w-full mt-1 text-sm border-gray-600 bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple text-gray-300 dark:focus:shadow-outline-gray form-input"
										placeholder="Correo Electrónico"
										value={formData.email}
										onChange={handleChange}
									/>
								</div>
								<div className="mb-4">
									<label
										htmlFor="password"
										className="block text-sm text-gray-700 dark:text-gray-400"
									>
										Contraseña
									</label>
									<input
										id="password"
										name="password"
										type="password"
										className="block w-full mt-1 text-sm border-gray-600 bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple text-gray-300 dark:focus:shadow-outline-gray form-input"
										placeholder="***************"
										value={formData.password}
										onChange={handleChange}
									/>
								</div>
								<div className="mb-4">
									<label
										htmlFor="confirmPassword"
										className="block text-sm text-gray-700 dark:text-gray-400"
									>
										Confirmar Contraseña
									</label>
									<input
										id="confirmPassword"
										name="confirmPassword"
										type="password"
										className="block w-full mt-1 text-sm border-gray-600 bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple text-gray-300 dark:focus:shadow-outline-gray form-input"
										placeholder="***************"
										value={formData.confirmPassword}
										onChange={handleChange}
									/>
									{errors.confirmPassword && (
										<p className="text-red-500 text-sm mt-1">
											{errors.confirmPassword}
										</p>
									)}
								</div>

								<button
									type="submit"
									className="block w-full px-4 py-2 mt-4 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
									// onClick={feedbackUser}
								>
									Registrarse
								</button>
							</form>

							{isModalOpen && (
								<div className="mt-4 ">
									<div className="card ">
										<div className="card-header d-flex justify-content-between align-items-center ">
											<h5 className="mb-0">
												Server Response
											</h5>
											<button
												type="button"
												className="btn-close"
												onClick={closeModal}
											></button>
										</div>
										<div className="card-body">
											<p>{serverResponse}</p>
										</div>
										<div className="card-footer d-flex justify-content-between">
											<button
												className="btn btn-secondary"
												onClick={closeModal}
											>
												Close
											</button>
										</div>
									</div>
								</div>
							)}

							<hr className="my-8" />

							<p className="mt-4">
								<a
									className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
									href="../ResetPassword"
								>
									¿Olvidaste tu contraseña?
								</a>
							</p>
							<p className="mt-1">
								<a
									className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
									href="../"
								>
									¿Ya tienes una cuenta? Inicia sesión
								</a>
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
