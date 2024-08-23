import {isMobile} from "react-device-detect";
import {formatPrice} from "../../../../functions/frontend";
import {Link} from "react-router-dom";
import React from "react";
import loadable from "@loadable/component";
import SaveExistingCartButton from "./SaveExistingCartButton";
import {connect} from "react-redux";
const SaveCartButton = loadable(() => import('./SaveCartButton'));
const CheckoutButton = loadable(() => import('./CheckoutButton'));

function MiniCartBottom({saved_cards,...props}) {
    let total = props.total;



    return (!isMobile ? <React.Fragment>
                <div className="total-price">
                    <p className="price">Total Price:<span><b
                        className="number">{formatPrice(total,true,true)}</b></span>
                    </p>
                </div>
                <div className={"to-cart"}><Link className="link" to="/cart">To cart</Link></div>
            <div className={'row save-btns'}>
                <div className={"to-cart cart-buttons new col-" + (saved_cards ? '6' : '12')}>
                    <SaveCartButton
                        setSubmitButtonDisable={props.setSubmitButtonDisable}
                        setProceedPaymentButtonDisable={props.setProceedPaymentButtonDisable}
                        submitButtonDisable={props.submitButtonDisable}
                        proceedPaymentButtonDisable={props.proceedPaymentButtonDisable}
                        miniCart={true}
                    />
                </div>
                {saved_cards &&
                <div className={"to-cart cart-buttons existing col-6"}>
                    <SaveExistingCartButton saved_carts={saved_cards}/>
                </div>
                }
            </div>
            </React.Fragment>
            :
            <React.Fragment>
                <div className={"total-price mobile row"}>
                    <div className={'col-6'}><p className="price">Total Price:</p></div>
                    <div className={'col-6'}><p className={'price-value'}>{formatPrice(total,true,true)}</p></div>
                </div>
                <div className={'checkout-btn-wrapper row'}>
                    <div className={'total-price-buttons col-' + (saved_cards ? '6' : '12')}>
                        <SaveCartButton
                            setSubmitButtonDisable={props.setSubmitButtonDisable}
                            setProceedPaymentButtonDisable={props.setProceedPaymentButtonDisable}
                            submitButtonDisable={props.submitButtonDisable}
                            proceedPaymentButtonDisable={props.proceedPaymentButtonDisable}
                            miniCart={true}
                        />
                    </div>
                    {saved_cards &&
                        <div className={'total-price-buttons col-6'}>
                            <SaveExistingCartButton
                                saved_carts={saved_cards}
                            />
                        </div>
                    }
                    <div className={"to-cart col-12 mobile"}>
                        <CheckoutButton
                            submitButtonDisable={props.submitButtonDisable}
                            proceedPaymentButtonDisable={props.proceedPaymentButtonDisable}
                        />
                    </div>
                </div>
            </React.Fragment>
    )
}
const mapToStateProps=(state)=>({
    saved_cards:state.auth.saved_cards
});
export default connect(mapToStateProps)(MiniCartBottom);
