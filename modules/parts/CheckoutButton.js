import React, {Component} from "react";
import {isMobile} from 'react-device-detect';
import {Link} from "react-router-dom";

class CheckoutButton extends Component {

    render() {

        let url = '/cart/checkout';
        if (this.props.merchant) {
            url += '?vanities=1';
        }

        return (
            (!isMobile) ?
                <Link className="link" to={url} disabled={this.props.proceedPaymentButtonDisable}>
                    {this.props.proceedPaymentButtonDisable ? 'Loading...' : 'Proceed to Checkout'}
                </Link>
                : <Link className="link" to={url} disabled={this.props.proceedPaymentButtonDisable}>
                    {this.props.proceedPaymentButtonDisable ? 'Loading...' : 'Proceed to Checkout'}
                </Link>
        )
    }
}

export default CheckoutButton;
