import React, { Component } from 'react';

class ChoiceInput extends Component {
    constructor(props) {
        super(props);

        this.state = {
            firstOptionText: this.props.firstOptionText,
            options: [],
            value: "DEFAULT"
        }

        this.submit = this.submit.bind(this);
        this.resetOptionText = this.resetOptionText.bind(this);
        this.selectField = React.createRef();
    }
    render() {
        return(
            <div className="selection">
                <h4>{this.props.instructions}</h4>
                    <select className="selection-no-button" id={this.props.idName + "-select"} name={this.props.idName} onChange={this.submit} ref={this.selectField} value={this.state.value}>
                        {this.state.options}
                    </select>
            </div>
        );
    }

    componentDidMount() {
        this.updateStateFromProps(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.updateStateFromProps(nextProps);
    }

    // update the options in the selection menu
    updateStateFromProps(props) {
        var options = [];
        options.push(<option value={null} key={0}>{this.state.firstOptionText}</option>);

        for (var op in props.availableOptions) {
            options.push(<option value={props.availableOptions[op]} key={op+1}>{props.availableOptions[op]}</option>);
        }

        this.setState({
            options: options,
            value: props.value
        }, () => {
            this.selectGivenInput(this.state.value)
        });
    }

    // select the option input in the options list
    selectGivenInput(input) {
        if (input === null) {
            this.setState({
                value: "DEFAULT"
            })
        }

        for (var option in this.state.options) {
            if (this.state.options[option].props.children === input) {
                this.setState({
                    value: input
                })
            }
        }
    }

    resetOptionText() {
        this.setState({
            firstOptionText: this.props.firstOptionText
        });
    }

    // submit a new value for the given selection
    submit(event) {
        if (event.target.value === this.state.firstOptionText) {
            this.props.submitFunction(null);
            this.setState({
                firstOptionText: this.props.firstOptionText
            });
        }
        else {
            this.props.submitFunction(event.target.value);
            this.setState({
                firstOptionText: "Clear Selection"
            });
        }
    }
}

export default ChoiceInput
