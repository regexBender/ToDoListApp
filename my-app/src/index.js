import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

import './index.css';
import Register from './Register';
import * as serviceWorker from './serviceWorker';
import { URLSearchParams } from 'url';

var qs = require('qs');

var config = {
    headers: {
       'Content-Type': 'application/x-www-form-urlencoded',
    }
};

class RegisterForm extends React.Component {
    state = {
        firstname: null,
        lastname : null,
        email    : null,
        password : null
    }


    handleSubmit = (event) => {
        event.preventDefault();

        console.log(this.firstnameNode.value);
        console.log(this.lastnameNode.value);
        console.log(this.emailNode.value);
        console.log(this.passwordNode.value);
/*
        const params = new URLSearchParams();
        params.append(firstname, this.firstnameNode.value),
        params.append(lastname, this.lastnameNode.value),
        params.append(email, this.emailNode.value),
        params.append(password, this.passwordNode.value),
*/
        //this.post(params);

        this.post({
            firstname: this.firstnameNode.value,
            lastname : this.lastnameNode.value,
            email    : this.emailNode.value,
            password : this.passwordNode.value
/*
            email    : "test1@godzilla.com",//registration_info.email,
            password : "ewrew",//registration_info.password,
            firstname: "Jon", //registration_info.firstname,
            lastname : "Snow", //registration_info.lastname,
            */
        })
        

    }

    post = (registration_info) => {
        axios.post('./routes/register', qs.stringify(registration_info), 
        config)
        .then( (res) => {
            console.log("New user registered using React");
        })
        .catch( (error) => {
            console.log("There was an error: " + error);
        })
    }

    render() {
        return (
        <div className="Register">
        <div className="banner">
                <h1>To Do</h1>
        </div>

        <form id="register_form" onSubmit = {this.handleSubmit}>
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
                        <input 
                            ref = {firstname => (this.firstnameNode = firstname)}
                            className="register_text" 
                            type="text" 
                            id="first" 
                            name="firstname" 
                            placeholder="John" />
                    </div>
                    <div>
                        <input 
                            ref = {lastname => (this.lastnameNode = lastname)}
                            className="register_text"
                            type="text" 
                            id="last"
                            name="lastname"
                            placeholder="Smith" />
                    </div>
                    <div>
                        <input 
                            ref = {email => (this.emailNode = email)}
                            className="register_text" 
                            type="text" 
                            id="email" 
                            name="email" 
                            placeholder="john.smith@example.com" />
                    </div>
                    <div>
                        <input 
                            ref = {password => (this.passwordNode = password)}
                            className="register_text" 
                            type="password" 
                            id="password" 
                            name="password" 
                            placeholder="Password123" />
                    </div>
                </div>
                <input className="submit_register" value="Register" type="submit" />
                <div className="message" id="message"></div>
            </div>
        </form>
    </div>
    )}

}



ReactDOM.render(<RegisterForm />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
