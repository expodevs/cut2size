import React, { Component } from 'react';
import {isMobile} from "react-device-detect";

import loadable from '@loadable/component'
import MiniCartBottom from "./MiniCartBottom";
import EmptyCartButton from "./EmptyCartButton";
const CartItem = loadable(() => import('../cart/CartItem'));



class MiniCart extends Component {




    componentDidMount() {

        // change mini-cart height for mobile

        let self = this;
        if(typeof window !=='undefined'){
            self.ChangeMiniCartHeight();
            window.onresize = function(event) {
                self.ChangeMiniCartHeight();
            };
        }
    }
    ChangeMiniCartHeight() {
        let deviceHeight,
            productListHeight;

        if (window.screen.width <= 767) {
            deviceHeight = window.outerHeight;

            productListHeight = deviceHeight - deviceHeight/2;
            let productList = document.querySelectorAll('.mini-cart .product-list')[0];
            if(productList){
                productList.style["max-height"] = productListHeight + 'px'
            }
        }
    }
    render() {

        return (<div>
                {(this.props.cart.products && this.props.cart.products.length>0) ?
                    <div className="mini-cart-products">
                        <div className={"product-list"}>
                            {isMobile ?
                                <div className={'mini-cart-title'}>
                                    <span>Your Selection: </span>
                                    <EmptyCartButton
                                        submitButtonDisable={this.props.submitButtonDisable}
                                    />
                                </div>
                            : ''}
                            {this.props.cart.products.map((product,index)=>
                                <CartItem key={index} product={product} minicart={true}/>
                            )}
                        </div>
                        <MiniCartBottom
                            total={this.props.cart.total}
                            setSubmitButtonDisable={this.props.setSubmitButtonDisable}
                            setProceedPaymentButtonDisable={this.props.setProceedPaymentButtonDisable}
                            submitButtonDisable={this.props.submitButtonDisable}
                            proceedPaymentButtonDisable={this.props.proceedPaymentButtonDisable}
                        />
                    </div>
                    :
                    <div className="mini-cart-header"><h5 className="mini-cart-title no-empty">Shopping Cart</h5><h5 className="mini-cart-title empty">Your Shopping Cart Is Empty Now</h5></div>
                }

            </div>

        )
    }
}

export default MiniCart;
