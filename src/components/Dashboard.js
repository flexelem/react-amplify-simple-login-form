import React, {useEffect, useState} from 'react';
import '../App.css';
import { Auth } from 'aws-amplify';
import { Navigate } from "react-router-dom";

function Dashboard(props) {
    const [user, setUser] = useState();
    const [isLoading, setIsLoading] = useState(true);

    async function getCurrentUser() {
        try {
            const authUser = await Auth.currentAuthenticatedUser();
            setUser(authUser);
        } catch (e) {
            setUser(null);
            setIsLoading(false);
        }
    }

    useEffect(() => {
        getCurrentUser();
    }, []);

    async function handleSignOut(event) {
        event.preventDefault();
        console.log('clicked signout');
        try {
            const user = await Auth.signOut();
        } catch (error) {
            console.log('error signing out: ', error);
        }
        setUser(null);
        setIsLoading(false);
    }

    if (!user && !isLoading) {
        return <Navigate to="/" replace={true} />
    }

    return (
        <div className="container">
            <button onClick={handleSignOut} className="fluid ui button blue">Log Out</button>
            <h1>Dashboard</h1>
        </div>
    )
}

export default Dashboard;
