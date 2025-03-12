
import { useState } from "react";
import { Outlet } from "react-router";
import Layout from "./layouts/Layouts";
import './App.css'
import SidebarResponsive from './components/Sidebar'
function App() {

	return (
		<>
			<SidebarResponsive />
			<Outlet />
		</>
	);
}

export default App
