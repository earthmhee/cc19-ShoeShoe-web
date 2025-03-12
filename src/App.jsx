import { useState } from "react";
import { Outlet } from "react-router";
import Layout from "./layouts/Layouts";

function App() {
	const [count, setCount] = useState(0);

	return (
		<>
			<Layout />
			{/* <Outlet /> */}

		</>
	);
}

export default App;
