import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // check localstorage on first load
    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");

        if (token) {
            setUser({ token, role });
        }
    }, []);

    // Login function
    const login = (token, role) => {
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        setUser({ token, role });
    }

    // LogOut function
    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;
export const useAuth = () => useContext(AuthContext);