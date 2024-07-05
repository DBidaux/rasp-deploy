import React, { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "../NavBar/NavBar";
import "bootstrap/dist/css/bootstrap.min.css";
import API_URL from "../../setttings";

export default function History() {
	const [listas, setListas] = useState([]);
	const [searchDate, setSearchDate] = useState("");

	const fetchHistory = async () => {
		try {
			const response = await axios.get(`${API_URL}/shoppinglist/history`);
			setListas(response.data);
		} catch (error) {
			console.error("Error al obtener el historial de listas:", error);
		}
	};

	useEffect(() => {
		fetchHistory();
	}, []);

	const handleSearch = (event) => {
		setSearchDate(event.target.value);
	};

	const filteredListas = listas.filter((lista) => {
		if (!searchDate) return true;
		const deactivatedAt = new Date(lista.deactivatedAt);
		const formattedDate = deactivatedAt.toISOString().split("T")[0];
		return formattedDate === searchDate;
	});

	return (
		<div>
			<NavBar />
			<div className="container mt-4 min-vh-100">
				<h3 className="mt-4">Historial de Listas de Compra</h3>
				<input
					type="date"
					className="form-control mb-3"
					value={searchDate}
					onChange={handleSearch}
				/>
				{filteredListas.map((lista, index) => (
					<div key={index} className="card m-3">
						<div className="card-body text-bg-secondary rounded">
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
							<p className="card-text mb-2">
								Desactivada el:{" "}
								{new Date(
									lista.deactivatedAt
								).toLocaleDateString()}
							</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
