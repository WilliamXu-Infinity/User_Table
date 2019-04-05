import React, { Component } from 'react';
import '../App.css';

class InputNode extends Component {

    render() {
        return (
        <div className="HW2_2_addPage_Node">
            <p className="HW2_2_addPage_text">Input Text</p>
            <input
                className="HW2_2_addPage_inputBox"
                type="text" 
                />
        </div>
        );
    }
}

export default InputNode;
