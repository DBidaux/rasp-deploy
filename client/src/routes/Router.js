import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../components/Login/Login";
import ResetPassword from "../components/ResetPassword/ResetPassword";
import NewAccount from "../components/NewAccount/NewAccount";
import LandingPage from "../components/LandingPage/LandingPage";
import Fiestas from "../components/Fiestas";
import ProtectedRoute from "../components/ProtectComponent/Protected.js";
import ShoppingListHistory from "../components/ShoppingList/ShoppingListHistory.js";
import ShoppingListInactives from "../components/ShoppingList/ShoppingListInactives.js";
import ShoppingList from "../components//ShoppingList/ShoppingList";
import NewPassword from "../components/NewPassword/NewPassword.js";
import Profile from "../components/Profile";
import ApproveUser from "../components/ApproveUser";
import Bills from "../components/Bills";

export default function PageRouter() {
	return (
		<Router>
			<Routes>
				<Route exact path="/" element={<Login />}></Route>
				<Route path="/Register" element={<NewAccount />}></Route>
				<Route
					path="/resetpassword"
					element={<ResetPassword />}
				></Route>
				<Route
					path="/newpassword/:token"
					element={<NewPassword />}
				></Route>
				<Route
					path="/LandingPage"
					element={
						<ProtectedRoute>
							<LandingPage />
						</ProtectedRoute>
					}
				></Route>
				<Route
					path="/ShoppingList"
					element={
						<ProtectedRoute>
							<ShoppingList />
						</ProtectedRoute>
					}
				></Route>
				<Route
					path="/Bills"
					element={
						<ProtectedRoute>
							<Bills />
						</ProtectedRoute>
					}
				></Route>
				<Route
					path="/ShoppingList/inactive"
					element={
						<ProtectedRoute>
							<ShoppingListInactives />
						</ProtectedRoute>
					}
				></Route>
				<Route
					path="/ShoppingList/history"
					element={
						<ProtectedRoute>
							<ShoppingListHistory />
						</ProtectedRoute>
					}
				></Route>
				<Route
					path="/Fiestas"
					element={
						<ProtectedRoute>
							<Fiestas />
						</ProtectedRoute>
					}
				></Route>
				<Route
					path="/profile"
					element={
						<ProtectedRoute>
							<Profile/>
						</ProtectedRoute>
					}
				></Route>
					<Route
					path="/approveuser"
					element={
						<ProtectedRoute>
							<ApproveUser/>
						</ProtectedRoute>
					}
				></Route>
			</Routes>
		</Router>
	);
}
