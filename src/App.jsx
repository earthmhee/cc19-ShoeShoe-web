
import { useState } from "react";
import { Outlet } from "react-router";
import Layout from "./layouts/Layouts";
import './App.css'
import SidebarResponsive from './components/Sidebar'
import Footer from "./components/Footer";
function App() {

	return (
		<>
			<SidebarResponsive />
			<Outlet />
			<Footer />
		</>
	);
}

export default App
