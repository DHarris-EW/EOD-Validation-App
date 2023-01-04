import { useLocation, Navigate, Outlet } from "react-router-dom"
import useAuth from "../hooks/useAuth";

export default function RequireAuth({ allowedRoles }) {

    const { auth } = useAuth()
    const location = useLocation()


    return (
        auth?.roles?.find(role => allowedRoles?.includes(role)) ? <Outlet /> : <Navigate to="/Login" state={{ from: location }} replace />
    )
}
