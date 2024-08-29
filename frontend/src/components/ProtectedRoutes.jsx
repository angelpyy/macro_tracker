import { Navigate, Outlet } from "react-router-dom"

const token = localStorage.getItem("token")

const ProtectedRoutes = () => {
    let isAuthenticated = token ? true : false
    return isAuthenticated ? <Outlet /> : <Navigate to="/" />
}

export default ProtectedRoutes