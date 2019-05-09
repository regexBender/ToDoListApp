import React from 'react';
import axios from 'axios';
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
        validPassword: false
    }

    componentDidMount() {
        this.setState({
            validPassword: schema.validate('')
        })
    }

    handlePasswordChange = (event) => {
        //const {password} = event.target;
        var password = this.passwordNode.value;

        console.log(password);

        this.setState({
            validPassword: schema.validate(password)
        });
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
            })
        }
    }

    post = (registration_info) => {
        axios.post('./routes/register', qs.stringify(registration_info), 
        config)
        .then( (res) => {
            console.log("New user registered using React");
            console.log(qs.stringify(registration_info));
        })
        .catch( (error) => {
            console.log("There was an error: " + error);
        })
    }

    render() {
        const {validPassword} = this.state
        return (
        <div className="Register">
            <div className="banner">
                    <h1>To Do</h1>
            </div>

            <hr></hr>

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
                        onChange = {this.handleChange}
                        disabled = { Boolean(!validPassword) }
                        className="submit_register" 
                        value="Register" 
                        type="submit" />
                    <div className="message" id="message"></div>
                </div>
            </form>
        </div>
        )};
}

export default RegisterForm;
