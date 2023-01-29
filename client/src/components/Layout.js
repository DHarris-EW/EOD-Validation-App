import { Outlet } from "react-router-dom"
import React from "react";

export default function Layout() {
    return(
        <main className="container justify-content-center bg-body min-vh-100 height-max-content shadow-sm">
            <Outlet />
        </main>
    )
}