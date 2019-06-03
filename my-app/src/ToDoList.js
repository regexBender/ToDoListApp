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
    _isMounted = false;

    state = {
        userid: undefined,
        todoData: undefined,
        authorized: false
    }

    componentWillMount() {
        this.setState({
            userid: this.props.match.params.id
        });
/*
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
     */       
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
            })
            .then(
                axios.get(`/todos/${this.props.match.params.id}`)
                .then( (res) => {
                    if (res && this._isMounted) {
                        this.setState( () => ({
                            todoData: res.data
                        }), () => {
                            if (this._isMounted && this.state.todoData) {
                                this.renderTodos();
                                //window.addEventListener('load', this.renderTodos)
                            }
                        });                     
                    } else {
                        console.log("Res was null or undef: " + JSON.stringify(res) );
                    }
                })
                .catch( (err) => {
                    console.log("There was an error3 " + err);
                })
            )

            .catch( (err) => {
                localStorage.removeItem("JWT");
                console.log("There was an error2 " + err);
                this.props.history.push('/login');
            })
/*
            axios.get(`/todos/${this.props.match.params.id}`)
                .then( (res) => {
                    if (res && this._isMounted) {
                        this.setState( () => ({
                            todoData: res.data
                        }), () => {
                            if (this._isMounted && this.state.todoData) {
                                this.renderTodos();
                                //window.addEventListener('load', this.renderTodos)
                            }
                        });                     
                    } else {
                        console.log("Res was null or undef: " + JSON.stringify(res) );
                    }
                })
                .catch( (err) => {
                    console.log("There was an error3 " + err);
                })
                */
        
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    logout = (event) => {
        localStorage.removeItem("JWT");
        this.props.history.push('/login');
    }

    wrapTodo = (item, index) => {
        item = <div key={item.id}
                className={(index % 2 == 0) ? "task" : "task2"}>
                <input type="checkbox" defaultChecked={item.checked ? 1 : 0}/>
                {item.content}
            </div>;

        return item;
    }

    renderTodos = () => {
        console.log("_isMounted: " + this._isMounted);
        console.log("todoData: " + this.state.todoData);

        if (this._isMounted && this.state.todoData && this.state.authorized) {
            let listContainer = document.getElementById("todolist");
            let displayTodos = [];

            displayTodos = this.state.todoData.map( (item, index) =>
                this.wrapTodo(item, index)
            );
            
            //console.log("List Container: " + listContainer);
            
            ReactDOM.render(displayTodos, listContainer); 
        }
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
                console.log(JSON.stringify(res.data));
                
                this.setState( (state) => {
                    state.todoData.push(res.data);
                    return state.todoData;
                }, () => {
                    console.log(this.state.todoData[this.state.todoData.length - 1].content)
                    this.renderTodos();
                })
                
            
                console.log(JSON.stringify(res.data));
                
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
                            <form onSubmit={this.addItem}> { 
                                    }
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
                    
                </div>
            )
        }
    };
}

export default ToDoList;
