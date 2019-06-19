import React from 'react';
import './StyleSheet.css';

class ToDoItem extends React.Component {

    getClasses() {
        const indexState = "task"
        const completed = this.props.checked ? "complete" : "";
        return `${indexState} ${completed}`;
    }

    render() {
        return (
            <div id = {"todo_" + this.props.id} className = {this.getClasses()}>
                <input id = { "checkbox_" + this.props.id }
                    type = "checkbox"
                    defaultChecked = {this.props.checked ? 1 : 0}
                    onClick = {
                       () => this.props.updateCheckbox(this.props.id)
                    }

                />
                { this.props.content }
            </div>
        );
    };
}


export default ToDoItem;
