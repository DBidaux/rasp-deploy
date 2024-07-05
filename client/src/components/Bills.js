import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import NavBar from "./NavBar/NavBar";
import Footer from "./Footer/Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import API_URL from "../setttings.js";

export default function BillCard() {
	const [account, setAccount] = useState("");
	const [bills, setBills] = useState([]);
	const [archived, setArchived] = useState(false);
	const [showErrorModal, setShowErrorModal] = useState(false);
	const [currentBill, setCurrentBill] = useState(null);
	const [modalPosition, setModalPosition] = useState({
		top: 0,
		left: 0,
		width: 0,
		height: 0,
	});

	const billRefs = useRef([]);

	useEffect(() => {
		const accountStatus = async () => {
			try {
				const response = await axios.get(
					`${API_URL}/account/getstatus`
				);
				setAccount(response.data.accountFunds);
			} catch (error) {
				console.error("Error fetching status of account: ", error);
			}
		};
		accountStatus();
	}, [archived]);

	useEffect(() => {
		const fetchBills = async () => {
			try {
				const response = await axios.get(
					`${API_URL}/bills/fetch`
				);
				setBills(response.data);
				billRefs.current = response.data.map(() => React.createRef());
			} catch (error) {
				console.error("Error fetching bills:", error);
			}
		};

		fetchBills();
	}, [archived]);

	const handleArchive = async (billId, billAmount, index) => {
		const rect = billRefs.current[index].current.getBoundingClientRect();
		if (parseFloat(account) < billAmount) {
			// Asegúrate de comparar como números
			setCurrentBill(billRefs.current[index]);
			setModalPosition({
				top: rect.top + window.scrollY,
				left: rect.left + window.scrollX,
				width: rect.width,
				height: rect.height,
			});
			setShowErrorModal(true);
			return;
		}

		try {
			await axios.patch(`${API_URL}/bills/archive`, {
				id: billId,
			});
			setArchived(!archived); // Toggle to refresh the list
			// Update account state and limit decimals
			setAccount((prevAccount) =>
				(parseFloat(prevAccount) - billAmount).toFixed(2)
			);
		} catch (error) {
			console.error("Error archiving bill:", error);
		}
	};

	const handleCloseErrorModal = () => {
		setShowErrorModal(false);
		setCurrentBill(null);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await axios.post(`${API_URL}/account/postfunds`, {
				accountFunds: parseFloat(account).toFixed(2), // Asegúrate de enviar el campo correcto y como número
				createdAt: new Date(),
			});
			// Close the modal after submission
			const modal = document.getElementById("bankAccountModal");
			const bootstrapModal = window.bootstrap.Modal.getInstance(modal);
			if (bootstrapModal) {
				bootstrapModal.hide();
			}
			// Update the local state to reflect the new account funds
			setAccount(account);
		} catch (error) {
			console.error("Error updating account status:", error);
		}
	};

	const handleFileUpload = async (event) => {
		const file = event.target.files[0];
		const formData = new FormData();
		formData.append("file", file);

		try {
			await axios.post(`${API_URL}/bills/upload`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			alert("Factura cargada y procesada exitosamente");
			// Actualiza la lista de facturas después de cargar
			setArchived(!archived);
		} catch (error) {
			console.error("Error uploading file:", error);
			alert("Error al cargar la factura");
		}
	};

	function getMeasurement(company) {
		if (company === "MONTEJURRA") {
			return "m3";
		} else if (company === "IBERDROLA") {
			return "kWh";
		} else {
			return "";
		}
	}

	return (
		<div>
			<NavBar />
			<div className="container mt-4 min-vh-100">
				<div className="card">
					<div className="h2 mt-3 card-body">
						Cuenta: {parseFloat(account).toFixed(2)}€
					</div>
					{/* Button trigger modal */}
					<button
						type="button"
						className="btn btn-primary"
						data-bs-toggle="modal"
						data-bs-target="#bankAccountModal"
					>
						Actualizar Estado de Cuenta
					</button>
					{/* Modal */}
					<div
						className="modal fade"
						id="bankAccountModal"
						tabIndex="-1"
						aria-labelledby="exampleModalLabel"
						aria-hidden="true"
					>
						<div className="modal-dialog">
							<div className="modal-content">
								<div className="modal-header">
									<h5
										className="modal-title"
										id="exampleModalLabel"
									>
										Actualizar Estado de Cuenta
									</h5>
									<button
										type="button"
										className="btn-close"
										data-bs-dismiss="modal"
										aria-label="Close"
									></button>
								</div>
								<div className="modal-body">
									<form onSubmit={handleSubmit}>
										<div className="mb-3">
											<input
												type="text"
												className="form-control"
												placeholder="Estado de la cuenta del banco"
												value={account} // Mantenemos el valor como string en el input
												onChange={(e) =>
													setAccount(e.target.value)
												}
											/>
											<div className="h2 mt-3">
												Dinero en la cuenta:{" "}
												{parseFloat(account).toFixed(2)}
												€
											</div>
										</div>
										<button
											type="submit"
											className="btn btn-success"
										>
											Guardar
										</button>
									</form>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Modal de Error */}
				{showErrorModal && currentBill && (
					<div
						className="modal show d-block"
						style={{
							position: "absolute",
							top: modalPosition.top,
							left: modalPosition.left,
							width: modalPosition.width,
							height: modalPosition.height,
							backgroundColor: "white",
							borderRadius: "8px",
							boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
							zIndex: 1051,
						}}
					>
						<div className="modal-dialog modal-dialog-centered">
							<div className="modal-content">
								<div className="modal-header">
									<h5
										className="modal-title"
										id="errorModalLabel"
									>
										Error
									</h5>
									<button
										type="button"
										className="btn-close"
										onClick={handleCloseErrorModal}
									></button>
								</div>
								<div className="modal-body">
									Fondos insuficientes. Asegúrate de
									actualizar el estado de la cuenta, así como
									de ingresarlo!
								</div>
								<div className="modal-footer">
									<button
										type="button"
										className="btn btn-secondary"
										onClick={handleCloseErrorModal}
									>
										Cerrar
									</button>
								</div>
							</div>
						</div>
					</div>
				)}
				<div className="mt-5">
					<h2>Cargar Facturas</h2>
					<div className="input-group">
						<input
							type="file"
							className="form-control"
							id="inputGroupFile04"
							aria-describedby="inputGroupFileAddon04"
							aria-label="Subir"
							onChange={handleFileUpload}
						/>
						<button
							className="btn btn-outline-secondary"
							type="button"
							id="inputGroupFileAddon04"
						>
							Cargar
						</button>
					</div>
				</div>
				<div className="mt-3">
					<h1>Facturas por pagar:</h1>
					{bills.map((bill, index) => (
						<div
							key={bill._id}
							className="card mb-3"
							ref={billRefs.current[index]}
						>
							<div className="card-body text-bg-secondary rounded">
								<h5 className="card-title">{bill.company}</h5>
								<p className="card-text">
									<strong>Fecha de Pago:</strong>{" "}
									{bill.paymentDate}
								</p>
								<p className="card-text">
									<strong>Importe:</strong> {bill.amount} €
								</p>
								<p className="card-text">
									<strong>Consumo:</strong> {bill.consumption}{" "}
									{getMeasurement(bill.company)}
								</p>
								<button
									className="btn btn-danger"
									onClick={() =>
										handleArchive(
											bill._id,
											bill.amount,
											index
										)
									}
								>
									Pagar
								</button>
							</div>
						</div>
					))}
				</div>
			</div>
			<Footer />
		</div>
	);
}
