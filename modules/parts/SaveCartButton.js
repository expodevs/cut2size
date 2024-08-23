import React, {Component} from "react";
import {formatPrice} from "../../../../functions/frontend";
import {store} from "../../../../store";
import {formSubmit, toogleLoginModal} from "../../../../actions/init";
import {clearCart, setAdminSavedCart} from "../../../../actions/cart";
import {connect} from "react-redux";
import Modal from "react-responsive-modal";
import {isMobile} from 'react-device-detect';
import {withRouter} from "react-router-dom";

const VANITIES_ID = 45;

class SaveCartButton extends Component {

    state = {
        modalOpen:false,
        project_name:'',
    };

    goToSign(e){
        e.preventDefault();
        store.dispatch(toogleLoginModal(true));
        if(typeof window !== 'undefined'){
            window.scrollTo(0, 0);
        }
    }

    saveCartModal=(e)=>{
        e.preventDefault();
        if(!this.props.isCustomerAuthenticated && !this.props.cart.adminSavedCardCreate){
            return this.goToSign(e);
        }
        this.setState({modalOpen: true });
    };

    onCloseModal = (e) => {
        this.setState({modalOpen: false });
    };

    saveCart(e){

        let target = e.target;
        e.preventDefault();
        target.disabled=true;
        this.props.setSubmitButtonDisable(true);
        this.props.setProceedPaymentButtonDisable(true);
        let initialData = {};
        let totalWithoutGst = parseFloat(this.props.cart.total)
        let gst = parseFloat(totalWithoutGst)*this.props.cart.gst/100;
        let totalWithGst = totalWithoutGst+gst;

        initialData.currency_id = this.props.currentCurrency.id;
        initialData.customer = this.props.customer;
        initialData.products = this.props.cart.products;

        if (!this.props.miniCart) {
            if (this.props.merchant) {
                initialData.products = this.props.cart.products.filter(product => product.category_id === VANITIES_ID);
            } else {
                initialData.products = this.props.cart.products.filter(product => product.category_id !== VANITIES_ID);
            }
        }

        initialData.project_name = this.state.project_name;
        initialData.saved_cart =true;
        initialData.adminSavedCardCreate =this.props.cart.adminSavedCardCreate;
        initialData.subtotal_price =formatPrice(totalWithoutGst,false,false,false,false);
        initialData.shipping_price =formatPrice(0,false,false,false,false);
        initialData.total_price =formatPrice(totalWithGst,false,false,false,false);
        let url = process.env.REACT_APP_SERVER_URL+process.env.REACT_APP_API_SERVER_URL+'/orders/customer';
        store.dispatch(formSubmit(false,'put',initialData,url)).then(res=>{
            target.disabled=false;
            if(res.data.errors){
                this.setState({errors:res.data.errors});
                this.props.setSubmitButtonDisable(false);
                this.props.setProceedPaymentButtonDisable(false);
            }else{
                let success = [];
                if(res.data && res.data.result &&  res.data.result.length>0){
                    res.data.result.forEach(function (item) {
                        success.push(item);
                    })
                }

                this.setState({success: success});
                this.props.setSubmitButtonDisable(false);
                this.props.setProceedPaymentButtonDisable(false);

                let self = this;
                if(res.data.order){
                    if(this.props.cart.adminSavedCardCreate){
                        store.dispatch(clearCart());
                        setTimeout(function () {

                            store.dispatch(setAdminSavedCart(false));
                            self.props.history.push({
                                pathname: "/admin",
                                hash:'orders/savedCartEdit/'+res.data.order.id
                            });
                        },500);

                    }else{
                        setTimeout(function () {

                            store.dispatch(clearCart());
                            self.props.history.push({
                                pathname: "/account-information",
                                hash:'saved-cart'

                            })
                        },500);
                    }
                }


            }
            e.target.disabled=false

        }).catch(error=>{
            this.props.setSubmitButtonDisable(false);
            this.props.setProceedPaymentButtonDisable(false);
            let errors = (error.response ? (error.response.data ? error.response.data : error.response ) : error);
            this.setState({errors:(errors.errors ? errors.errors : errors)})
            target.disabled=false
        });
    }

    render() {

        let desktopButtonText = this.props.buttonText ? this.props.buttonText : 'Save as New Project';

        return <React.Fragment>
            {(!isMobile) ?

                <a className="link loginToogle saveCart save-cart-btn" disabled={this.submitButtonDisable} onClick={e=> this.saveCartModal(e, 'modalOpen')}>
                    {this.props.submitButtonDisable ? 'Loading...' : desktopButtonText}
                </a>
                : <button className="save-for-later-btn" onClick={e=> this.saveCartModal(e, 'modalOpen')}>{this.props.buttonText ? this.props.buttonText : 'Save project'}</button>
            }
            <Modal open={this.state.modalOpen} onClose={e=>this.onCloseModal(e, 'modalOpen')} center
                   styles={{
                       overlay:{
                           // zIndex: 9999
                       },
                       modal:{
                           maxWidth: "1200px"
                       },
                       "modal-body":{
                           marginTop:"10%"
                       }
                   }}
                  classNames={{
                      overlay : 'dont-close-cart',
                  }}
                  showCloseIcon={false}
            >
                <div className="modal-body dont-close-cart">
                    <h2 className={'dont-close-cart'}>Project name</h2>
                    <div className={'form-group dont-close-cart'}>
                        <input type="text" onChange={e=>this.setState({project_name:e.target.value})} className="form-control dont-close-cart" name={'project-name'} value={this.state.project_name}/>
                    </div>
                    <button className={"link mx-auto saveCart dont-close-cart"} type={'submit'} onClick={e=>this.saveCart(e)}>Save</button>
                    <button className={"link mx-auto saveCart close-modal dont-close-cart"} onClick={e=>this.onCloseModal(e, 'modalOpen')}>Cancel</button>
                </div>
            </Modal>
        </React.Fragment>
    }
}

const mapStateToProps = (state) => ({
    customer: state.auth.customer,
    currentCurrency: state.currency.currentCurrency,
    isCustomerAuthenticated: state.auth.isCustomerAuthenticated,
    cart: state.cart,
});

export default connect(mapStateToProps)(withRouter(SaveCartButton));
