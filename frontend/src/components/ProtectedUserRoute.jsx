import { Navigate } from "react-router-dom";

const ProtectedUserRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token) {
        return < Navigate to="/" replace />
    }
    if (role !== "user") {
        return <Navigate to="/" replace />
    }
    return (
        <>
            {children}
        </>
    );
}

export default ProtectedUserRoute;