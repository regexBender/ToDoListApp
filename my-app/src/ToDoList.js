import React from 'react';
import axios from 'axios';
import './StyleSheet.css';

const qs = require('qs');

const config = {
    headers: {
       'Content-Type': 'application/x-www-form-urlencoded',
    }
};




class ToDoList extends React.Component {

    

    render() {
        console.log(this.props);
        return (
            <div className="ToDoList">
                <div className="banner">
                    <h1>To Do for user {this.props.match.params.id}</h1>
                    <button className="logout_button">Logout</button>
                </div>

                <hr></hr>
                <div className="add_item">
                        <form action="">
                            <input className="input_text" type="text" id="add_item" name="add_item" placeholder="Add an item." />
                            <input className="submit_task" type="submit" value="+" />
                        </form>
                    </div>
                <div className="main_container">
                    
                    <div className="middle">
                        <div className="task">
                            <input type="checkbox" name="task1" value="1" />Task 1
                        </div>
                        <div className="task2">
                            <input type="checkbox" name="task2" value="1" />Task 1
                        </div>
                    </div>
                
                </div>
            </div>
        )};
}

export default ToDoList;
