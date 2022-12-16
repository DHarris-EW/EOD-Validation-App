import React, { useState } from "react"
import { Link } from "react-router-dom";

import { FaBars, FaHome, FaUser } from "react-icons/fa"

import "./Navbar.scss"

export default function Navbar() {
    const [sidebar, setSidebar] = useState(true)

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
                        <Link to="/Home">
                            <FaHome className="icon" size={35}/>
                            <span className={sidebar ? "text active" : "text"}>Home</span>
                        </Link>
                    </li>
                    <li className="sidebar-item">
                        <Link to="/login">
                            <FaUser className="icon" size={35}/>
                            <span className={sidebar ? "text active" : "text"}>Login</span>
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    )
}
