import { Navigate } from "react-router-dom";

const ProtectedAdminRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
        return <Navigate to="/" replace />
    }

    if (role !== "Admin") {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default ProtectedAdminRoute;