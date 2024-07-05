import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Payments({ listaCompras }) {
	const [modalOpen, setModalOpen] = useState(false);
	const [personas, setPersonas] = useState([]);
	const [nuevaPersona, setNuevaPersona] = useState("");
	const [pagos, setPagos] = useState([]);

	const handleOpenModal = () => {
		setModalOpen(true);
		calcularPagos();
	};

	const handleCloseModal = () => {
		setModalOpen(false);
		setPersonas([]);
		setPagos([]);
	};

	const handleAgregarPersona = () => {
		if (nuevaPersona.trim() !== "") {
			setPersonas([...personas, nuevaPersona]);
			setNuevaPersona("");
		}
	};

	const calcularPagos = () => {
		const totalGastado = listaCompras.reduce(
			(acc, lista) => acc + lista.totalGastado,
			0
		);
		const totalPorPersona = totalGastado / personas.length;
		const pagosCalculados = personas.map((persona) => ({
			nombre: persona,
			debePagar: totalPorPersona,
		}));
		setPagos(pagosCalculados);
	};

	return (
		<div>
			<div className="container mt-3">
				<h3 className="mb-3">Pagos:</h3>
				<button
					className="btn btn-primary mb-3"
					onClick={handleOpenModal}
				>
					Calcular Pagos
				</button>
			</div>
			{modalOpen && (
				<div className="card mt-4">
					<div className="card-body">
						<h5 className="card-title">Pagos</h5>
						<button
							type="button"
							className="btn-close float-end"
							aria-label="Close"
							onClick={handleCloseModal}
						></button>
						<div className="mt-3">
							<div className="form-group">
								<label>Nombre de la persona:</label>
								<input
									type="text"
									className="form-control"
									value={nuevaPersona}
									onChange={(e) =>
										setNuevaPersona(e.target.value)
									}
								/>
								<button
									className="btn btn-secondary mt-2"
									onClick={handleAgregarPersona}
								>
									Añadir Persona
								</button>
							</div>
							<div className="mt-4">
								<button
									className="btn btn-success"
									onClick={calcularPagos}
								>
									Calcular
								</button>
							</div>
							<div className="mt-4">
								<ol className="list-group list-group-numbered">
									{pagos.map((pago, index) => (
										<li
											key={index}
											className="list-group-item"
										>
											{pago.nombre} debe pagar $
											{pago.debePagar.toFixed(2)}
										</li>
									))}
								</ol>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
