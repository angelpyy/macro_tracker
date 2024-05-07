import { Navigate, Outlet } from "react-router-dom"
import { token } from "./LoginPage"
import LoginPage from "./LoginPage"


const ProtectedRoutes = () => {
    let isAuthenticated = token ? true : false
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />
}

export default ProtectedRoutes