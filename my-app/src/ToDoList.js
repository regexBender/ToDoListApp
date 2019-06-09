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
        todoData: undefined,
        authorized: false,
        hasNewItemContent: false
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
        console.log("checkbox_" + id);
        console.log(
            this.state.todoData.find( (todo) => {
            return todo.id == id
            }).checked);
        this.setState(() => {
            this.state.todoData.find( (todo) => {
                return todo.id == id
                }).checked ^= 1;
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
        this.forceUpdate();
    }

    addItem = (event) => {
        event.preventDefault();

        console.log("new Item content " + this.newItemContent.value);

        let newItem = {
            userid: this.state.userid,
            task: this.newItemContent.value
        }

        axios.post("/todos", qs.stringify(newItem), config)
        .then( (res) => {
            if (res) {
                //console.log(JSON.stringify(res.data));

                this.setState( (state) => {
                    state.todoData.push(res.data);
                    return state.todoData;
                })


                //console.log(JSON.stringify(res.data));

            } else {
                console.log("Res was null or undef");
            }
        })

        .catch( (err) => {
            console.log("There was an error3 " + err);
        })

    }

    getTodos() {
        let todoDataDisplay = this.state.todoData;

        return todoDataDisplay.slice(0).reverse().map( (todo, index) => {
            let props = {
                index: index,
                id: todo.id,
                content: todo.content,
                checked: todo.checked,
                updateCheckbox: this.updateCheckbox
            }
            return <ToDoItem {...props} />;
        });
    }

    handleTextInput = () => {
        if (this.newItemContent) {
            this.setState({
                hasNewItemContent: this.newItemContent.value.length
            })
        }
    }

    render() {
        //console.log(this.state.todoData);
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
                                    placeholder="Add an item."
                                />
                                <input
                                    className="submit_task"
                                    type="submit"
                                    disabled={ Boolean(!this.state.hasNewItemContent) }
                                    value="+"
                                />
                            </form>
                        </div>
                    <div className="main_container">

                        <div className="middle" id="todolist">
                            {this.getTodos()}
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
