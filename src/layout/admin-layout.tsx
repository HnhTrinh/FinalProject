import { Outlet } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";
import Footer from "./footer";

/**
 * AdminLayout component
 * Bao bọc tất cả các trang admin với AdminNavbar
 */
export default function AdminLayout() {
  return <div className="h-screen">
  <AdminNavbar />
  <Outlet />
  <Footer />
  </div>
}


