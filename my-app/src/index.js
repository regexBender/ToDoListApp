import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom'


import './index.css';
import RegisterForm from './RegisterForm';
import LoginForm    from './LoginForm';
import ToDoList     from './ToDoList';

import App from './App';
import * as serviceWorker from './serviceWorker';



// Store global state in local storage
// On login or register, store data (user info at first) in local storage
//  Pull data for todos from local storage
// Real way: state management library like redux

class Main extends React.Component {
    
    render() {
        return (
            <Router>
                <Route exact path="/" component={App}></Route>
                <Route exact path="/register" component={RegisterForm}></Route>
                <Route exact path="/login" component={LoginForm}></Route>                
                <Route path="/todolist/" component={ToDoList}></Route>
            </Router>
        )
    }
}



ReactDOM.render(<Main />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
