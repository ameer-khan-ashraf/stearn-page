import React from "react";
import "./navbar.css"
const Navbar = ({data})=>{
    return(
        <div className="navbar-container">
            <div className="navbar-left">
                <a>Home</a>
                <a>Lend</a>
            </div>
            <div className="navbar-right">
                <a>Buy STRN</a>
                <a className="wallet-btn">{data?"disconnect":"Connect wallet"}</a>
            </div>
        </div>
    )
}

export default Navbar