import React, { Component } from 'react';
import {formatPrice} from "../../../../functions/frontend";
import WebpImage from "../parts/WebpImage";
import {UncontrolledTooltip} from "reactstrap";
const currencySymbol = process.env.REACT_APP_PAYMENT_CURRENCY_SYMBOL;


class OrderSampleMobile extends Component {



    render() {
        let product = this.props.product;
        let order = this.props.order;
        let image = product.order_sample.image;
        return (
            <div className="product-item">
                <div className="product-image"><WebpImage id={'orderItemImage-'+product.id} src={image} alt={image}/></div>
                <div className="product-information">
                    <p className="product-title">{product.order_sample.name}</p>
                </div>
                <div className={'kit-fields'}>&ensp;</div>
                <div className="product-price">
                    <p><span className="text">Price/pc</span>
                        <span className="price">
                            <b className="number">{formatPrice(product.price,true,true,false)}</b>
                        </span>
                    </p>
                </div>
                <div className="product-quantity">
                    <p className="quantity">Quantity<span>{product.quantity}</span></p>
                </div>
                <div className="product-total-price">
                    <div className="price">Total
                        <span>{formatPrice((product.price_new ? product.price_new : product.price) * product.quantity, true, true)}</span>
                    </div>
                </div>
                <div className="product-btn-block">
                    {(order.status === 'saved_cart' || (this.props.admin && order.status !== 'canceled')) && this.props.deleteProduct &&
                    <React.Fragment>
                        <button
                            id={'delete-product-' + product.kit_id}
                            onClick={(e) => this.props.deleteProduct(e, order, product)}
                            className="btn btn-danger btn-delete">
                            <WebpImage src={'/images/delete.svg'}/>
                        </button>
                        <UncontrolledTooltip placement="top" autohide={true} target={'delete-product-' + product.kit_id}>Remove Item</UncontrolledTooltip>
                    </React.Fragment>
                    }
                </div>
            </div>
        )
    }
}


export default OrderSampleMobile;
