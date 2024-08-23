import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {store} from "../../store";
import Total from "./modules/checkout/Total";
import {formSubmit, setNotification} from "../../actions/init";
import FormErrors from "./modules/FormErrors";
import FormSuccess from "./modules/FormSuccess";
import axios from "axios";
import Discount from "./modules/checkout/Discount";
import {checkIsAdmin} from "../../actions/admin";
import WebpImage from "./modules/parts/WebpImage";
import {Link} from "react-router-dom";
import {getShipping} from "../../actions/cart";
import {onCheckoutDataLayer} from "../../functions/dataLayer";
import {setGtmEvent} from "../../functions/GtmDataLayer";


const ApiUrl = process.env.REACT_APP_SERVER_URL;
const ApiServer = process.env.REACT_APP_API_SERVER_URL;


class Payment extends Component {


    constructor(props) {
        super(props);
        this.state={
            success:false,
            errors:false,
            submitButtonDisable:false,
            formSavedCard:false,
            paymentShipping:false,
            project_name:false,
            payBrightModalOpen:false,
            order:props.order ? props.order : false
        }
    }

    setPaymentShipping=(value)=>{
        this.setState({
            paymentShipping:value
        });
    };

    setProjectName=(value)=>{
        this.setState({
            project_name:value
        });
    };


    saveProjectName = () => {
        let url = ApiUrl+ApiServer+'/orders/save-project-name/'+this.state.order.id;
        let data = {
            name:this.state.project_name
        };
        axios.put(url, data).then(res => {
            if(res.data && res.data.success){
                store.dispatch(setNotification( res.data.success, 'success', 5000));
            }
        });
    }


    setShippingPrice=()=>{

        return  axios.put(ApiUrl+ApiServer+'/orders/customer/set-shipping-price/'+this.props.state.order.id,{
            shipping_price : this.state.paymentShipping ? this.state.paymentShipping.amount : false,
            shipping_provider : this.state.paymentShipping ? this.state.paymentShipping.providerSlug : false,
        }).then(result=>{
            if(result&&result.data && result.data.order){
                this.setState({
                    order:result.data.order
                },()=>{
                    return true
                });
                return true
            }else{
                return true
            }
        }).catch(err => {
            console.log('error');
            console.log(err.response);
            this.setState({
                success:(err.response && err.response.data&& err.response.data.success) ?  [{message:err.response.data.success }] : false,
                errors:(err.response && err.response.data&& err.response.data.error) ?  [{message:err.response.data.error }] : false
            });
            return false ;

        });
    };

    onCloseErrorsModal = () => {
        this.setState({ errors: false });
    };



    beforeCheckout = ()=>{
        console.log('beforeCheckout');
        this.setState({
            submitButtonDisable:true
        })

        return new Promise(((resolve, reject) => {
            if((!this.state.paymentShipping  || isNaN(this.state.paymentShipping.amount) )&& !this.state.paymentShipping.error && !this.props.merchant){
                this.setState({
                    errors:[{message:'Please choose shipping method'}]
                });
                return reject(false)

            }

            if (this.state.project_name && this.state.project_name !== '') {
                this.saveProjectName();
            } else {
                this.setState({
                    errors:[{message:'Please fill Project PO'}]
                });
                return reject(false);
            }

            return this.setShippingPrice().then(res=>{
                console.log('resresres',res);
                if(res){
                    return resolve(false)

                    // return axios.get(ApiUrl+ApiServer+'/orders/getMerchantCard')
                    //     .then(res => {
                    //         return res.data
                    //     })
                }
            }).catch(err => {
                console.log('error');
                console.log(err);
                return reject(false)
            });
        }))


    }

    checkout(e){
        e.preventDefault();
        let form = e.target;
        this.beforeCheckout().then(result=>{
            /*onCheckoutDataLayer(3,'proceed_to_payment',this.props.cart.products);*/

            this.setState({
                submitButtonDisable:false
            });

            let formData = new FormData(form);
            const entries = formData.entries(); // получаем итератор пар ключ-значение

            const data = Array.from(entries).reduce((acc, [key, value]) => {
                acc[key] = value;
                return acc;
            }, {});

            let formDataString = JSON.stringify(data);

            localStorage.setItem('last-payment-form-data', formDataString);

            setGtmEvent('add_shipping_info', this.props.cart.products, this.state.paymentShipping.provider);

            form.submit();
        }).catch(err => {
            console.log('error');
            console.log(err);
            this.setState({
                submitButtonDisable:false
            })
            return false ;
        });
    };



    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.order.subtotal_price!==this.props.order.subtotal_price){
            this.setState({order:this.props.order})
        }
    }

    setDiscountCode=(e,discount_code)=>{
        e.preventDefault();
        store.dispatch(formSubmit(false,'PUT',{
            discount_code:discount_code,
        },ApiUrl+ApiServer+'/orders/setDiscountCode/'+this.props.state.order.id)).then(result=>{
            if(result.data.order){
                this.props.setOrder(result.data.order)
                this.setState({
                    order:result.data.order
                },()=>{
                    store.dispatch(getShipping(result.data.order))
                })


            }

            this.setState({
                errors:false,
                success:false,
            },()=>{
                this.setState({
                    errors:result.data.errors,
                    success:result.data.success,
                });
            });

        });
    };



    sendPayBright=(e)=>{
        e.preventDefault();

        this.beforeCheckout().then(result=>{
            store.dispatch(formSubmit(false,'POST',{

            },ApiUrl+ApiServer+'/orders/send-paybright-transaction/'+this.props.state.order.id)).then(result=>{
                this.setState({
                    submitButtonDisable:false
                })
                if(result && result.data && result.data.success){
                    window.open(`${result.data.success}`,"_blank")
                }
                /*onCheckoutDataLayer(3,'proceed_to_payment',this.props.cart.products);*/

            })
        }).catch(err => {
            console.log('error');
            console.log(err);
            this.setState({
                submitButtonDisable:false
            })
            return false ;
        });


    };

    render() {

        return (
            <PaymentForm
                errors={this.props.errors || this.state.errors}
                success={this.props.success || this.state.success}
                location={this.props.location}
                cart={this.props.cart}
                submitButtonDisable={this.state.submitButtonDisable}
                order={this.state.order ? this.state.order : false}
                email={this.props.customer ? this.props.customer.email : false}
                onSubmit={this.checkout.bind(this)}
                setDiscountCode={this.setDiscountCode.bind(this)}
                formSavedCard={this.state.formSavedCard}
                setPaymentShipping={this.setPaymentShipping.bind(this)}
                setProjectName={this.setProjectName.bind(this)}
                sendPayBright={this.sendPayBright.bind(this)}
                onCloseErrorsModal={this.onCloseErrorsModal.bind(this)}
                total={this.props.total}
                merchant={this.props.merchant}
            />

        )
    }
}


export class PaymentForm extends React.Component {
    render() {
        let orderId =  this.props.order ? this.props.order.id : false;
        let terminalId = process.env.REACT_APP_PAYMENT_TERMINALID;
        let amount = this.props.order ? this.props.order.total_price : false;
        let date =  this.props.order ? this.props.order.date: false;
        let receiptPage = process.env.REACT_APP_SERVER_URL+'/cart/checkout/success';
        let hash =  this.props.order ? this.props.order.hash : false;
        let email = this.props.email;
        console.log('this.props.submitButtonDisabl',this.props.submitButtonDisable)


        return (
            orderId?
                <form  id="paymentForm"  action={ process.env.REACT_APP_PAYMENT_URL} method="post" onSubmit={e=>this.props.onSubmit(e)}>
                    <input type="hidden" name="TERMINALID" value={terminalId} />
                    <input type="hidden" name="ORDERID" value={orderId} />
                    <input type="hidden" name="CURRENCY" value={ process.env.REACT_APP_PAYMENT_CURRENCY} />
                    <input type="hidden" name="AMOUNT" value={amount} />
                    <input type="hidden" name="RECEIPTPAGEURL" value={receiptPage} />
                    <input type="hidden" name="DATETIME" value={date} />
                    <input type="hidden" name="HASH" value={hash} />

                    {email &&
                        <input type="hidden" name="EMAIL" value={email} />
                    }

                    {/*<input type="hidden" name="STOREDCREDENTIALUSE" value="UNSCHEDULED" />*/}

                    {(this.props.formSavedCard && Object.keys(this.props.formSavedCard).length) &&
                        Object.keys(this.props.formSavedCard).map((formKey,index)=> {
                            return(
                                // formKey!=='HASH'
                                // && formKey!=='CARDEXPIRY'
                                 formKey==='SECURECARDMERCHANTREF'
                                || formKey==='CARDHOLDERNAME'
                                // || formKey==='CARDTYPE'
                            ) &&  <input key={index} type="hidden" name={formKey}
                                          value={this.props.formSavedCard[formKey]}/>
                        })
                    }
                    <div className="row justify-content-between">
                        <div className="field-group col-12">
                            <div className="total-information no-margin-padding-border">
                                <div className="total-price">
                                    <p className="price">Project PO (Purchase Order/Project Name):
                                        <span><input type="text"  onChange={e=>this.props.setProjectName(e.target.value)} className={"form-control"} name={"project_name"}/></span>
                                    </p>
                                </div>
                                <Total
                                    totalRef={this.totalRef}
                                    total={this.props.total}
                                    shipping={process.env.REACT_APP_SHIPPING_PRICE}
                                    order={this.props.order}
                                    setPaymentShipping={this.props.setPaymentShipping}
                                    merchant={this.props.merchant}
                                />
                                <Discount
                                    order={this.props.order}
                                    setDiscountCode={this.props.setDiscountCode}
                                />
                                <div className="pay-button">
                                    <button  className="pay" type="submit" disabled={this.props.submitButtonDisable} >Proceed to Payment</button>
                                </div>
                                <div className="pay-button paybright-btn">
                                    <button  className="pay" onClick={(e)=>this.props.sendPayBright(e)} disabled={this.props.submitButtonDisable} >
                                        <span>Buy now pay later with</span>
                                        <WebpImage src={'/images/paybright_logo.svg'}  />
                                    </button>
                                </div>
                                <div className="pay-button learn-more-link">
                                    <a href={'https://paybright.com/en/how-it-works/'} target="_blank" rel="noindex,nofollow">Learn More</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <FormErrors onCloseModal={this.props.onCloseErrorsModal} formErrors={this.props.errors}/>
                    <FormSuccess success={this.props.success}/>

                </form>
            : ''

        );

    }
}

Payment.propTypes = {
    customer: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    customer: state.auth.customer,
    cart: state.cart,
});
export default connect(mapStateToProps)(Payment);
