import React from 'react';
import axios from 'axios';
import { Route, Link, BrowserRouter, Redirect as Router } from 'react-router-dom'

import ToDoList from './ToDoList';

import './StyleSheet.css';

const qs = require('qs');

const config = {
    headers: {
       'Content-Type': 'application/x-www-form-urlencoded',
    }
};


class LoginForm extends React.Component {
    state = {
        hasEmail: false,
        hasPassword: false,
        displayMessage: '',
        messageStyle: {color: "green"},
        id: undefined,
        token: undefined,
        goToList: false
    }
        
    handleEmailChange = (event) => {
        var email = this.emailNode.value;

        console.log(email);

        if (Boolean( this.emailNode.value.length ) !== this.state.hasEmail) {
            this.setState({
                hasEmail: Boolean(this.emailNode.value.length)
            });
        }
        
    }

    handlePasswordChange = (event) => {
        var password = this.passwordNode.value;

        console.log(password);
        if (Boolean( this.passwordNode.value.length ) !== this.state.hasPassword) {
            this.setState({
                hasPassword: Boolean(this.passwordNode.value.length)
            });
        }
    }


    handleSubmit = (event) => {
        event.preventDefault();

        console.log(this.emailNode.value);
        console.log(this.passwordNode.value);

        if ( this.state.hasEmail && this.state.hasPassword ) {
            this.post({
                email    : this.emailNode.value,
                password : this.passwordNode.value
            }); // why was callback to set goToList not working here?

        }

        
    }

    post = (registration_info) => {
        axios.post('./routes/login', qs.stringify(registration_info), 
        config)
        .then( (res) => {
            this.setState({
                displayMessage: res.data,
                messageStyle: {color: "green"},
                id: res.data.userid,
                token: res.data.jwt,
                goToList: true
            });
            console.log("New user registered using React");
            console.log(qs.stringify(registration_info));
        })
        .catch( (error) => {
            this.setState({
                displayMessage: "Login Failed." + error,
                messageStyle: {color: "red"}
            });
            console.log("There was an error: " + error);
        })
    }

    render() {
        
        if (this.state.goToList) {
            localStorage.setItem("JWT", this.state.token);
            return(
                <Router to={`/todolist/${this.state.id}`} component={ToDoList} />
                
                )
        }
        

        return (
            <div className="LoginForm">
                <div className="banner">
                    <h1>To Do</h1>
                </div>

                <hr></hr>
                <form id="login_form" onSubmit = {this.handleSubmit}>
                    <div className="main_container_login">
                        <div className="left_login">
                            <div className="register_label">
                                Email
                            </div>
                            <div className="register_label">
                                Password
                            </div>
                        </div>

                        <div className="right_login">  
                                <div>
                                    <input 
                                        onChange = {this.handleEmailChange}
                                        ref = {email => (this.emailNode = email)}
                                        className="register_text"
                                        type="text" 
                                        id="email" 
                                        name="email" 
                                        placeholder="john.smith@example.com" />
                                </div>
                                <div>
                                    <input 
                                        onChange = {this.handlePasswordChange}
                                        ref = {password => (this.passwordNode = password)}
                                        className="register_text" 
                                        type="password" 
                                        id="password" 
                                        name="password" 
                                        placeholder="Password123" />
                                </div>
                        </div>    
                        <input 
                            disabled = {!this.state.hasEmail || !this.state.hasPassword}
                            className="submit_register" 
                            value="Go" 
                            type="submit" />
                        <div className="message" style={this.state.messageStyle} id="message">{this.state.displayMessage}</div>
                    </div>
                </form>
        </div>
        )};
}

export default LoginForm;
