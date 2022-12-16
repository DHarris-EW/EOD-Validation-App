import { Outlet } from "react-router-dom"
import './Layout.scss';
import React from "react";

export default function Layout() {
    return(
        <main className="container justify-content-center my-auto">
            <Outlet />
        </main>
    )
}