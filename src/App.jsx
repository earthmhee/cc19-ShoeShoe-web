<<<<<<< HEAD
import { useState } from "react";
import { Outlet } from "react-router";
import Layout from "./layouts/Layouts";

function App() {
	const [count, setCount] = useState(0);

	return (
		<>
			<Layout />
			 <Outlet />

		</>
	);
=======
import { Outlet } from "react-router";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import "./App.css";

function App() {
  return (
    <>
      {/* replace header with component later */}
      <header>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>
      {/* replace header with component later */}
      <p className="bg-white-200">header</p>
			<Outlet />
    </>
  );
>>>>>>> dev
}

export default App
