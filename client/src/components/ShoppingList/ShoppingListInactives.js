import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import NavBar from "../NavBar/NavBar";
import Footer from "../Footer/Footer";
import API_URL from "../../setttings";

export default function InactiveLists() {
	const [inactiveLists, setInactiveLists] = useState([]);
	const refs = useRef([]);

	useEffect(() => {
		const fetchInactiveLists = async () => {
			try {
				const response = await axios.get(
					`${API_URL}/shoppinglist/inactive`
				);
				setInactiveLists(response.data);
				refs.current = response.data.map(
					(_, i) => refs.current[i] || React.createRef()
				);
			} catch (error) {
				console.error("Error al obtener las listas inactivas:", error);
			}
		};

		fetchInactiveLists();
	}, []);

	return (
		<div>
			<NavBar></NavBar>
			<div className="container mt-4 min-vh-100">
				<h2>Listas de Compra Pagadas</h2>
				<h6>
					Recordad que solo aparecen aquí las de los últimos 6 meses.
					Si queréis consultar listas más antiguas, dirigíos al
					histórico de listas.
				</h6>
				{inactiveLists.map((lista, index) => (
					<div
						key={index}
						ref={refs.current[index]}
						className="card m-3"
						style={{ position: "relative" }}
					>
						<div className="card-body text-bg-secondary rounded">
							<h2 className="h4 card-title pt-2">
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
						</div>
					</div>
				))}
			</div>
			<Footer></Footer>
		</div>
	);
}
