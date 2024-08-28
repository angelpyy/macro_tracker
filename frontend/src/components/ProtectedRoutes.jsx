import { Navigate, Outlet } from "react-router-dom"
import { token } from "./LoginPage"


const ProtectedRoutes = () => {
    let isAuthenticated = token ? true : false
    return isAuthenticated ? <Outlet /> : <Navigate to="/" />
}

export default ProtectedRoutes