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
}