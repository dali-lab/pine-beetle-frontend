import React, { Component } from 'react';

class TextInput_NoSubmitButton extends Component {
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
            <div className="selection">
                <h4>{this.props.instructions}</h4>
                <input className="input" type="text" name="fname" value={this.state.value} onChange={this.setValue} onClick={this.selectText} onKeyPress={this.handleKeyPress}></input>

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
        console.log('value received = ' + event.target.value);
        this.setState({
            value: event.target.value
        }, () => {
          console.log('setValue is submitting...' + this.state.value);
          this.props.submitFunction(this.state.value);
        });
    }

    // submit a new value for the given selection
    submit(event) {
        console.log('submitting...' + this.state.value);
        this.props.submitFunction(this.state.value);
    }

    // highlight the text field on user click
    selectText(event) {
        event.target.select();
    }

    // if user presses enter in the input field, click the submit button for them
    handleKeyPress(event) {
        if (event.key === 'Enter') {
            // this.submit();
            this.setState({
                value: event.target.value
            }, () => {
              console.log('handleKeyPress is submitting...' + this.state.value);
              this.props.submitFunction(this.state.value);
            });
        }
    }
}

export default TextInput_NoSubmitButton
