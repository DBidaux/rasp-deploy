import React from "react";
import { FaTwitter, FaInstagram, FaGithub } from "react-icons/fa";

const actualYear = new Date().getFullYear();

export default function Footer() {
	return (
		<div>
			<footer className="d-flex flex-wrap justify-content-between align-items-center py-3 border-top bg-dark sticky-bottom">
				<p className="col-md-4 mb-0 text-light">
					© {actualYear} DB Dev Design
				</p>
				<>
					<img
						src="logo.png"
						alt="Logo"
						width="40"
						height="40"
						className="me-4"
					/>
				</>
				<ul className="nav col-md-4 justify-content-end">
					<li className="nav-item">
						<a
							href="https://github.com/DBidaux"
							target="_blank"
							className="nav-link px-2 text-light"
						>
							<FaGithub size={24} />
						</a>
					</li>
					<li className="nav-item">
						<a
							href="https://twitter.com/bidaux10"
							target="_blank"
							className="nav-link px-2 text-light"
						>
							<FaTwitter size={24} />
						</a>
					</li>
					<li className="nav-item">
						<a
							href="https://www.instagram.com/d.bidaux/"
							target="_blank"
							className="nav-link px-2 text-light"
						>
							<FaInstagram size={24} />
						</a>
					</li>
				</ul>
			</footer>
		</div>
	);
}
