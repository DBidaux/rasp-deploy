const transporter = require("./mailer");

const sendEmailToAdmins = async (admins, newUser) => {
	const mailOptions = {
		from: process.env.EMAIL_USER,
		subject: "Nuevo usuario registrado",
		html: `
			<p>Un nuevo usuario se ha registrado y necesita aprobación.</p>
			<p>Detalles del usuario:</p>
			<ul>
				<li>Nombre: ${newUser.username}</li>
				<li>Email: ${newUser.email}</li>
			</ul>
			<p><a href=${process.env.CLIENT_URL}/approveuser>Aprobar usuario</a></p>
		`,
	};

	console.log(admins);
	console.log(newUser);

	for (const admin of admins) {
		mailOptions.to = admin.email;
		await transporter.sendMail(mailOptions);
	}
};

module.exports = sendEmailToAdmins;
