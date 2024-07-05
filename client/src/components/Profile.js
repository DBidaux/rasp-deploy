import React, { useState, useEffect } from "react";
import { Modal, Button, Card } from "react-bootstrap";
import NavBar from "./NavBar/NavBar";
import API_URL from "../setttings.js";

function Profile() {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [profileImage, setProfileImage] = useState(null);
	const [imageUrl, setImageUrl] = useState("");
	const [showModal, setShowModal] = useState(false);

	useEffect(() => {
		const fetchUserProfile = async () => {
			try {
				const response = await fetch(`${API_URL}/profile`, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem(
							"token"
						)}`,
					},
				});
				if (response.ok) {
					const data = await response.json();
					setUsername(data.username);
					setEmail(data.email);
					setPhone(data.phone);
					setImageUrl(`${API_URL}/uploads/${data.profileImage}`);
				} else {
					console.error("Error al obtener el perfil del usuario");
				}
			} catch (error) {
				console.error("Error:", error);
			}
		};

		fetchUserProfile();
	}, []);

	const handleImageUpload = (e) => {
		const file = e.target.files[0];
		setProfileImage(file);

		const reader = new FileReader();
		reader.onloadend = () => {
			setImageUrl(reader.result);
		};
		reader.readAsDataURL(file);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const formData = new FormData();
		formData.append("username", username);
		formData.append("email", email);
		formData.append("phone", phone);
		if (profileImage) {
			formData.append("profileImage", profileImage);
		}

		try {
			const response = await fetch(`${API_URL}/profile/update`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
				body: formData,
			});

			if (response.ok) {
				console.log("Perfil actualizado correctamente");
			} else {
				console.error("Error al actualizar el perfil");
			}
		} catch (error) {
			console.error("Error:", error);
		}

		setShowModal(false); // Cerrar el modal después de guardar
	};

	return (
		<div>
			<NavBar />
			<div className="container">
				<h2 className="p-2">Perfil de Usuario</h2>
				<Card className="mt-3 text-bg-secondary rounded">
					<Card.Img
						className="card "
						variant="top"
						src={imageUrl}
						alt="Profile"
					/>
					<Card.Body>
						<Card.Title>{username}</Card.Title>
						<Card.Text>
							<p>Email: {email}</p>
							<p>Phone: {phone}</p>
						</Card.Text>
						<Button
							variant="primary"
							onClick={() => setShowModal(true)}
						>
							Editar Perfil
						</Button>
					</Card.Body>
				</Card>
				<Modal show={showModal} onHide={() => setShowModal(false)}>
					<Modal.Header closeButton>
						<Modal.Title>Editar Perfil</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<form onSubmit={handleSubmit}>
							<div className="form-group">
								<label htmlFor="username">
									Nombre de usuario:
								</label>
								<input
									type="text"
									id="username"
									className="form-control"
									value={username}
									onChange={(e) =>
										setUsername(e.target.value)
									}
								/>
							</div>
							<div className="form-group">
								<label htmlFor="email">
									Correo Electrónico:
								</label>
								<input
									type="email"
									id="email"
									className="form-control"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								/>
							</div>
							<div className="form-group">
								<label htmlFor="phone">Teléfono:</label>
								<input
									type="text"
									id="phone"
									className="form-control"
									value={phone}
									onChange={(e) => setPhone(e.target.value)}
								/>
							</div>
							<div className="form-group">
								<label htmlFor="profileImage">
									Foto de Perfil:
								</label>
								<input
									type="file"
									id="profileImage"
									className="form-control-file"
									onChange={handleImageUpload}
								/>
							</div>
							{imageUrl && (
								<div className="form-group">
									<img
										src={imageUrl}
										alt="Profile"
										className="img-thumbnail"
									/>
								</div>
							)}
							<Button variant="primary" type="submit">
								Guardar
							</Button>
						</form>
					</Modal.Body>
				</Modal>
			</div>
		</div>
	);
}

export default Profile;
