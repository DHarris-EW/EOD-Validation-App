import React, { useState } from "react"
import { Link } from "react-router-dom";

import { FaBars, FaHome, FaKey, FaBook, FaAddressBook} from "react-icons/fa"

import "./Navbar.scss"
import useAuth from "../hooks/useAuth";

export default function NavbarAuthed() {
    const [sidebar, setSidebar] = useState(true)
    const { auth } = useAuth()

    function showSidebar() {
            return(setSidebar(!sidebar))
    }

    return (
        <nav className={sidebar ? "sidebar active" : "sidebar"}>
            <div className="sidebar-container">
                <li className="sidebar-header">
                    <Link to="#" onClick={showSidebar}>
                        <FaBars className="icon" size={35}/>
                    </Link>
                </li>
                <ul className={sidebar ? "sidebar-items" : "sidebar-items active"}>
                    <li className="sidebar-item">
                        <Link to="/home">
                            <FaHome className="icon" size={35}/>
                            <span className={sidebar ? "text active" : "text"}>Home</span>
                        </Link>
                    </li>
                    <li className="sidebar-item">
                        <Link to="/validation/create">
                            <FaBook className="icon" size={35}/>
                            <span className={sidebar ? "text active" : "text"}>Validation</span>
                        </Link>
                    </li>
                    <li className="sidebar-item">
                        <Link to="/validation/assess">
                            <FaBook className="icon" size={35}/>
                            <span className={sidebar ? "text active" : "text"}>Assess</span>
                        </Link>
                    </li>
                    <li className="sidebar-item">
                        <Link to={`/user/${auth.id}/portal`}>
                            <FaBook className="icon" size={35}/>
                            <span className={sidebar ? "text active" : "text"}>Portal</span>
                        </Link>
                    </li>
                    {auth.is_admin &&
                        <li className="sidebar-item">
                            <Link to="/registration">
                                <FaAddressBook className="icon" size={35}/>
                                <span className={sidebar ? "text active" : "text"}>Registration</span>
                            </Link>
                        </li>
                    }
                    <li className="sidebar-item bottom">
                        <Link to="/logout">
                            <FaKey className="icon" size={35}/>
                            <span className={sidebar ? "text active" : "text"}>Log out</span>
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    )
}


