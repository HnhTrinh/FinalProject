import { Outlet } from "react-router-dom";
import Navbar from "../modules/nav-bar";
import Footer from "../modules/footer";

export default function DefaultLayout() {
  return <div className="h-screen">
    <Navbar />
    <Outlet />
    <Footer />
  </div>
}