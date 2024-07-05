import React, { createContext, useContext, useState, useEffect } from "react";
import API_URL from "../setttings.js";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
	const [user, setUser] = useState({
		username: "",
		email: "",
		phone: "",
		profileImage: "",
	});

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
					setUser({
						username: data.username,
						email: data.email,
						phone: data.phone,
						profileImage: `${API_URL}/uploads/${data.profileImage}`,
					});
				} else {
					console.error("Error al obtener el perfil del usuario");
				}
			} catch (error) {
				console.error("Error:", error);
			}
		};

		fetchUserProfile();
	}, []);

	return (
		<UserContext.Provider value={{ user, setUser }}>
			{children}
		</UserContext.Provider>
	);
};
