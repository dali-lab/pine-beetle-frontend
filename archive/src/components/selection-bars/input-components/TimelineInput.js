import React, { Component } from 'react';

class TimelineInput extends Component {
    constructor(props) {
        super(props);

        // initialize state
        this.state = {
            value: this.props.valueToDisplay
        }

        // bind functions
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.setValue = this.setValue.bind(this);
        this.submit = this.submit.bind(this);
    }
    render() {
        return(
            <div className="prediction_variables">
                <input className="variableInput" type="text" name="fname" value={parseInt(this.state.value)} onChange={this.setValue} onClick={this.selectText} onKeyPress={this.handleKeyPress} style={{backgroundColor: this.props.color}} disabled={(this.props.disabled != null && this.props.disabled) ? this.props.disabled : false}></input>
                <span className="variableLabel">{this.props.instructions}</span>
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

    // if user presses enter in the input field, click the submit button for them
    handleKeyPress(event) {
        if (event.key === 'Enter') {
            this.submit();
        }
    }
}

export default TimelineInput
