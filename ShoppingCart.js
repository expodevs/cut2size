import React, { Component } from 'react';

import {connect} from "react-redux";
import PropTypes from "prop-types";
import CartItem from "./modules/cart/CartItem";
import Total from "./modules/checkout/Total";
import Breadcrumbs from "./modules/breadcrumbs";
import FormErrors from "./modules/FormErrors";
import FormSuccess from "./modules/FormSuccess";
import SaveCartButton from "./modules/parts/SaveCartButton";
import CheckoutButton from "./modules/parts/CheckoutButton";
import EmptyCartButton from "./modules/parts/EmptyCartButton";
import SaveExistingCartButton from "./modules/parts/SaveExistingCartButton";
import {setGtmEvent} from "../../functions/GtmDataLayer";

const VANITIES_ID = 45;

class ShoppingCart extends Component {

    state = {
        submitButtonDisable: false,
        proceedPaymentButtonDisable: false,
        modalOpen: false,
        saveExistingModalOpen: false,
        project_name: '',
        errors: false,
    };

    componentDidMount() {
        setGtmEvent('view_cart', this.props.cart.products);
    }


    setSubmitButtonDisable(val) {
        this.setState({submitButtonDisable: val});
    }
    setProceedPaymentButtonDisable(val) {
        this.setState({proceedPaymentButtonDisable: val});
    }



    saveCartModal=(e, modal)=>{
        e.preventDefault();
        if(!this.props.isCustomerAuthenticated && !this.props.cart.adminSavedCardCreate){
            return this.goToSign(e);
        }
        this.setState({[modal]: true });
    };

    onCloseModal = (e, modal) => {
        this.setState({ [modal]: false });
    };

    render() {

        let allProducts = this.props.cart.products;

        let notMerchantProducts = allProducts ? allProducts.filter(product => product.category_id !== VANITIES_ID) : null;
        let notMerchantProductsTotal = allProducts ? (notMerchantProducts.reduce((total, product) => total + (product.price * product.quantity), 0)) : null;

        let merchantProducts = allProducts ? allProducts.filter(product => product.category_id === VANITIES_ID) : null;
        let merchantProductsTotal = allProducts ? (merchantProducts.reduce((total, product) => total + (product.price * product.quantity), 0)) : null;
        
        return (
            <main>
                <section className="no-padding-bottom shopping-cart-breadcrumbs">
                    <Breadcrumbs
                        list={
                            [
                                {
                                    name: 'Shopping Cart',
                                },
                            ]
                        }
                    />
                </section>
                <section className="no-padding-top">
                    <div className="container">
                        <div className="row">
                            <div className="shopping-cart col-12">
                                <h1 className="cart-title">Shopping Cart</h1>
                                <div className="cart-content">
                                    {(notMerchantProducts && notMerchantProducts.length>0) ?
                                        <div className="cart-products">

                                            <div className="product-list">

                                                {notMerchantProducts.map((product,index)=>
                                                    <CartItem key={index} product={product}/>
                                                )
                                                }
                                            </div>
                                            <Total
                                                total={notMerchantProductsTotal}
                                            />
                                            <div className="to-checkout">
                                                <EmptyCartButton
                                                    submitButtonDisable={this.state.submitButtonDisable}
                                                />
                                                <SaveCartButton
                                                    setSubmitButtonDisable={this.setSubmitButtonDisable.bind(this)}
                                                    setProceedPaymentButtonDisable={this.setProceedPaymentButtonDisable.bind(this)}
                                                    submitButtonDisable={this.state.submitButtonDisable}
                                                    proceedPaymentButtonDisable={this.state.proceedPaymentButtonDisable}
                                                    saveCartModal={this.saveCartModal}
                                                    onCloseModal={this.onCloseModal}
                                                    modalOpen={this.state.modalOpen}
                                                />
                                                {(this.props.saved_cards && this.props.saved_cards.rows && this.props.saved_cards.rows.length ) &&
                                                    <SaveExistingCartButton
                                                        saveCartModal={this.saveCartModal}
                                                        onCloseModal={this.onCloseModal}
                                                        saveExistingModalOpen={this.state.saveExistingModalOpen}
                                                        saved_carts={this.props.saved_cards}
                                                    />
                                                }
                                                {
                                                    !this.props.cart.adminSavedCardCreate &&
                                                    <CheckoutButton
                                                        proceedPaymentButtonDisable={this.state.proceedPaymentButtonDisable}
                                                    />
                                                }

                                            </div>
                                            <FormErrors formErrors={this.state.errors}/>
                                            <FormSuccess success={this.state.success}/>
                                        </div>

                                        :
                                        <div className="mini-cart-header"><h5 className="mini-cart-title empty">Your Shopping Cart Is Empty Now</h5></div>
                                    }
                                </div>
                            </div>
                            {merchantProducts && merchantProducts.length > 0 &&
                            <div className="shopping-cart col-12">
                                <h2>Vanities:</h2>
                                <div className="cart-content">
                                    {(merchantProducts && merchantProducts.length > 0) ?
                                        <div className="cart-products">

                                            <div className="product-list">

                                                {merchantProducts.map((product,index)=>
                                                    <CartItem key={index} product={product}/>
                                                )
                                                }
                                            </div>
                                            <Total
                                                total={merchantProductsTotal}
                                            />
                                            <div className="to-checkout">
                                                <EmptyCartButton
                                                    submitButtonDisable={this.state.submitButtonDisable}
                                                />
                                                <SaveCartButton
                                                    setSubmitButtonDisable={this.setSubmitButtonDisable.bind(this)}
                                                    setProceedPaymentButtonDisable={this.setProceedPaymentButtonDisable.bind(this)}
                                                    submitButtonDisable={this.state.submitButtonDisable}
                                                    proceedPaymentButtonDisable={this.state.proceedPaymentButtonDisable}
                                                    saveCartModal={this.saveCartModal}
                                                    onCloseModal={this.onCloseModal}
                                                    modalOpen={this.state.modalOpen}
                                                    merchant={true}
                                                />
                                                {
                                                    !this.props.cart.adminSavedCardCreate &&
                                                    <CheckoutButton
                                                        proceedPaymentButtonDisable={this.state.proceedPaymentButtonDisable}
                                                        merchant={true}
                                                    />
                                                }

                                            </div>
                                            <FormErrors formErrors={this.state.errors}/>
                                            <FormSuccess success={this.state.success}/>
                                        </div>

                                        :
                                        <div className="mini-cart-header"><h5 className="mini-cart-title empty">Your Shopping Cart Is Empty Now</h5></div>
                                    }
                                </div>
                            </div>}
                        </div>
                    </div>
                </section>
            </main>
        )
    }
}

ShoppingCart.propTypes = {
    cart: PropTypes.object.isRequired,
    customer: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    customer: state.auth.customer,
    isCustomerAuthenticated: state.auth.isCustomerAuthenticated,
    cart: state.cart,
    saved_cards:state.auth.saved_cards
});
export default connect(mapStateToProps)(ShoppingCart);
