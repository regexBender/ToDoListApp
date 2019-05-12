import React from 'react';
import axios from 'axios';
import { Route, Link, BrowserRouter, Redirect as Router } from 'react-router-dom'

import ToDoList from './ToDoList';

import './StyleSheet.css';

const qs = require('qs');
const passwordValidator = require('password-validator');

const config = {
    headers: {
       'Content-Type': 'application/x-www-form-urlencoded',
    }
};

// Create a schema
const schema = new passwordValidator();
 
// Add properties to it
schema
.is().min(3)                                    // Minimum length 3
.is().max(100)                                  // Maximum length 100
.has().uppercase()                              // Must have uppercase letters
.has().lowercase()                              // Must have lowercase letters
.has().digits()                                 // Must have digits
.has().not().spaces()                           // Should not have spaces
.is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values




class RegisterForm extends React.Component {
    state = {
        validPassword: false,
        displayMessage: '',
        messageStyle: {color: "green"},
        goToList: false
    }

    //this.displayMessage = this.displayMessage.bind(this);

    componentDidMount() {
        this.setState({
            validPassword: schema.validate('')
        })
    }

    handlePasswordChange = (event) => {
        //const {password} = event.target;
        var password = this.passwordNode.value; // use const or let instead of var

        console.log(password);

        var isValidPassword = schema.validate(password);
        this.setState({
            validPassword: isValidPassword,
            displayMessage: ( !isValidPassword ) ? 
                schema.validate(password, {list: true}).join(", ") : // refactor as a variable (maybe)
                "Password is valid!",
            messageStyle: {color: !isValidPassword ? "red" : "green"}
        });
        /*
        if (true) {
            let something = '...';
            password = "Bob";
        }
        */
        console.log("message: " + this.state.displayMessage);
    }

    handleSubmit = (event) => {
        event.preventDefault();

        console.log(this.firstnameNode.value);
        console.log(this.lastnameNode.value);
        console.log(this.emailNode.value);
        console.log(this.passwordNode.value);

        if ( this.passwordNode && schema.validate(this.passwordNode.value) ) {
            this.post({
                firstname: this.firstnameNode.value,
                lastname : this.lastnameNode.value,
                email    : this.emailNode.value,
                password : this.passwordNode.value
            }); // why was callback to set goToList not working here?

        }

        
    }
// async await --> easier to follow
    post = (registration_info) => {
        axios.post('./routes/register', qs.stringify(registration_info), 
        config)
        .then( (res) => {
            this.setState({
                displayMessage: res.data,
                messageStyle: {color: "green"},
                goToList: true
            });
            console.log("New user registered using React");
            console.log(qs.stringify(registration_info));
        })
        .catch( (error) => {
            this.setState({
                displayMessage: "User was not added." + error,
                messageStyle: {color: "red"}
            });
            console.log("There was an error: " + error);
        })
    }

    render() {
        if (this.state.goToList) {
            return(
                <Router to="/todolist/1" component={ToDoList}></Router>
                // if (redirectToReferrer) return <Redirect to={from} />; // <-- Look into this

                //<Router>
                //    <Route exact path="/todolist/1" component={ToDoList}></Route>
                //</Router>
                )
        }

        return (
        <div className="Register">
            <div className="banner">
                    <h1>To Do</h1>
            </div>

            <hr></hr>

            <form id="register_form" onSubmit = {this.handleSubmit} action="/todolist/1">
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
                        disabled = { Boolean(!this.state.validPassword) }
                        className="submit_register" 
                        value="Register" 
                        type="submit" />
                    <div className="message" style={this.state.messageStyle} id="message">
                        {this.state.displayMessage}
                    </div>
                </div>
            </form>
        </div>
        )};
}

export default RegisterForm;
