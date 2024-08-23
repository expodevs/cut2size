import React, {Component} from 'react';


import AccountSettings from "./modules/account/AccountSettings";
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {store} from "../../store";
import {getInfo} from "../../actions/admin";
import Total from "./modules/checkout/Total";
import {formSubmit} from "../../actions/init";
import FormErrors from "./modules/FormErrors";
import FormSuccess from "./modules/FormSuccess";
import Breadcrumbs from "./modules/breadcrumbs";
import jwt_decode from "jwt-decode";
import {getAccountInfo, login, register, setCurrentCustomer, setPreviousUrl} from "../../actions/authentication";
import setAuthToken from "../../setAuthToken";
import RouteHelper from "../../RouteHelper";
import Tabs from "./modules/parts/Tabs";
import Payment from "./Payment";
import RegisterForm from "./modules/account/RegisterForm";
import LoginForm from "./modules/account/LoginForm";
import {isMobile} from 'react-device-detect';
import WebpImage from "./modules/parts/WebpImage";
import {setGtmEvent} from "../../functions/GtmDataLayer";

const VANITIES_ID = 45;

class Checkout extends Component {


    state={
        account:false,
        errors:false,
        edit: true,
        passwordType:'password',
        shipping:false,
        submitButtonDisable:false,
        proceedPaymentButtonDisable:false,
        order: false,
        shippingOptions: false,
        orderTotal: false,
        loading: true,
        merchant: false,
        vanities_shipping_price: false,
    };


    async componentDidMount() {

        const params = new URLSearchParams(window.location.search);
        const merchant = params.get('vanities');

        console.log('merchant', merchant);
        this.setState({merchant: merchant});


        this.getAccountInfo();
        await this.getOrderInfo();

        if (this.props.location.state && this.props.location.state.order) {
            let cart_products = this.props.location.state.order.order_products;

            let total = 0;

            cart_products.map((product, index) => {
                total+=(product.price_new? product.price_new : product.price)*product.quantity;
            });

            if (this.props.location.state.order.order_services) {
                let cart_services = this.props.location.state.order.order_services;
                cart_services.map(($service, index) => {
                    total+=$service.amount;
                });
            }

            this.setOrder(this.props.location.state.order);
            this.setState({orderTotal:total});
            this.setState({shippingOptions:true});
        }

        if((!this.props.cart.products || this.props.cart.products.length<1) && !this.props?.location?.state?.order){
            // this.props.history.push('/cart');
        }


        this.getVanitiesShippingPrice();

       /* onCheckoutDataLayer(1,'checkout_page',this.props.cart.products)*/
        setGtmEvent('begin_checkout', this.props.cart.products);

        this.setState({loading:false});

    }

    async getVanitiesShippingPrice() {

        let apiUrl = process.env.REACT_APP_API_SERVER_URL + '/settings/vanities_shipping_price';

        const requestOptions = {
            method: 'get',
            headers: {
                'enctype': 'multipart/form-data',
            },
        };

        try {
            const response = await fetch(apiUrl, requestOptions);
            if (response.ok) {
                const data = await response.json();
                console.log('merchant shipping setting', data);
                this.setState({vanities_shipping_price: data.value});
            } else {
                console.error('error');
            }
        } catch (error) {
            console.error('error:', error);
        }

    }


    componentWillReceiveProps(nextProps, nextContext) {

        if(this.props.customer.id !== nextProps.customer.id){
            this.getAccountInfo(nextProps.customer.id);
        }
    }



    getAccountInfo(id){

        let customerId = id ? id : this.props.customer.id;
        if(customerId){
            store.dispatch(
                getInfo('/customers/'+customerId))
                .then(res=>{
                    if(res && res.errors){
                        this.setState({errors:res.errors})
                    }else{
                        this.setState({account:res});
                    }
                })
                .catch(error=>{
                    this.setState({errors:error})
                });
        }
        const params = new URLSearchParams(window.location.search);
        let token = params.get('token');
        if(!this.props.customer?.id && token){
            token = `Bearer ${token}`;
            setAuthToken(token);
            localStorage.setItem('customerToken', token);
            const decoded = jwt_decode(token);
            store.dispatch(getAccountInfo({customer:decoded}));
            store.dispatch(setCurrentCustomer(decoded));
        }

    }

    async getOrderInfo(){
        const params = new URLSearchParams(window.location.search);
        const orderId = params.get('orderId');

        if(orderId && this.props.customer.id){
                return store.dispatch(
                    getInfo(process.env.REACT_APP_API_SERVER_URL+'/orders/customer/'+orderId))
                    .then(res=>{
                        if(res && res.errors){
                            this.setState({errors:res.errors})
                        }else{
                            let order = res;
                            let cart_products = order.order_products;
                            let total = 0;
                            cart_products.map((product, index) => {
                                total+=(product.price_new? product.price_new : product.price)*product.quantity;
                            });
                            this.setOrder(order);
                            this.setState({orderTotal:total});
                            this.setState({shippingOptions:true});
                            return true;
                        }
                    })
                    .catch(error=>{
                        this.setState({errors:error});
                        return false;

                    });
        }
    }

    changeEdit(e, type){
        e.preventDefault();
        this.setState({edit: this.state.edit})
    }
    changeShipping(e ){
        this.setState({shipping: !this.state.shipping})
    }
    checkout(e,type){
        e.preventDefault();
        let self = this;
        this.setState({proceedPaymentButtonDisable: true});
        let initialData = {};
        initialData.currency_id = this.props.currentCurrency.id;
        initialData.customer = this.props.customer;
        initialData.products = this.props.cart.products;

        if (this.state.merchant) {
            let merchantProducts = this.props.cart.products.filter(product => product.category_id  === VANITIES_ID);
            initialData.products = merchantProducts;
            initialData.shipping_provider = 'MERCHANT_FIXED';
            initialData.shipping_price = merchantProducts.reduce((total, product) => total + (this.state.vanities_shipping_price * product.quantity), 0);
        } else {
            initialData.products = this.props.cart.products.filter(product => product.category_id !== VANITIES_ID);
        }

        initialData.receipt_page = process.env.REACT_APP_SERVER_URL+'/cart/checkout/success';
        store.dispatch(formSubmit(e,'put',initialData)).then(res=>{
            console.log('res', res)
            if(res.data.errors){
                this.setState({errors:res.data.errors});
                this.setState({submitButtonDisable: false});
                this.setState({proceedPaymentButtonDisable: false});
            }else{
                let success = [];
                if(res.data && res.data.result &&  res.data.result.length>0){
                    res.data.result.forEach(function (item) {
                        if(item.login){
                            if(item.login.token){
                                const { token } = item.login;
                                localStorage.setItem('customerToken', token);
                                const decoded = jwt_decode(token);

                                store.dispatch(setCurrentCustomer(decoded));
                            }

                        }else{
                            success.push(item);
                        }
                    })
                }
                /*onCheckoutDataLayer(2,'get_shipping_options',this.props.cart.products);*/

                this.setState({success:success});
                this.setState({errors:false});
                this.setState({proceedPaymentButtonDisable: false});
                this.setState({edit: false});

                if(res.data.order && res.data.payment){
                    let order  =res.data.order;
                    order.hash = res.data.payment.hash;
                    order.date = res.data.payment.date;
                    self.setState({submitButtonDisable: false});
                    self.setState({shippingOptions: true});
                    self.setState({order: order});
                }


            }

        }).catch(error=>{
            this.setState({submitButtonDisable: false});
            this.setState({proceedPaymentButtonDisable: false});
            let errors = (error.response ? (error.response.data ? error.response.data : error.response ) : error);
            this.setState({errors:(errors.errors ? errors.errors : errors)})
        });

    }


    setResponces(success, errors){
        this.setState({success:success});
        this.setState({errors:errors});
    }
    setPassType(e,type){
        e.preventDefault();
        this.state[type]==='password' ? this.setState({[type]:'text'}): this.setState({[type]:'password'})
    }


    login (e){
        e.preventDefault();
        this.setState({errors:false});
        this.setState({success:false});
        this.setState({submitButtonDisable: true});
        store.dispatch(formSubmit(e,'post')).then(res=>{
            this.setState({submitButtonDisable: false});
            if(res.data.errors){
                this.setState({errors:res.data.errors})
            }else{

                const { token } = res.data;
                localStorage.setItem('customerToken', token);
                const decoded = jwt_decode(token);
                setAuthToken(token);
                store.dispatch(setCurrentCustomer(decoded));


            }

        }).catch(error=>{
            console.log('error',error.response);
            console.log('error',error.message);
            this.setState({submitButtonDisable: false});
            this.setState({errors:
                    ((error.response && error.response.data) ? error.response.data.errors :
                        (error.message ? error.message :error)
                    )
                })

        });
    }

    createAccount (e){
        e.preventDefault();
        store.dispatch(register(e,false,this.props,this.setState.bind(this)))

    }

    setPreviousUrl=(e)=>{
        // e.preventDefault();
        let previousUrl = this.props.history.location.pathname+this.props.history.location.hash;
        store.dispatch(setPreviousUrl(previousUrl));

    };

    signIn (e){
        e.preventDefault();
        store.dispatch(login(e,false,this.props,this.setState.bind(this)))

    }


    onCloseErrorsModal = () => {
        this.setState({ errors: false });
    };

    formatDataForTabs=()=>{
        return [
            {
                name:"Login",
                content:
                    <div className="login-form not-modal">
                        <LoginForm
                            passwordType={this.state.passwordType}
                            submitButtonDisable={this.state.submitButtonDisable}
                            setPassType={this.setPassType.bind(this)}
                            setState={this.setState.bind(this)}
                            login={this.signIn.bind(this)}
                        />
                        <FormErrors onCloseModal={this.onCloseErrorsModal.bind(this)} formErrors={this.state.errors}/>
                    </div>

            },
            {
                name:"Sign Up",
                content:
                    <div className="login-form not-modal">
                        <RegisterForm
                            passwordType={this.state.passwordType}
                            repasswordType={this.state.repasswordType}
                            submitButtonDisable={this.state.submitButtonDisable}
                            setPassType={this.setPassType.bind(this)}
                            setState={this.setState.bind(this)}
                            createAccount={this.createAccount.bind(this)}
                            setPreviousUrl={this.setPreviousUrl.bind(this)}
                        />
                        {this.state.success? <div  className={'alert alert-success '}>{this.state.success}</div>:''}
                    </div>

            },
        ]
    };

    setOrder=(order)=>{
        this.setState({
            order:order
        })
    };

    render() {


        console.log('cart', this.props.cart);

        let total = 0;
        if (this.props.cart.total) {
            let allProducts = this.props.cart.products;

            if (this.state.merchant) {
                let merchantProducts = allProducts ? allProducts.filter(product => product.category_id === VANITIES_ID) : null;
                total = allProducts ? (merchantProducts.reduce((total, product) => total + (product.price * product.quantity), 0)) : null;
            } else {
                let notMerchantProducts = allProducts ? allProducts.filter(product => product.category_id !== VANITIES_ID) : null;
                total = allProducts ? (notMerchantProducts.reduce((total, product) => total + (product.price * product.quantity), 0)) : null;
            }
        } else {
             total = this.state.orderTotal;
        }

        return (
            <main>
                <section className="no-padding-bottom checkout-page">
                    <Breadcrumbs
                        list={
                            [
                                {
                                    link: '/cart',
                                    name: 'Shopping Cart',
                                },
                                {
                                    name: 'Checkout',
                                }
                            ]
                        }
                    />
                </section>
                <section className="no-padding-top">
                    <div className="container">
                        <div className="row">
                            <div className="shopping-cart col-12">
                                <h1 className="cart-title">Checkout</h1>
                                <div className={"checkout-form" + (isMobile ? ' mobile' : '')}>

                                    {(this.props.customer && this.props.customer.id &&!this.state.loading)?
                                        <CheckoutForm
                                            state={this.state}
                                            customer = {this.props.customer ? this.props.customer : {}}
                                            changeEdit={this.changeEdit.bind(this)}
                                            changeShipping={this.changeShipping.bind(this)}
                                            saveAccountData={this.checkout.bind(this)}
                                            setResponces={this.setResponces.bind(this)}
                                            setOrder={this.setOrder.bind(this)}
                                            checkout={this.checkout.bind(this)}
                                            total={total}
                                            onCloseErrorsModal={this.onCloseErrorsModal.bind(this)}
                                            merchant={this.state.merchant}
                                        />
                                        :
                                    (!!this.state.loading ? 
                                        
                                        <div className="spinner-border text-primary mx-auto d-block" role="status">
                                            <span className="sr-only">Loading...</span>
                                        </div>
                                        : 
                                    
                                    <div className=" col-12">
                                        <Tabs data={ this.formatDataForTabs()}/>
                                    </div>)
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


export class CheckoutForm extends React.Component{
    state={
        showTerms:false
    };

    render(){

        console.log('shipping', this.props.state.shipping);

        return (
            <React.Fragment>
            <form id="checkoutForm" action={process.env.REACT_APP_SERVER_URL+process.env.REACT_APP_API_SERVER_URL+'/orders/customer'} method="post" onSubmit={e=>this.props.checkout(e)}>
                <div className="row justify-content-between">

                    <div className="account-content col-xl-12 col-lg-12 col-md-12 col-sm-12">
                        <AccountSettings
                            edit = {this.props.state.edit}
                            shipping = {this.props.state.shipping}
                            account = { this.props.state.account ? this.props.state.account : {}}
                            customer = {this.props.customer ? this.props.customer : {}}
                            changeEdit={this.props.changeEdit}
                            changeShipping={this.props.changeShipping}
                            saveAccountData={this.props.checkout}
                            setResponces={this.props.setResponces}
                            hideForm={true}
                            isCheckout={true}
                        />
                    </div>
                    <div className="field-group col-12">
                        <div className="total-information">
                            {!(this.props.state.shippingOptions && this.props.state.order) ?
                                <React.Fragment>
                                    <Total
                                        total={this.props.total}
                                        shipping={process.env.REACT_APP_SHIPPING_PRICE}
                                    />

                                    {this.state.showTerms &&
                                    <div className="row justify-content-end">
                                        <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12">
                                            <div className={'checkout-terms'}>
                                                <RouteHelper match={{
                                                    params: {
                                                        alias: 'terms-and-conditions'
                                                    }
                                                }}/>
                                            </div>

                                        </div>
                                    </div>
                                    }
                                    <div className="row justify-content-end">
                                        <div className="terms-confirm col-xl-4 col-lg-4 col-md-4 col-sm-12">
                                            <p className="save-as"><label><input type="checkbox" name={'confirm_terms'}
                                                                                 required={true}/><span
                                                className="save-text"> I've confirmed my order is correct and I understand that custom product orders CANNOT BE CHANGED once the order is placed and I agree to this website's
                                        <a href="javascript:void(0);" className="color-grey" onClick={e => {
                                            this.setState({showTerms: !this.state.showTerms})
                                        }}> terms and conditions. </a> <span
                                                    className="color-red">*</span></span></label></p>
                                        </div>
                                    </div>
                                    <div className="pay-button">
                                        <button className="pay" type="submit"
                                                disabled={this.props.state.proceedPaymentButtonDisable}>Get Shipping
                                            Options
                                        </button>
                                    </div>
                                </React.Fragment> : ''
                            }
                        </div>
                    </div>
                </div>
                <FormErrors onCloseModal={this.props.onCloseErrorsModal.bind(this)} formErrors={this.props.state.errors}/>
                <FormSuccess success={this.props.state.success}/>
            </form>
                {
                    (this.props.state.shippingOptions && this.props.state.order) ?
                        <Payment
                            total={this.props.total}
                            order={this.props.state.order}
                            state={this.props.state}
                            setOrder={this.props.setOrder}
                            merchant={this.props.merchant}

                        />
                        : ''
                }
                <div className={'card-image'}>
                    <WebpImage classImage={'paybright-logo'} src={'/images/paybright_logo.svg'} alt={''} />
                    <WebpImage src="/uploads/card-image.png" alt=""/>
                </div>
            </React.Fragment>
        );
    }
}


Checkout.propTypes = {
    customer: PropTypes.object.isRequired || PropTypes.boolean.isRequired
};

const mapStateToProps = (state) => ({
    customer: state.auth.customer,
    cart: state.cart,
    currentCurrency: state.currency.currentCurrency,
});
export default connect(mapStateToProps)(Checkout);
