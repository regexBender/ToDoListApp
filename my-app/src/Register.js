import React from 'react';

import './StyleSheet.css';




function Register() {
  return (
    <div className="Register">
        <div className="banner">
                <h1>To Do</h1>
        </div>

        <form id="register_form">
            <div className="main_container_register">
                <div className="left">
                    <div className="register_label">
                        First Name
                    </div>
                    <div className="register_label">
                        Last Name
                    </div>
                    <div className="register_label">
                        Email
                    </div>
                    <div className="register_label">
                        Password
                    </div>
                </div>
                <div className="right">
                    <div>
                        <input className="register_text" type="text" id="first" name="firstname" placeholder="John" />
                    </div>
                    <div>
                        <input className="register_text" type="text" id="last" name="lastname" placeholder="Smith" />
                    </div>
                    <div>
                        <input className="register_text" type="text" id="email" name="email" placeholder="john.smith@example.com" />
                    </div>
                    <div>
                        <input className="register_text" type="password" id="password" name="password" placeholder="Password123" />
                    </div>
                </div>
                <input className="submit_register" value="Register" type="submit" />
                <div className="message" id="message"></div>
            </div>
        </form>
    </div>
    
  );
}

export default Register;
