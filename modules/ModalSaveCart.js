import React, {Component} from 'react';
import {Modal, ModalBody} from "reactstrap";
import {connect} from "react-redux";
import CartItem from "./cart/CartItem";
import SaveCartButton from "./parts/SaveCartButton";
import {store} from "../../../store";
import {clearCart} from "../../../actions/cart";

class ModalSaveCart extends Component {

    state = {
        isOpen: false,
    }

    componentDidMount() {
        let self = this;
        let products = this.props.cart.products;

        setTimeout(() => {
            document.addEventListener("mouseleave", function (e) {
                if (products && products.length > 0 && !localStorage.saveCartModal) {
                    self.setState({isOpen: true});
                    self.saveToStorage();
                }
            });
        }, 1000 * 60 * 2);
    }

    saveToStorage() {
        let now = Math.round((new Date()).getTime() / 1000);
        let time = 60 * 60;
        const item = {
            value: true,
            expire: now+time,
        }
        localStorage.setItem('saveCartModal', JSON.stringify(item));
    }

    modalClose() {
        this.setState({isOpen: false});
    }

    loseItems() {
        store.dispatch(clearCart());
        this.modalClose();
    }

    render() {
        let products = this.props.cart.products;
        return this.state.isOpen && products ?
            <Modal isOpen={this.state.isOpen} className="modal-dialog-save-cart col-lg-6 col-md-8 col-sm-6 col-6">
                <ModalBody>
                    <div className={'modal-wrapper row'}>
                        <div className="products col-lg-6 col-md-6 col-sm-6 col-6">
                            <div className={'products-selection-title'}>Your Selection</div>
                            <div className="products-list">
                                {this.props.cart.products.map((product,index)=>
                                    <CartItem key={index} product={product} minicart={true} isModal={true}/>
                                )}
                            </div>
                        </div>
                        <div className={'modal-text col-lg-6 col-md-6 col-sm-6 col-6'}>
                            <p className="modal-title">Save cart?</p>
                            <p className="modal-text-p">We noticed you left some items in your cart.</p>
                            <p className="modal-text-p">We will save them, so you can easily complete your order later.</p>
                            <div className="modal-buttons">
                                <a className={'btn close-modal'} onClick={this.loseItems.bind(this)}>Lose items</a>
                                <SaveCartButton
                                    setSubmitButtonDisable={this.props.setSubmitButtonDisable}
                                    setProceedPaymentButtonDisable={this.props.setProceedPaymentButtonDisable}
                                    submitButtonDisable={this.props.submitButtonDisable}
                                    proceedPaymentButtonDisable={this.props.proceedPaymentButtonDisable}
                                />
                                <a className={'btn btn-primary'} onClick={this.modalClose.bind(this)}>Continue shopping</a>
                            </div>
                        </div>

                    </div>
                </ModalBody>
            </Modal>
            : ''
    }
}

const mapStateToProps = (state) => ({
    cart: state.cart,
});

export default connect(mapStateToProps)(ModalSaveCart);