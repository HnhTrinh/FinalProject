import { Outlet } from "react-router-dom";
import AdminNavbar from "../components/AdminNavbar";

/**
 * AdminLayout component
 * Bao bọc tất cả các trang admin với AdminNavbar
 */
export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <div className="container mx-auto px-4 py-6">
        <Outlet />
      </div>
    </div>
  );
}
