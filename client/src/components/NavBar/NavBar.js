import React from "react";
import { useUser, UserProvider } from "../../context/UserContext";
import "./NavBar.css";

function NavBarContent() {
	const { user } = useUser();

	return (
		<nav className="navbar navbar-dark bg-dark">
			<div className="container-fluid">
				{/* Menú hamburguesa */}
				<button
					className="navbar-toggler collapsed"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#navbarsExample02"
					aria-controls="navbarsExample02"
					aria-expanded="false"
					aria-label="Toggle navigation"
				>
					<span className="navbar-toggler-icon"></span>
				</button>

				<a className="navbar-brand" href="/LandingPage">
					Les Golfes Returns!
				</a>
				<a href="/profile">
					<img
						className="rounded"
						src={user.profileImage}
						alt="Perfil"
					/>
				</a>

				{/* Contenido menú hamburguesa */}
				<div className="collapse navbar-collapse" id="navbarsExample02">
					<ul className="navbar-nav me-auto mb-2 mb-lg-0">
						<li className="nav-item dropdown">
							<a
								className="nav-link dropdown-toggle"
								href="#"
								data-bs-toggle="dropdown"
								aria-expanded="false"
							>
								A pagar, a pagarrr!
							</a>
							<ul className="dropdown-menu">
								<li>
									<a
										className="dropdown-item"
										href="/ShoppingList"
									>
										Lista de la compra actuales/pendientes
									</a>
								</li>
								<li>
									<a
										className="dropdown-item"
										href="/Bills"
									>
										Estado cuenta y facturas
									</a>
								</li>
								<li>
									<a
										className="dropdown-item"
										href="/ShoppingList/inactive"
									>
										Listas de la compra archivadas
									</a>
								</li>
								<li>
									<a
										className="dropdown-item"
										href="/ShoppingList/history"
									>
										Historial de listas
									</a>
								</li>
							</ul>
						</li>
						<li className="nav-item">
							<a className="nav-link" href="/Fiestas">
								FIESTAS!
							</a>
						</li>
						<li className="nav-item">
							<a
								className="nav-link"
								onClick={() => localStorage.clear()}
								href="/"
							>
								Cerrar sesión
							</a>
						</li>
					</ul>
				</div>
			</div>
		</nav>
	);
}

export default function NavBar() {
	return (
		<UserProvider>
			<NavBarContent />
		</UserProvider>
	);
}
