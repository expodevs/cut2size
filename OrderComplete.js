import React, { Component } from 'react';
import {
    Link,withRouter
}from 'react-router-dom';
import {locationSearchToArray} from "../../functions/main";
import axios from "axios";
import FormErrors from "./modules/FormErrors";
import {clearCart} from "../../actions/cart";
import {store} from "../../store";
import WebpImage from "./modules/parts/WebpImage";
import {paymentComplete} from "../../functions/dataLayer";
import {connect} from "react-redux";
import {getInfo} from "../../actions/admin";
import SaveCartButton from "./modules/parts/SaveCartButton";
import PropTypes from "prop-types";
import {postAction} from "./modules/actionSender";
import {setGtmEvent} from "../../functions/GtmDataLayer";

class OrderComplete extends Component {

    state={
        payment: false,
        submitButtonDisable: false,
        proceedPaymentButtonDisable: false,
        modalOpen: false,
        saveExistingModalOpen: false,
        project_name: '',
        isMerchant: false,
        errors: false,
    };

    setSubmitButtonDisable(val) {
        this.setState({submitButtonDisable: val});
    }
    setProceedPaymentButtonDisable(val) {
        this.setState({proceedPaymentButtonDisable: val});
    }

    onCloseModal = (e, modal) => {
        this.setState({ [modal]: false });
    };

    componentDidMount() {
        this.checkIsMerchant();
        this.validatePayment();
    }
    validatePayment(){
        let search = locationSearchToArray(this.props.location.search);

        let params = {};
        search.forEach((value,key)=>{
            params[key] = value;
        });
        let url = process.env.REACT_APP_SERVER_URL+process.env.REACT_APP_API_SERVER_URL+'/orders/paymentValidate';

        if(params.extra_payment){
            url = process.env.REACT_APP_SERVER_URL+process.env.REACT_APP_API_SERVER_URL+'/orders/extraPaymentValidate';
        }

        console.error(params);

        if(params.ORDERID && params.ORDERID.length>0){

            axios({
                method: 'put',
                url: url,
                data: params,
                config: { headers: { 'Content-Type': 'application/json' }}
            }).then(res=>{
                console.log('res',res)
                console.log('this.props.cart?.products',this.props.cart?.products)
                if(res.data.errors && res.data.errors.length>0){
                    this.setState({errors:res.data.errors});
                    this.setState({submitButtonDisable: false});
                }else{
                    this.setState({success:res.data.success});
                    this.setState({errors:false});
                    this.setState({payment:params});

                    /*if(this.props.cart?.products){
                        paymentComplete(this.props.cart.products,{
                            id:params.ORDERID,
                            revenue:params.AMOUNT
                        });
                    }*/

                }

                this.props.cart.products.map((product) => {
                    setGtmEvent('purchase', product, this.props.cart.total);
                });

                setGtmEvent('purchase', this.props.cart.products, false, params.ORDERID);
                store.dispatch(clearCart(this.state.isMerchant));
            }).catch(error=>{
                console.log('error',error)
                let errors = error.response ? (error.response.data ? error.response.data : error.response.statusText ) : error;
                this.setState({errors:(errors.errors ? errors.errors : (errors.name ? errors.name : errors))})
                store.dispatch(clearCart(this.state.isMerchant));

            })
        }

        if(params.x_message){
            if(params.x_message.toLowerCase()==='success'){
                url = process.env.REACT_APP_SERVER_URL+process.env.REACT_APP_API_SERVER_URL+'/orders/payBrightValidate';
                axios({
                    method: 'put',
                    url: url,
                    data: params,
                    config: { headers: { 'Content-Type': 'application/json' }}
                }).then(res=>{
                    if(res.data.errors && res.data.errors.length>0){
                        this.setState({errors:res.data.errors});
                        this.setState({submitButtonDisable: false});
                    }else{
                        this.setState({success:res.data.success});
                        this.setState({errors:false});
                        this.setState({payment:params});

                        /*if(this.props.cart?.products) {
                            paymentComplete(this.props.cart.products,{
                                id:params.x_reference,
                                revenue:params.x_amount
                            });
                        }*/

                    }

                    if (this.state.payment.RESPONSETEXT.toUpperCase() === 'APPROVAL') {
                        store.dispatch(clearCart(this.state.isMerchant));
                    }

                }).catch(error=>{
                    console.error(error);
                    let errors = error.response ? (error.response.data ? error.response.data : error.response.statusText ) : error;
                    this.setState({errors:(errors.errors ? errors.errors : (errors.name ? errors.name : errors))})
                    store.dispatch(clearCart(this.state.isMerchant));
                })
            }else{
                this.setState({errors:params.x_result})
            }

        }

    }

    checkIsMerchant() {
        let formDataString = localStorage.getItem('last-payment-form-data');
        let formData = JSON.parse(formDataString);

        if (formData && formData.hasOwnProperty('isMerchant')) {
            // 'isMerchant' property exists in the formData object
            // You can access its value like this: formData.isMerchant
            console.log('isMerchant exists and its value is:', formData.isMerchant);
            this.setState({isMerchant: true});
        } else {
            // 'isMerchant' property does not exist or formData is not a valid JSON object
            console.log('isMerchant does not exist or formData is invalid.');
        }
    }

    tryPaymentAgain() {
        let formDataString = localStorage.getItem('last-payment-form-data');
        let formData = JSON.parse(formDataString)
        postAction(process.env.REACT_APP_PAYMENT_URL, formData, 'post');
    }

    render() {
        return (
            <main>
                <section>
                    <div className="container">
                        <div className="row">
                            <div className="success-checkout-wrapper col-lg-4 col-md-4 col-sm-4 col-12">
                                {this.state.payment ?
                                    <div className="success-checkout">
                                        <WebpImage src={this.state.payment.RESPONSETEXT.toUpperCase() === 'APPROVAL' ? '/images/thumb-up.svg' : '/images/smile-icon.svg'} />
                                        <h1>{this.state.payment.RESPONSETEXT.toUpperCase() === 'APPROVAL' ? 'Order completed!' : 'The payment was declined!'}</h1>
                                        <p>{this.state.payment.RESPONSETEXT.toUpperCase() === 'APPROVAL'
                                            ? 'Our team have already started processing the order. You will receive an email with details shortly.'
                                            : 'Sorry, your payment was declined, but your cart has been saved to your account, please select an option below.'}
                                        </p>
                                            <p>
                                            <Link className={'btn btn-outline-primary'} to={'/account-information'}>
                                                Go to my Account
                                            </Link>
                                        </p>
                                        {this.state.payment.RESPONSETEXT.toUpperCase() !== 'APPROVAL' &&
                                            <p>
                                                <button className={'btn btn-outline-primary'} onClick={this.tryPaymentAgain}>Try Again</button>
                                            </p>
                                        }
                                            <p>
                                                <Link className="btn btn-outline-success" to={"/"}>Continue Shopping
                                                </Link>
                                            </p>
                                    </div>
                                    :''}

                            </div>
                        </div>
                        <FormErrors formErrors={this.state.errors}/>
                    </div>
                </section>
            </main>
        )
    }
}

OrderComplete.propTypes = {
    cart: PropTypes.object.isRequired,
    customer: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    customer: state.auth.customer,
    isCustomerAuthenticated: state.auth.isCustomerAuthenticated,
    cart: state.cart,
    saved_cards:state.auth.saved_cards
});
export default connect(mapStateToProps)(withRouter(OrderComplete));
