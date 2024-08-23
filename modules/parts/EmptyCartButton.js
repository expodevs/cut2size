import React, {Component} from "react";
import {store} from "../../../../store";
import {clearCart} from "../../../../actions/cart";
import {confirmAlert} from "react-confirm-alert";
import {isMobile} from 'react-device-detect';

class EmptyCartButton extends Component {

    clearCart=(e)=>{
        confirmAlert({
            message: 'Are you sure you want to empty the cart?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () =>
                        store.dispatch(clearCart())

                },
                {
                    label: 'No',
                }
            ]
        });
    };

    render() {
        return (
            (!isMobile) ?
                <button className="link mr-1 clearCart" disabled={this.props.submitButtonDisable} onClick={e=> this.clearCart(e)}>
                    {this.props.submitButtonDisable ? 'Loading...' : 'Empty the Cart'}
                </button>
                : <button className="empty-cart-btn" onClick={e=> this.clearCart(e)}>Empty the cart</button>
        )
    }
}

export default EmptyCartButton;
