import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

import './index.css';
import Register from './Register';
import * as serviceWorker from './serviceWorker';

class User extends React.Component {
    state = {
        name: 'no name'
    }
    componentDidMount() {
        axios.get('/register')
            .then( (res) => {
                const name = res.name;
                this.setState(name);
            })
    }
}

//ReactDOM.render(<Register />, document.getElementById('root'));
ReactDOM.render(<User />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
