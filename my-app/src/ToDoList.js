import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import './StyleSheet.css';

const qs = require('qs');

const config = {
    headers: {
       'Content-Type': 'application/x-www-form-urlencoded',
    }
};




class ToDoList extends React.Component {
    state = {
        userid: undefined,
        todoData: undefined,
        authorized: false
    }

    componentWillMount() {
        this.setState({
            userid: this.props.match.params.id
        });

        const jwt = localStorage.getItem("JWT");

        if (!jwt) {
            this.props.history.push('/login');
        }

        axios.get(`/authUser/${this.props.match.params.id}`, // Look up async await to prevent flash
            { headers: {
                Authorization: `Bearer ${jwt}`
            }})
            .then( (res) => {
                if (res) {
                    console.log("authenticated");
                    this.setState({
                        authorized: true
                    })
                } else {
                    localStorage.removeItem("JWT");
                    console.log("authentication failed");
                    this.props.history.push('/login');
                }
            })
            
            .catch( (err) => {
                localStorage.removeItem("JWT");
                console.log("There was an error2 " + err);
                this.props.history.push('/login');
            })
            
    }

    componentDidMount() {
        axios.get(`/todos/${this.props.match.params.id}`)
            .then( (res) => {
                if (res) {
                    this.setState({
                        todoData: res.data
                    }, () => {
                        const listContainer = document.getElementById("todolist");
                        let displayTodos = [];

                        // Javascript array.map would also work
                        this.state.todoData.forEach( (item, index) => {

                            const todo = 
                                <div key={index}
                                    className={(index % 2 == 0) ? "task" : "task2"}>
                                    <input type="checkbox" defaultChecked={item.checked ? 1 : 0}/>
                                    {item.content}
                                </div>
                            displayTodos.push(todo);
                        });

                        ReactDOM.render(displayTodos, listContainer);
        
                    });
                    console.log(JSON.stringify(res.data));
                } else {
                    console.log("Res was null or undef");
                }
            })
            
            .catch( (err) => {
                console.log("There was an error3 " + err);
            })

        


    }

    logout = (event) => {
        localStorage.removeItem("JWT");
        this.props.history.push('/login');
    }

    addItem = (event) => {
        event.preventDefault();

        let newItem = {
            userid: this.state.userid,
            task: this.newItemContent
        }

        axios.post("/todos", qs.stringify(newItem), config)
        .then( (res) => {
            if (res) {
                /*
                this.addItem(res);
                //TODO: implement addItem, rerender todos
                ReactDOM.render(displayTodos, listContainer);
        
            
                console.log(JSON.stringify(res.data));
                */
            } else {
                console.log("Res was null or undef");
            }
        })
        
        .catch( (err) => {
            console.log("There was an error3 " + err);
        })
    }

    render() {
        console.log(this.state.todoData);
        if (this.state.authorized) {
            return (
                <div className="ToDoList">
                    <div className="banner">
                        <h1>To Do for user {this.props.match.params.id}</h1>
                        <button 
                            className="logout_button" 
                            onClick={this.logout}>
                                Logout
                        </button>
                    </div>

                    <hr></hr>
                    <div className="add_item">
                            <form action="">
                                <input 
                                    ref = {
                                        newItemContent => (this.newItemContent = newItemContent)
                                    }
                                    className="input_text" 
                                    type="text" 
                                    id="add_item" 
                                    name="add_item" 
                                    placeholder="Add an item." />
                                <input className="submit_task" type="submit" value="+" />
                            </form>
                        </div>
                    <div className="main_container">
                        
                        <div className="middle" id="todolist">
                            
                        </div>
                    
                    </div>
                </div>
        
            )
        } else {
            return(
                <div className="Loading">
                    Loading...
                </div>
            )
        }
    };
}

export default ToDoList;
