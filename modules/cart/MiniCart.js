import React, { PureComponent } from 'react';
import PropTypes from "prop-types";
import {connect} from "react-redux";

import loadable from '@loadable/component'
import WebpImage from "../parts/WebpImage";
import ModalSaveCart from "../ModalSaveCart";
import {isMobile} from 'react-device-detect';
const MiniCartInner = loadable(() => import('../parts/MiniCartInner'));




class MiniCart extends PureComponent {

    state={
        cartShow:false,
        submitButtonDisable: false,
        proceedPaymentButtonDisable: false,
    };

    constructor(props){
        super(props);

        this.unlisten = this.props.history.listen((location, action) => {
            this.setState({cartShow: false})
        });

        //remove click outside cart
        if (typeof document !== 'undefined') {
            document.removeEventListener('click', this.hideShow.bind(this),false);
        }
    }

    componentDidMount() {
        //add click outside cart listener
        if (typeof document !== 'undefined') {
            document.addEventListener('click', this.hideShow.bind(this),{passive: true});
        }
    }

    toogleShow(e){
        e.preventDefault();
        this.setState({cartShow: !this.state.cartShow});

    }
    hideShow(e){
        if(this.node && !this.node.contains(e.target) && (e.target.classList && e.target.classList[0]!=='remove-icon' && !e.target.classList.contains('dont-close-cart')) && !isMobile){
            this.setState({cartShow: false});
        }
    }

    setSubmitButtonDisable(val) {
        this.setState({submitButtonDisable: val});
    }
    setProceedPaymentButtonDisable(val) {
        this.setState({proceedPaymentButtonDisable: val});
    }

    render() {

        return (
            (this.props.cart) ?
                <div className="mini-cart" ref={node=>this.node=node}>
                    <button className="cart-button" aria-label="Button cart" onClick={e=>this.toogleShow(e)}><WebpImage src="/uploads/Cart_Icon.svg" alt="Cart icon" />{(this.props.cart.products && this.props.cart.products.length>0) ?<span className="number">{this.props.cart.quantityTotal}</span> : ''}</button>
                    {this.state.cartShow ?
                        <React.Fragment>
                            {(isMobile ? <div className={'mini-cart-overlay'} onClick={e=>this.toogleShow(e)}></div> : '')}
                            <div className={"mini-cart-content show" + (isMobile ? ' mobile' : '')}>
                                <MiniCartInner
                                    cart={this.props.cart}
                                    setSubmitButtonDisable={this.setSubmitButtonDisable.bind(this)}
                                    setProceedPaymentButtonDisable={this.setProceedPaymentButtonDisable.bind(this)}
                                    submitButtonDisable={this.state.submitButtonDisable}
                                    proceedPaymentButtonDisable={this.state.proceedPaymentButtonDisable}
                                />
                            </div>
                        </React.Fragment>
                        :''}

                    <div id="animateImage"></div>
                    <ModalSaveCart
                        setSubmitButtonDisable={this.setSubmitButtonDisable.bind(this)}
                        setProceedPaymentButtonDisable={this.setProceedPaymentButtonDisable.bind(this)}
                        submitButtonDisable={this.state.submitButtonDisable}
                        proceedPaymentButtonDisable={this.state.proceedPaymentButtonDisable}/>
                </div>
                : ''

        )
    }
}

MiniCart.propTypes = {
    cart: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    cart: state.cart,
});
export default connect(mapStateToProps)(MiniCart);
