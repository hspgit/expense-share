import React, {useEffect, useState} from 'react';
import {googleLogout} from "@react-oauth/google";

function Logout({setUser}) {
    const [profileImage, setProfileImage] = useState("/images/google_icon.png");

    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("login"));
        if (userData && userData.picture) {
            setProfileImage(userData.picture);
        }
    }, []);

    const onLogoutClick = () => {
        googleLogout();
        setUser(null);
        localStorage.setItem("login", null);
        console.log("Logout made successful");
    };

    return (
        <div>
            <button
                onClick={onLogoutClick}
                type="button"
                className="btn btn-light"
            >
                <img
                    src={profileImage}
                    alt="Logout Icon"
                    className="logoutIcon"
                    style={{height: "25px", marginRight: "10px", borderRadius: "40%"}}
                />
                Logout
            </button>
        </div>
    );
}

export default Logout;