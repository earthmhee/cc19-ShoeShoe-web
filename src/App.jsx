import { Outlet } from "react-router";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import "./App.css";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail"
import CheckoutCardMockup from "./pages/Checkoutmockup";

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
			{/* <Outlet /> */}
      <ProductDetail />
    </>
  );
}

export default App