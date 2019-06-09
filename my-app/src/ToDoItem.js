import React from 'react';
import './StyleSheet.css';

class ToDoItem extends React.Component {

    getClasses() {
        const indexState = this.props.index % 2 === 0 ? "task" : "task2";
        const completed = this.props.checked ? "complete" : "";
        return `${indexState} ${completed}`;
    }

    render() {
        return (
            <div key = {this.props.id} className = {this.getClasses()}>
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

// id, checked, index, content, updateCheckbox

export default ToDoItem;