import React, {PureComponent} from 'react';

export default class PopupContent extends PureComponent {
    constructor(props) {
        super(props)

        // map of state abbreviations to their names
        this.stateAbbrevToStateName = {
            AL:"Alabama",
            AR:"Arkansas",
            DE:"Delaware",
            FL:"Florida",
            GA:"Georgia",
            KY:"Kentucky",
            LA:"Louisiana",
            MD:"Maryland",
            MS:"Mississippi",
            NC:"North Carolina",
            NJ:"New Jersey",
            OK:"Oklahoma",
            SC:"South Carolina",
            TN:"Tennesse",
            TX:"Texas",
            VA:"Virginia"
        }
    }

    render() {
        // console.log(this.props.info)
        return (
            <div className="popup-content">
                <p><b>{this.stateAbbrevToStateName[this.props.info.state]}</b></p>
                <p><b>Forest: </b>{this.props.info.forest}</p>
                <p><b>Spots: </b>{this.props.info.spots}</p>
                <p><b>SPB: </b>{this.props.info.spbPerTwoWeeks}</p>
                <p><b>Clerids: </b>{this.props.info.cleridsPerTwoWeeks}</p>
            </div>
        );
    }
}
