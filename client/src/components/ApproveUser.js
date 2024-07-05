import React, { useState } from "react";
import NavBar from "./NavBar/NavBar.js";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_URL from "../setttings.js";

export default function ApproveUser() {
	const navigate = useNavigate()
	const [username, setUsername] = useState("");
	const [message, setMessage] = useState("");

	const handleInputChange = (e) => {
		setUsername(e.target.value);
	};

	const handleApprove = async () => {
		try {
			const response = await axios.post(
				`${API_URL}/approve`,
				{ username }
			);
			if (response.data.ok) {
				setMessage(`User ${username} has been approved and notified!`);
				setTimeout(() => {
					navigate("/");
				}, 5000);
			} else {
				setMessage(`Error: ${response.data.error}`);
			}
		} catch (error) {
			setMessage(
				`Error: ${
					error.response ? error.response.data.error : error.message
				}`
			);
		}
	};

	return (
		<div>
			<NavBar />
			<div className="card mt-5">
				<div className="card-body">
					<h2 className="card-title">Approve User</h2>
					<div className="form-group">
						<input
							type="text"
							className="form-control"
							placeholder="Username"
							value={username}
							onChange={handleInputChange}
						/>
					</div>
					<button
						className="btn btn-primary mt-3"
						onClick={handleApprove}
					>
						Approve
					</button>
					{message && (
						<p
							className={`mt-3 alert ${
								message.includes("Error")
									? "alert-danger"
									: "alert-success"
							}`}
						>
							{message}
						</p>
					)}
				</div>
			</div>
		</div>
	);
}
