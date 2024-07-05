import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import NavBar from "../NavBar/NavBar";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "../Footer/Footer";
import API_URL from "../../setttings";

export default function ShoppingList() {
	const [modalOpen, setModalOpen] = useState(false);
	const [confirmModal, setConfirmModal] = useState(false);
	const [warningModal, setWarningModal] = useState(false);
	const [selectedList, setSelectedList] = useState(null);
	const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
	const [warningPosition, setWarningPosition] = useState({ top: 0, left: 0 });
	const [nombreLista, setNombreLista] = useState("");
	const [numeroPersonas, setNumeroPersonas] = useState("");
	const [numeroPersonasError, setNumeroPersonasError] = useState("");
	const [persona, setPersona] = useState("");
	const [products, setProducts] = useState([]);
	const [productNombre, setProductNombre] = useState("");
	const [productPrecio, setProductPrecio] = useState("");
	const [productCantidad, setProductCantidad] = useState("");
	const [listaCompras, setListaCompras] = useState([]);
	const [userRole, setUserRole] = useState(""); // Definir userRole

	const userID = localStorage.getItem("userID");
	const token = localStorage.getItem("token");
	const username = localStorage.getItem("username");

	const refs = useRef([]);

	const fetchData = async () => {
		try {
			const response = await axios.get(`${API_URL}/shoppinglist`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			setListaCompras(response.data.lists);
			setUserRole(response.data.role); // Establecer el rol del usuario
			refs.current = response.data.lists.map(
				(_, i) => refs.current[i] || React.createRef()
			);
		} catch (error) {
			console.error("Error al obtener las listas de compras:", error);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	const handleOpenModal = () => {
		setModalOpen(true);
	};

	const handleCloseModal = () => {
		setModalOpen(false);
		setNombreLista("");
		setNumeroPersonas("");
		setNumeroPersonasError("");
		setPersona("");
		setProducts([]);
		setProductNombre("");
		setProductPrecio("");
		setProductCantidad("");
	};

	const handleGuardarLista = async () => {
		if (!userID || !token) {
			console.error("UserID o token no encontrado");
			return;
		}
		if (isNaN(numeroPersonas) || numeroPersonas <= 0) {
			setNumeroPersonasError(
				"El número de personas debe ser un valor numérico positivo"
			);
			return;
		}
		const totalGastado = products.reduce(
			(acc, producto) =>
				acc +
				parseFloat(producto.precio) * parseInt(producto.cantidad, 10),
			0
		);
		const nuevaLista = {
			nombreLista: nombreLista,
			numeroPersonas: numeroPersonas,
			persona: username,
			products: products,
			totalGastado: totalGastado,
			totalPorPersona: totalGastado / numeroPersonas,
			creatorID: userID,
			active: true,
		};

		try {
			const response = await axios.post(
				`${API_URL}/shoppinglist/newlist`,
				nuevaLista,
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			setListaCompras([...listaCompras, response.data]);
			refs.current.push(React.createRef());
			console.log("Lista de Compra guardada:", response.data);
		} catch (error) {
			console.error("Error al guardar la lista de la compra: ", error);
		}
		console.log(nuevaLista);

		handleCloseModal();
	};

	const handleAgregarProducto = () => {
		if (
			productNombre.trim() !== "" &&
			!isNaN(parseFloat(productPrecio)) &&
			!isNaN(parseInt(productCantidad, 10))
		) {
			setProducts([
				...products,
				{
					nombre: productNombre,
					precio: parseFloat(productPrecio),
					cantidad: parseInt(productCantidad, 10),
				},
			]);
			setProductNombre("");
			setProductPrecio("");
			setProductCantidad("");
		} else {
			alert(
				"Por favor, introduce un nombre de producto, un precio y una cantidad válidos."
			);
		}
	};

	const handleDeactivate = (id, index) => {
		const selectedList = listaCompras.find((lista) => lista._id === id);
		if (!selectedList || !token) return;

		// Mostrar advertencia si el usuario no es ADMIN y no es el creador
		if (selectedList.creatorID !== userID && userRole !== "ADMIN") {
			if (refs.current[index] && refs.current[index].current) {
				const cardPosition =
					refs.current[index].current.getBoundingClientRect();
				setWarningPosition({
					top: cardPosition.top + window.scrollY,
					left: cardPosition.left + window.scrollX,
					width: cardPosition.width,
					height: cardPosition.height,
				});
				setWarningModal(true);
			}
			return;
		}

		if (refs.current[index] && refs.current[index].current) {
			const cardPosition =
				refs.current[index].current.getBoundingClientRect();
			setModalPosition({
				top: cardPosition.top + window.scrollY,
				left: cardPosition.left + window.scrollX,
				width: cardPosition.width,
				height: cardPosition.height,
			});
			setSelectedList(id);
			setConfirmModal(true);
		} else {
			console.log("ref not defined");
		}
	};

	const confirmDeactivate = async () => {
		if (!token) return;
		try {
			await axios.patch(
				`${API_URL}/shoppinglist/${selectedList}/active`,
				{ userID }, // Enviar userID en el cuerpo de la solicitud
				{ headers: { Authorization: `Bearer ${token}` } }
			);
			setConfirmModal(false);
			setSelectedList(null);
			fetchData();
		} catch (error) {
			console.error("Error al cambiar el estado de la lista: ", error);
		}
	};

	const cancelDeactivate = () => {
		setConfirmModal(false);
		setSelectedList(null);
	};

	const closeWarningModal = () => {
		setWarningModal(false);
	};

	return (
		<div>
			<NavBar />
			<div className="container mt-4 min-vh-100">
				<button className="btn btn-primary" onClick={handleOpenModal}>
					Crear Nueva Lista de Compra
				</button>
				{modalOpen && (
					<div className="mt-4">
						<div className="card">
							<div className="card-header d-flex justify-content-between align-items-center">
								<h5 className="mb-0">
									Crear Nueva Lista de Compra
								</h5>
								<button
									type="button"
									className="btn-close"
									onClick={handleCloseModal}
								></button>
							</div>
							<div className="card-body">
								<label>Nombre de la lista de compra:</label>
								<input
									type="text"
									className="form-control mb-2"
									value={nombreLista}
									onChange={(e) =>
										setNombreLista(e.target.value)
									}
								/>

								<label>Número de personas:</label>
								<input
									type="text"
									className={`form-control mb-2 ${
										numeroPersonasError ? "is-invalid" : ""
									}`}
									value={numeroPersonas}
									onChange={(e) => {
										setNumeroPersonas(e.target.value);
										setNumeroPersonasError("");
									}}
								/>
								{numeroPersonasError && (
									<div className="invalid-feedback">
										{numeroPersonasError}
									</div>
								)}
								<label>Productos comprados:</label>
								<ul className="list-unstyled">
									{products.map((product, index) => (
										<li key={index} className="mb-2">
											{product.nombre} - {product.precio}€
											x {product.cantidad}
										</li>
									))}
									<li>
										<div className="form-group mb-1">
											<input
												type="text"
												className="form-control"
												placeholder="Nombre del Producto"
												value={productNombre}
												onChange={(e) =>
													setProductNombre(
														e.target.value
													)
												}
											/>
										</div>
										<div className="form-group mb-1">
											<input
												type="text"
												className="form-control"
												placeholder="Precio"
												value={productPrecio}
												onChange={(e) =>
													setProductPrecio(
														e.target.value
													)
												}
											/>
										</div>
										<div className="form-group mb-1">
											<input
												type="text"
												className="form-control"
												placeholder="Cantidad"
												value={productCantidad}
												onChange={(e) =>
													setProductCantidad(
														e.target.value
													)
												}
											/>
										</div>
										<button
											className="btn btn-secondary mb-2"
											onClick={handleAgregarProducto}
										>
											Añadir Producto
										</button>
									</li>
								</ul>
							</div>
							<div className="card-footer d-flex justify-content-between">
								<button
									className="btn btn-success"
									onClick={handleGuardarLista}
								>
									Guardar Lista de Compra
								</button>
								<button
									className="btn btn-danger"
									onClick={handleCloseModal}
								>
									Cancelar
								</button>
							</div>
						</div>
					</div>
				)}
				<h3 className="mt-4">Listas de Compra:</h3>
				{listaCompras.map((lista, index) => (
					<div
						key={index}
						ref={refs.current[index]}
						className="card m-3"
						style={{ position: "relative" }}
					>
						<div className="card-body text-bg-secondary rounded ">
							<h2 className="h2 card-title pt-2">
								Nombre de la lista: {lista.nombreLista}
							</h2>
							<div className="card-subtitle p-2">
								Persona: {lista.persona}
							</div>
							<div className="card-subtitle p-2">
								Número de personas: {lista.numeroPersonas}
							</div>
							<ul className="list-unstyled">
								{lista.products &&
									lista.products.map((product, i) => (
										<li key={i} className="p-1">
											{product.nombre} - {product.precio}€
											x {product.cantidad}
										</li>
									))}
							</ul>
							<p className="card-text p-2">
								Total Gastado: {lista.totalGastado}€
							</p>
							<p className="card-text mb-2">
								Total por Persona:{" "}
								{lista.totalPorPersona?.toFixed(2)}€
							</p>
							<button
								className="btn btn-danger"
								onClick={() =>
									handleDeactivate(lista._id, index)
								}
							>
								{lista.active ? "Ocultar" : "Mostrar"}
							</button>
						</div>
					</div>
				))}

				{confirmModal && (
					<div
						className="modal show d-block"
						style={{
							position: "absolute",
							top: modalPosition.top,
							left: modalPosition.left,
							width: modalPosition.width,
							height: modalPosition.height,
							transform: "translate(0%, 0%)",
							backgroundColor: "white",
							padding: "1em",
							borderRadius: "8px",
							boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
						}}
					>
						<div className="modal-dialog">
							<div className="modal-content">
								<div className="modal-header">
									<h5 className="modal-title">
										Confirmar Archivado
									</h5>
									<button
										type="button"
										className="btn-close"
										onClick={cancelDeactivate}
									></button>
								</div>
								<div className="modal-body">
									<p>
										¿Estás seguro de que deseas archivar
										esta lista de compras? ¿Han pagado
										todos?
									</p>
								</div>
								<div className="modal-footer justify-content-around">
									<button
										className="btn btn-secondary"
										onClick={cancelDeactivate}
									>
										Cancelar
									</button>
									<button
										className="btn btn-danger"
										onClick={confirmDeactivate}
									>
										Archivar
									</button>
								</div>
							</div>
						</div>
					</div>
				)}

				{warningModal && (
					<div
						className="modal show d-block"
						style={{
							position: "absolute",
							top: warningPosition.top,
							left: warningPosition.left,
							width: warningPosition.width,
							height: warningPosition.height,
							transform: "translate(0%, 0%)",
							backgroundColor: "white",
							padding: "1em",
							borderRadius: "8px",
							boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
						}}
					>
						<div className="modal-dialog">
							<div className="modal-content">
								<div className="modal-header">
									<h5 className="modal-title">Advertencia</h5>
									<button
										type="button"
										className="btn-close"
										onClick={closeWarningModal}
									></button>
								</div>
								<div className="modal-body">
									<p>
										Solo el creador o un administrador puede
										archivar esta lista.
									</p>
								</div>
								<div className="modal-footer justify-content-around">
									<button
										className="btn btn-secondary"
										onClick={closeWarningModal}
									>
										Cerrar
									</button>
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
			<Footer></Footer>
		</div>
	);
}
