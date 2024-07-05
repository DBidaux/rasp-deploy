import React from "react";
import NavBar from "../NavBar/NavBar";
import Footer from "../Footer/Footer";
import "./LandingPage.css";
import Calendario from "../Calendar/Calendario";

export default function LandingPage() {
	return (
		<div>
			<NavBar></NavBar>
			<div className="background">
				<div className="content">
					<h1 className="h1">Bienvenid@ Golf@!</h1>
					<p className="p-2">
						En ésta página puedes meter las próximas cenas/eventos
						de la cuadrilla, así como consultar los gastos/facturas
						y las diferentes compras!
					</p>
					<p className="pt-2">
						Toca el día, rellena el formulario, guarda yyy
						¡Voilá! ya tienes creado tu evento.
					</p>
					<Calendario></Calendario>
				</div>
			</div>
			<Footer></Footer>
		</div>
	);
}
