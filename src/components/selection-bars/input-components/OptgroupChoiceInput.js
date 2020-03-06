import React, { Component } from 'react';

class OptgroupChoiceInput extends Component {
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
        if (this.props.showAboveText) {
            return(
                <div className="selection">
                    <img src={ require('../../../assets/menu.png') } className="dropdown_img" alt="drop down" />
                    <select className="selection-no-button" id={this.props.idName + "-select"} name={this.props.idName} onChange={this.submit} ref={this.selectField} value={this.state.value}>
                        {this.state.options}
                    </select>
                </div>
            );
        }
        else {
            return(
                <div className="selection">
                    <img src={ require('../../../assets/menu.png') } className="dropdown_img" alt="drop down" />
                    <select className="selection-no-button" id={this.props.idName + "-select"} name={this.props.idName} onChange={this.submit} ref={this.selectField} value={this.state.value}>
                        {this.state.options}
                    </select>
                </div>
            );
        }
    }

    componentDidMount() {
        this.updateStateFromProps(this.props);
    }

    componentWillReceiveProps(nextProps) {
        this.updateStateFromProps(nextProps);
    }

    // update the options in the selection menu
    updateStateFromProps(props) {
        var totalOptions = [];
        totalOptions.push(<option value={null} key={0}>{this.state.firstOptionText}</option>);

        for (var op in Object.keys(props.availableOptions)) {
            var nf = Object.keys(props.availableOptions)[op];

            if (nf !== "COUNTIES") {
                var options = [];

                for (var forest in props.availableOptions[nf]) {
                    options.push(<option value={props.availableOptions[nf][forest]} key={forest+1}>{props.availableOptions[nf][forest]}</option>);
                }

                if (options.length > 0) {
                    totalOptions.push(
                        <optgroup label={nf} key={op+50}>
                            {options}
                        </optgroup>
                    );
                }
            }
        }

        options = [];

        for (forest in props.availableOptions["COUNTIES"]) {
            options.push(<option value={props.availableOptions["COUNTIES"][forest]} key={forest+1}>{props.availableOptions["COUNTIES"][forest]}</option>);
        }

        if (options.length > 0) {
            totalOptions.push(
                <optgroup label="COUNTIES" key={30}>
                    {options}
                </optgroup>
            );
        }

        this.setState({
            options: totalOptions,
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
            });
        }

        for (var option in this.state.options) {
            if (this.state.options[option].props.children === input) {
                this.setState({
                    value: input
                });
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

export default OptgroupChoiceInput
