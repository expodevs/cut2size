import React, { Component } from 'react';


class MoreButton extends Component {


    render() {

        return (
            (parseInt(this.props.count)>0)?
            <p className="show-more"><button className="more-button" data-text="Hide"><span className="text">More</span> <span className="number">({(this.props.count)})</span></button></p>
                : ''
        )
    }
}
export default MoreButton