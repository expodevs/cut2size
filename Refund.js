import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import Breadcrumbs from "./modules/breadcrumbs";
import {getInfo} from "../../actions/admin";
import {store} from "../../store";
import {withRouter} from "react-router-dom";
import {toogleLoginModal} from "../../actions/init";
import {formatName} from "../../functions/frontend";


const currencySymbol = process.env.REACT_APP_PAYMENT_CURRENCY_SYMBOL;

class Refund extends Component {

    state={
        errors:false,
        submitButtonDisable:false,
        formSavedCard:false,
        refundAmount:false,
        paymentInfo:{},
        loading:false
    };

    constructor(props){
        super(props);
        this.formRef = React.createRef();

    }

    componentDidMount() {

        if(!this.props.match.params.id){
            alert('No order id specified');
        }
        if(!this.props.auth.isCustomerAuthenticated){
            store.dispatch(toogleLoginModal(true));
            if(typeof window !== 'undefined'){
                window.scrollTo(0, 0);
            }
        }else{
            this.getRefundInfo();
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.auth.isCustomerAuthenticated && !prevProps.auth.isCustomerAuthenticated){
            this.getRefundInfo();
        }
    }

    getRefundInfo=()=>{
        this.setState({loading:true});
        let self = this;
        store.dispatch(getInfo(process.env.REACT_APP_API_SERVER_URL+'/orders/customer/get-refund/'+this.props.match.params.id))
            .then(result=>{
                if(result && result.refund){
                    this.setState({
                        refundAmount: result.amount
                    })
                }
                if(result  && result.paymentInfo){
                    this.setState({
                        paymentInfo: result.paymentInfo
                    },()=>{

                        const form = self.formRef.current;
                        if(form){
                            form.submit();
                        }
                    })
                }

                if(result && result.errors) {
                    this.setState({
                        errors :JSON.stringify(result.errors)
                    })
                }
                this.setState({loading:false});
            }).catch(err=>{
                console.log(err);
                this.setState({loading:false});
            });
    };


    render() {


        return (
            <main>
                <section className="no-padding-bottom">
                    <Breadcrumbs
                        list={
                            [
                                {
                                    name: 'Refund Page',
                                }
                            ]
                        }
                    />
                </section>
                <section className="no-padding-top">
                    <div className="container">
                        <div className="row">
                            <div className="shopping-cart col-12">
                                <h1 className="cart-title">{formatName(this.props.match.params.type)}</h1>
                                <div className="checkout-form">
                                    {(!this.props.auth.isCustomerAuthenticated) ?
                                        <p className="text-center">Please sign in to get refund!</p>
                                        :
                                        this.props.match.params.type==='refund' ?
                                            (this.state.refundAmount ?
                                            <p className="text-center alert alert-success">You received a refund of: {currencySymbol}{this.state.refundAmount}</p>
                                                :
                                            this.state.errors &&
                                                <p className="text-center alert alert-danger">{this.state.errors}}</p>
                                            )
                                            :
                                            <form  id="checkoutForm"  action={ process.env.REACT_APP_PAYMENT_URL} method="post" ref={this.formRef}>
                                                <input type="hidden" name="TERMINALID" value={process.env.REACT_APP_PAYMENT_TERMINALID} />
                                                <input type="hidden" name="ORDERID" value={this.state.paymentInfo.orderId} />
                                                <input type="hidden" name="CURRENCY" value={ process.env.REACT_APP_PAYMENT_CURRENCY} />
                                                <input type="hidden" name="AMOUNT" value={this.state.paymentInfo.amount} />
                                                <input type="hidden" name="RECEIPTPAGEURL" value={ process.env.REACT_APP_SERVER_URL+'/cart/checkout/success?extra_payment=true'} />
                                                <input type="hidden" name="DATETIME" value={this.state.paymentInfo.date} />
                                                <input type="hidden" name="HASH" value={this.state.paymentInfo.hash} />
                                                {/*<input type="hidden" name="STOREDCREDENTIALUSE" value="UNSCHEDULED" />*/}
                                                <button type="submit" className="hidden">Submit</button>
                                            </form>
                                            //     :
                                            // <button className="btn btn-success mx-auto d-block" onClick={e=>this.getRefundInfo(e)}>
                                            //     {(this.props.match.params.type==='refund') ? 'Get Refund' : 'Pay extra payment'}
                                            // </button>


                                    }
                                    {this.state.loading &&
                                        <div className="spinner-border text-primary mx-auto d-block" role="status">
                                            <span className="sr-only">Loading...</span>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        )
    }
}


Refund.propTypes = {
    customer: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    customer: state.auth.customer,
    cart: state.cart,
    auth: state.auth,
});
export default withRouter(connect(mapStateToProps)(Refund));
