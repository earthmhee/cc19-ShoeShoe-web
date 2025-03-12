<<<<<<< HEAD
import { useState } from "react";
import { Outlet } from "react-router";
import Layout from "./layouts/Layouts";
import './App.css'
import SidebarResponsive from './components/Sidebar'
function App() {

	return (
		<>
			<p className="bg-white-200">header</p>
			<Outlet />
		</>
	);
}

export default App
