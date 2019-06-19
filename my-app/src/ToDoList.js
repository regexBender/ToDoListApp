import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import './StyleSheet.css';

import ToDoItem from './ToDoItem';

const qs = require('qs');

const config = {
    headers: {
       'Content-Type': 'application/x-www-form-urlencoded',
    }
};

class ToDoList extends React.Component {
    _isMounted = false;

    state = {
        userid: undefined,
        todoData: [],
        checkedTodoData: [],
        authorized: false,
        hasNewItemContent: false,
        textInput: ""
    }

    componentWillMount() {
        this.setState({
            userid: this.props.match.params.id
        });
    }

    componentDidMount() {
        this._isMounted = true;

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
                return axios.get(`/todos/${this.props.match.params.id}`);
            })
            .then( (res) => {
                if (res && this._isMounted) {
                    this.setState( () => ({
                        todoData: res.data
                    }) );
                } else {
                    console.log("Res was null or undef: " + JSON.stringify(res) );
                }
            })
            .catch( (err) => {
                localStorage.removeItem("JWT");
                console.log("There was an error2 " + err);
                this.props.history.push('/login');
            })

    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    logout = (event) => {
        localStorage.removeItem("JWT");
        this.props.history.push('/login');
    }

    updateCheckbox = (id) => {
        
        this.setState((state) => {
            state.todoData.find( (todo) => {
                return todo.id == id
                }).checked ^= 1;
                return state.todoData;
        }, () => {
            let updateItem = {
                id: id,
                checked: this.state.todoData.find( (todo) => {
                    return todo.id == id
                    }).checked
            }
            axios.patch("/todos", qs.stringify(updateItem), config)
            .catch( (err) => {
                console.log("There was an error4 " + err);
            })
        });
    }

    addItem = (event) => {
        event.preventDefault();

        let newItem = {
            userid: this.state.userid,
            task: this.newItemContent.value
        }

        axios.post("/todos", qs.stringify(newItem), config)
        .then( (res) => {
            if (res) {
                this.setState( (state) => {
                    state.todoData.push(res.data);
                    return state.todoData;
                },  () => {
                    this.clearForm();
                })

            } else {
                console.log("Res was null or undef");
            }
        })

        .catch( (err) => {
            console.log("There was an error3 " + err);
        })

    }

    getTodos(todoData) {
        let todoDataDisplay = todoData;

        return todoDataDisplay.slice(0).reverse().map( (todo, index) => {
            let props = {
                index: index,
                id: todo.id,
                content: todo.content,
                checked: todo.checked,
                updateCheckbox: this.updateCheckbox
            }
            return <ToDoItem key = {todo.id} {...props} />;
        });
    }

    clearForm() {
        this.setState({
            textInput: "",
            hasNewItemContent: false
        })
    }

    handleTextInput = (event) => {
        this.setState({textInput: this.newItemContent.value});
        if (this.newItemContent) {
            this.setState({
                hasNewItemContent: this.newItemContent.value.length
            })
        }
    }

    render() {
        
        if (this._isMounted && this.state.todoData && this.state.authorized) {
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
                            <form onSubmit={this.addItem}>
                                <input
                                    ref = {
                                        newItemContent => (this.newItemContent = newItemContent)
                                    }
                                    onChange={ this.handleTextInput }
                                    className="input_text"
                                    type="text"
                                    id="add_item"
                                    name="add_item"
                                    value={this.state.textInput}
                                    placeholder="Add an item."
                                />
                                <input
                                    className="submit_task"
                                    type="submit"
                                    disabled={ Boolean(!this.state.textInput.length) }
                                    value="+"
                                />
                            </form>
                        </div>
                    <div className="main_container">

                        <div className="middle" id="todolist">
                            {this.getTodos(this.state.todoData)}
                        </div>
                        <div className="middle" id="todolist">
                            {this.getTodos(this.state.checkedTodoData)}
                        </div>

                    </div>
                </div>

            )
        } else {
            return(
                <div className="Loading">

                </div>
            )
        }
    };
}

export default ToDoList;
