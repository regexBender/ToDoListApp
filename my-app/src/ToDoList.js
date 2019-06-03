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
        
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    logout = (event) => {
        localStorage.removeItem("JWT");
        this.props.history.push('/login');
    }

    wrapTodo = (item, index) => {
        let id = item.id;
        let itemDiv = <div key={item.id} id={item.id}
                className = {
                    (index % 2 == 0 ? "task" : "task2")
                    +
                    (item.checked ? " complete" : "")
                    }>
                <input id={"checkbox_" + item.id}
                    type="checkbox" 
                    defaultChecked={item.checked ? 1 : 0}
                    onChange={ 
                        this.updateCheckbox.bind(this, id)
                    }
                    
                />
                {item.content}
            </div>;

        return itemDiv;
    }


    updateCheckbox = (id) => {
        console.log("checkbox_" + id);
        let todoCheckbox = document.getElementById("checkbox_" + id);
        todoCheckbox.checked = !todoCheckbox.checked;

        let todoDiv = document.getElementById(id);
        todoDiv.className = todoCheckbox.checked ?
            todoDiv.className + " complete" :
            todoDiv.className.replace(" complete", "");

        this.forceUpdate();
    }
  
    

    renderTodos = () => {
        console.log("_isMounted: " + this._isMounted);
        //console.log("todoData: " + this.state.todoData);

        if (this._isMounted && this.state.todoData && this.state.authorized) {
            let listContainer = document.getElementById("todolist");
            let displayTodos = [];

            displayTodos = this.state.todoData.map( (item, index) =>
                this.wrapTodo(item, index)
            );
            
            //console.log("List Container: " + listContainer);
            
            ReactDOM.render(displayTodos.reverse(), listContainer); 
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
                //console.log(JSON.stringify(res.data));
                
                this.setState( (state) => {
                    state.todoData.push(res.data);
                    return state.todoData;
                }, () => {
                    console.log(this.state.todoData[this.state.todoData.length - 1].content)
                    this.renderTodos();
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
                                <input 
                                    className="submit_task"
                                    type="submit" 
                                    disabled={!this.newItemContent}
                                    value="+" />
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
