import React, {Component} from "react";
import {store} from "../../../../store";
import {formSubmit} from "../../../../actions/init";
import {clearCart} from "../../../../actions/cart";
import {toogleLoginModal} from "../../../../actions/init";
import {connect} from "react-redux";
import Modal from "react-responsive-modal";
import {isMobile} from 'react-device-detect';
import {withRouter} from "react-router-dom";
import SelectMap from "../../../../admin/views/Base/Forms/SelectMap";

const VANITIES_ID = 45;

class SaveExistingCartButton extends Component {

    state = {
        project_id:false,
        modalOpen: false,
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
        let self = this;
        let apiUrl = process.env.REACT_APP_SERVER_URL+process.env.REACT_APP_API_SERVER_URL+'/orders/customer/updateOrderProduct/'+this.state.project_id;

        let products = this.props.cart.products.filter(product => product.category_id !== VANITIES_ID);

        let initialData = {
            products:products,
        };

        store.dispatch(formSubmit(false,'put',initialData,apiUrl)).then(res=>{
            if(res.data && res.data.errors){
                self.setState({
                    errors:res.data.errors
                });
                console.log('errors', res.data.errors)
            }else{
                store.dispatch(clearCart());
                self.props.history.push({
                    pathname: "/account-information",
                    hash:'saved-cart'
                })
            }

        }).catch(error=>{
            let errors = (error.response ? (error.response.data ? error.response.data : error.response ) : error);
            this.setState({errors:(errors.errors ? errors.errors : errors)})
        });

        return;
    }


    render() {
        return <React.Fragment>
            <a className={isMobile ? 'save-for-later-btn' : "link loginToogle saveCart save-cart-btn"} onClick={e=>this.saveCartModal(e)}>
                Save to Existing Project
            </a>
            <Modal open={this.state.modalOpen} onClose={e=>this.onCloseModal(e)} center
                   styles={{
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
                    <h2 className={'dont-close-cart'}>Saved Carts</h2>
                    <div className={'form-group dont-close-cart'}>
                        {(this.props.saved_carts && this.props.saved_carts.rows && this.props.saved_carts.rows.length>0) ?
                            <SelectMap
                                className={'dont-close-cart'}
                                required={true}
                                name={'project_id'}
                                label={"Project Name"}
                                readOnly={false}
                                data={ this.props.saved_carts.rows.map((item) => {
                                        let obj = {};
                                        obj['id'] = item.id;
                                        obj['name'] = item.project_name;
                                        return obj;
                                })}
                                onChange={e=>this.setState({project_id: parseInt(e.target.value)})}
                            /> : ''
                        }
                    </div>
                    <button className={"link mx-auto saveCart dont-close-cart"} type={'submit'} onClick={e=>this.saveCart(e)}>Save</button>
                    <button className={"link mx-auto saveCart close-modal dont-close-cart"} onClick={e=>this.onCloseModal(e)}>Cancel</button>
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

export default connect(mapStateToProps)(withRouter(SaveExistingCartButton));
