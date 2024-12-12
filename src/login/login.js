import React, { useState } from 'react';
import './style.css';
import axios from 'axios';

const Login = () => {
    // Define state for email and name
    const [email, setEmail] = useState('');
    const [name, setname] = useState('');

    // API call function
    const fetchData = async (e) => {
        e.preventDefault(); // Prevent form submission from reloading the page

        try {
            // Send the email and name to the API
            const result = await axios.post("http://localhost:4100/login/login", { email, name });

            // Logging the response data
            console.log(result.data);
        } catch (error) {
            // Error handling
            console.error("Error fetching data:", error);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Login</h2>
                <form onSubmit={fetchData}>
                    <div className="input-group">
                        <input
                            type="name"
                            placeholder="name"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="name"
                            placeholder="name"
                            value={name}
                            onChange={(e) => setname(e.target.value)}
                            required
                        />
                    </div>
                    <div className="button-group">
                        <button type="submit">Login</button>
                    </div>
                </form>
                <div className="forgot-name">
                    <a href="#">Forgot name?</a>
                </div>
            </div>
        </div>
    );
};

export default Login;
