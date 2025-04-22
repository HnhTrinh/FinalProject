import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../modules/footer";

export default function DefaultLayout() {
  return <div className="h-screen">
    <NavBar />
    <Outlet />
    <Footer />
  </div>
}