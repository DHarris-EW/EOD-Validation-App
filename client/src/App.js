import './App.scss';
import NavbarAuthed from "./components/navbar/NavbarAuthed"

import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/user/login";
import Logout from "./pages/user/logout";
import Registration from "./pages/user/Registration"
import Layout from "./components/Layout"
import RequireAuth from "./components/RequireAuth"
import MessageBoard from "./components/MessageBoard";

import useAuth from "./hooks/useAuth";
import ValidationCreate from "./pages/validation/ValidationCreate";
import ValidationAssess from "./pages/validation/ValidationAssess";
import useMessage from "./hooks/useMessage";
import ValidationList from "./pages/validation/ValidationList";
import Pink from "./pages/pink/Pink";
import AppNavBar from "./components/navbar/AppNavBar";
import Portal from "./pages/portal/Portal";
import PortalAdmin from "./pages/portal/PortalAdmin";

export default function App() {
    const { auth } = useAuth()
    const { message } = useMessage()

    return (
        <div className="bg-light overflow-auto vh-100">

            {auth?.roles ? <NavbarAuthed /> : <AppNavBar />}

            <div>
                {message.text && <MessageBoard/>}
                <Routes>
                    <Route path="/" element={<Layout />}>
                        {/* Public routes */}
                        <Route path="/" element={<Login />} />
                        <Route path="/login" element={<Login />} />

                        {/* Private routes */}
                        <Route element={<RequireAuth allowedRoles={["user"]} />}>
                            <Route path="/logout" element={<Logout />}/>
                            <Route path="/home" element={<Home />} />
                            <Route path="/user/:userID/portal/" element={<Portal />} />
                        </Route>

                        <Route element={<RequireAuth allowedRoles={["ds", "user"]} />}>
                            <Route path="/pink-management/validation/:title/user/:userID/:pinkType/:state" element={<Pink />} />
                            <Route path="/pink-management/pink/:pinkID/:state" element={<Pink />} />
                        </Route>

                        <Route element={<RequireAuth allowedRoles={["admin"]} />}>
                            <Route path="/registration" element={<Registration />} />
                            <Route path="/validation/create" element={<ValidationCreate />} />
                            <Route path="/validation/assess" element={<ValidationList />} />
                            <Route path="/validation/:validation_id/assess" element={<ValidationAssess />} />
                            <Route path="/user/:userID/admin-portal" element={<PortalAdmin />} />
                        </Route>

                        {/* Catch all page missing */}
                        <Route path="*" element={<Home />} />
                    </Route>
                </Routes>
            </div>
        </div>
    )

}
