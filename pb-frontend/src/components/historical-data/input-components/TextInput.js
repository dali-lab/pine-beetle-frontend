import React, { Component } from 'react';
import '../../../styles/historical-data/InputFields.css';

class TextInput extends Component {
    constructor(props) {
        super(props);

        // initialize state
        this.state = {
            value: this.props.valueToDisplay
        }

        // bind
        this.setValue = this.setValue.bind(this);
        this.submit = this.submit.bind(this);
    }
    render() {
        return(
            <div className="selection">
                <h3>{this.props.instructions}</h3>
                <input className="input" type="text" name="fname" value={this.state.value} onChange={this.setValue} onClick={this.selectText}></input>
                <button className="submit" onClick={this.submit}>Submit</button>
            </div>
        );
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            value: nextProps.valueToDisplay
        });
    }

    // update the held state in the input field
    setValue(event) {
        this.setState({
            value: event.target.value
        });
    }

    // submit a new value for the given selection
    submit(event) {
        this.props.submitFunction(this.state.value);
    }

    // highlight the text field on user click
    selectText(event) {
        event.target.select();
    }
}

export default TextInput
