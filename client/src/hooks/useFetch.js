import { useState } from "react";
import API_URL from "../setttings";

export const useApiRequest = () => {
	const [message, setMessage] = useState(null);

	const sendRequest = async ({ url, method = "POST", body = null }) => {
		setMessage(null);
		try {
			const response = await fetch(
				`${API_URL}/${url}`, // URL base en settings, subcarpetas en un url
				{
					method, // POST por defect
					headers: { "Content-Type": "application/json" },
					body: body ? JSON.stringify(body) : null, //si pasas body lo parsea a JSON, si no null
				}
			);
			const data = await response.text();

			if (response.ok) {
				setMessage({
					type: "success",
					text: data.message || "Petición exitosa",
				});
			} else {
				setMessage({
					type: "error",
					text: data.error || `Error: ${data.error}`,
				});
			}
		} catch (error) {
			setMessage({ type: "error", text: `Error: ${error.message}` });
		}
	};

	return { message, sendRequest };
};
