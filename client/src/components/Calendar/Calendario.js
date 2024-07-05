import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./Calendario.css"; // Solo para cambiar de color el tile highlight
import API_URL from "../../setttings";

export default function Calendario() {
	const [date, setDate] = useState(new Date());
	const [showModal, setShowModal] = useState(false);
	const [eventInfo, setEventInfo] = useState("");
	const [time, setTime] = useState("");
	const [additionalNote, setAdditionalNote] = useState("");
	const [events, setEvents] = useState([]);
	const [formatTimeError, setFormatTimeError] = useState("");
	const [viewFormat, setViewFormat] = useState("weekly");

	useEffect(() => {
		//useEffect para que se actualicen los eventos
		const fetchEvents = async () => {
			try {
				const response = await fetch(`${API_URL}/events`);
				const data = await response.json();

				const eventsWithValidDates = data.map((event) => ({
					...event,
					date: new Date(event.date),
				}));

				setEvents(eventsWithValidDates);
			} catch (error) {
				console.error("Error trayendo los eventos:", error);
			}
		};
		fetchEvents();
	}, []);

	const handleDateChange = (newDate) => {
		setDate(newDate);
		setShowModal(true);
	};

	const handleClose = () => {
		setShowModal(false);
		setEventInfo("");
		setAdditionalNote("");
		setTime("");
	};

	const isValidTime = (time) => {
		const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
		return timeRegex.test(time);
	};

	//post a base de datos
	const handleSave = async () => {
		if (!isValidTime(time)) {
			setFormatTimeError("Respeta el formato HH:MM");
		}

		const [hours, minutes] = time.split(":").map(Number); // combina fecha y hora en una variable ISO

		if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
			//comprobar hora es correcta
			setFormatTimeError("Introduce una hora válida en formato HH:MM");
			return;
		}
		const combinedDateTime = new Date(date);
		combinedDateTime.setHours(hours, minutes, 0, 0);
		const isoDateTime = combinedDateTime.toISOString();

		const newEvent = {
			date: isoDateTime, // formato ISO combinado
			eventInfo: eventInfo,
			additionalNote: additionalNote,
			time: time,
		};

		try {
			const response = await fetch(`${API_URL}/events/newevent`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(newEvent),
			});

			if (response.ok) {
				const savedEvent = await response.json();
				savedEvent.date = new Date(savedEvent.date); // comprobar validez fecha l-20
				setEvents((prevEvents) => [...prevEvents, savedEvent]);
				console.log(
					`Event info for ${date.toDateString()}: ${eventInfo}`
				);
				console.log(
					`Additional note for ${date.toDateString()}: ${additionalNote}`
				);
			} else {
				console.error("Error al guardar el evento");
			}
		} catch (error) {
			console.error("Error:", error);
		}

		setShowModal(false);
		setEventInfo("");
		setAdditionalNote("");
		setTime("");
	};

	const handleDelete = async (id) => {
		//delete de eventos
		try {
			const response = await fetch(`${API_URL}/events/${id}`, {
				method: "DELETE",
			});

			if (response.ok) {
				setEvents((prevEvents) =>
					prevEvents.filter((event) => event._id !== id)
				);
				console.log(`Event with id ${id} deleted`);
			} else {
				console.error("Error al eliminar el evento");
			}
		} catch (error) {
			console.error("Error:", error);
		}
	};

	const formatDate = (date) => {
		//formatear fecha a español
		let formattedDate = "Fecha no válida";
		if (!isNaN(date)) {
			formattedDate = new Intl.DateTimeFormat("es-ES", {
				weekday: "long",
				year: "numeric",
				month: "long",
				day: "numeric",
			}).format(date);
		}
		return formattedDate;
	};

	const tileClassName = ({ date, view }) => {
		//meter class highlight para cambiar color tile
		if (view === "month") {
			const eventDates = events.map((event) =>
				new Date(event.date).toDateString()
			);
			if (eventDates.includes(date.toDateString())) {
				return "highlight";
			}
		}
		return null;
	};

	//filtrar y ordenar los eventos, mensual o semanal
	const filterEvents = (events, viewFormat) => {
		const now = new Date();
		const today = new Date(
			now.getFullYear(),
			now.getMonth(),
			now.getDate()
		);
		today.setHours(0, 0, 0, 0);
		if (viewFormat === "weekly") {
			const startOfWeek = new Date(now);
			startOfWeek.setDate(
				now.getDate() - (now.getDay() === 0 ? 6 : now.getDay() - 1)
			);
			startOfWeek.setHours(0, 0, 0, 0); // Establecer a medianoche

			const endOfWeek = new Date(startOfWeek);
			endOfWeek.setDate(startOfWeek.getDate() + 6);
			endOfWeek.setHours(23, 59, 59, 999); // Establecer a las 23:59:59.999

			return events.filter(
				(event) => event.date >= startOfWeek && event.date <= endOfWeek
			);
		} else if (viewFormat === "monthly") {
			const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
			startOfMonth.setHours(0, 0, 0, 0); // Establecer a medianoche

			const endOfMonth = new Date(
				now.getFullYear(),
				now.getMonth() + 1,
				0
			);
			endOfMonth.setHours(23, 59, 59, 999); // Establecer a las 23:59:59.999

			return events.filter(
				(event) =>
					event.date >= startOfMonth && event.date <= endOfMonth
			);
		} else if (viewFormat === "all") {
			return events.filter((event) => new Date(event.date) > today);
		}
		return events;
	};

	const filteredEvents = filterEvents(events, viewFormat);
	const sortedEvents = filteredEvents.sort((a, b) => a.date - b.date);

	return (
		<div>
			<div className="d-flex flex-column align-items-center min-vh-100">
				<h1 className=" h2 text-center mt-4 ">Calendario</h1>
				<div>
					<Calendar
						onChange={handleDateChange}
						value={date}
						className="react-calendar"
						tileClassName={tileClassName}
					/>
				</div>
				<div className="mt-3">
					<h4 className="h4">Eventos de esta semana:</h4>
					<select
						className="form-select text-bg-secondary rounded"
						value={viewFormat}
						onChange={(e) => setViewFormat(e.target.value)}
					>
						<option value="weekly">Semanal</option>
						<option value="monthly">Mensual</option>
						<option value="all">Todos</option>
					</select>

					<ol className="p-2 card-body ">
						{sortedEvents.map((event, index) => (
							<li
								key={index}
								className="p-4 mt-3 card text-bg-secondary rounded"
							>
								<strong>{formatDate(event.date)} : </strong>
								Encargados evento: {event.eventInfo}
								{event.additionalNote && (
									<div>
										<p>Nota: {event.additionalNote}</p>
										<p>Hora: {event.time}hs</p>
									</div>
								)}
								<Button
									variant="danger"
									onClick={() => handleDelete(event._id)}
								>
									Eliminar
								</Button>
							</li>
						))}
					</ol>
				</div>

				{/* Modal */}
				<Modal show={showModal} onHide={handleClose}>
					<Modal.Header closeButton>
						<Modal.Title>Información del Evento</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<Form>
							<Form.Group controlId="eventInfo">
								<Form.Label>
									¿Qué evento hay el {formatDate(date)}?
								</Form.Label>
								<Form.Control
									type="textarea"
									placeholder="Introduce las personas"
									className="mb-2"
									value={eventInfo}
									onChange={(e) =>
										setEventInfo(e.target.value)
									}
								/>
							</Form.Group>
							<Form.Group controlId="AdditionalNote">
								<Form.Label>Nota adicional</Form.Label>
								<Form.Control
									as="textarea"
									rows={3}
									placeholder="Nota adicional"
									className="mb-2"
									value={additionalNote}
									onChange={(e) =>
										setAdditionalNote(e.target.value)
									}
								/>
							</Form.Group>
							<Form.Group controlId="Time">
								<Form.Label>Hora</Form.Label>
								<Form.Control
									type="time"
									placeholder="Hora (HH:MM)"
									value={time}
									onChange={(e) => {
										setTime(e.target.value);
										if (isValidTime(e.target.value)) {
											setFormatTimeError("");
										} else {
											setFormatTimeError(
												"Introduce una hora válida en formato HH:MM"
											);
										}
									}}
								/>
								{formatTimeError && (
									<Form.Text className="text-danger">
										{formatTimeError}
									</Form.Text>
								)}
							</Form.Group>
						</Form>
					</Modal.Body>
					<Modal.Footer>
						<Button variant="secondary" onClick={handleClose}>
							Cerrar
						</Button>
						<Button variant="primary" onClick={handleSave}>
							Guardar cambios
						</Button>
					</Modal.Footer>
				</Modal>
			</div>
		</div>
	);
}
