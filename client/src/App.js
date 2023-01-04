import './App.scss';
import Navbar from "./components/Navbar"
import NavbarAuthed from "./components/NavbarAuthed"

import 'bootstrap/dist/css/bootstrap.min.css';
import {Route, Routes} from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import Logout from "./pages/logout";
import Registration from "./pages/Registration"
import Layout from "./components/Layout"
import RequireAuth from "./components/RequireAuth"
import MessageBoard from "./components/MessageBoard";

import useAuth from "./hooks/useAuth";
import ValidationCreate from "./pages/validation/ValidationCreate";
import ValidationAssess from "./pages/validation/ValidationAssess";
import useMessage from "./hooks/useMessage";
import ValidationList from "./pages/validation/ValidationList";
import Pink from "./pages/Pink";
import Portal from "./pages/portal";

export default function App() {
    const { auth } = useAuth()
    const { message } = useMessage()

    return (
        <div className="wrapper">

            {auth?.serviceNumber ? <NavbarAuthed /> : <Navbar />}

            <div className="main-content">
                {message.text && <MessageBoard/>}
                <Routes>
                    <Route path="/" element={<Layout />}>
                        {/* Public routes */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/logout" element={<Logout />}/>

                        {/* Private routes */}
                        <Route element={<RequireAuth allowedRoles={["user"]} />}>
                            <Route path="/home" element={<Home />} />
                            <Route path="/user/:userID/portal/" element={<Portal />} />
                        </Route>

                        <Route element={<RequireAuth allowedRoles={["ds"]} />}>
                            <Route path="/pink-management/validation/:title/user/:userID/:state" element={<Pink />} />
                            <Route path="/pink-management/pink/:pinkID/:state" element={<Pink />} />
                        </Route>

                        <Route element={<RequireAuth allowedRoles={["admin"]} />}>
                            <Route path="/registration" element={<Registration />} />
                            <Route path="/validation/create" element={<ValidationCreate />} />
                            <Route path="/validation/assess" element={<ValidationList />} />
                            <Route path="/validation/assess/:title" element={<ValidationAssess />} />
                        </Route>

                        {/* Catch all page missing */}
                        <Route path="*" element={<Home />} />
                    </Route>
                </Routes>
            </div>
        </div>
    )

}
