import React, { Component } from 'react';
import loadable from '@loadable/component'
import ProductItem from "./ProductItem";
import KitItem from "./KitItem";
import {formatName, formatPrice} from "../../../../functions/frontend";
import {Link, withRouter} from "react-router-dom";
import OrderSample from "./OrderSample";
import OrdersBtnBlock from "../OrdersBtnBlock";
import {userDevice} from "../../../../functions/frontend";
import KitItemMobile from "./KitItemMobile";
import OrderSampleMobile from "./OrderSampleMobile";
import PartnerStatusSelect from "./Orders/PartnerStatusSelect";
const OrderServices = loadable(() => import('../../../../admin/views/Orders/OrderServices'));
const OrderDiscounts = loadable(() => import('../../../../admin/views/View/OrderDiscounts'));
const currencySymbol = process.env.REACT_APP_PAYMENT_CURRENCY_SYMBOL;




class AccountOrdersItem extends Component {

    state={
        show:false
    };

    setShow() {
        this.setState({show: !this.state.show});
    }

    render() {
        let order = this.props.order;
        let show = this.state.show || (this.props.history.location.state && this.props.history.location.state.accountOrder &&  this.props.history.location.state.accountOrder.id === order.id);
        return (
            <div className={"order-item" + (this.props.index === 0 ? ' first' : '') }>

                <ul className="order-information">
                    <li className="order-number"># <span>{order.id}</span></li>
                    <li className="order-date"><span>{order.createdAt}</span></li>
                    {
                        order.status !== 'saved_cart' &&
                            <li className="order-status"><span className={order.status}>{formatName(order.status)}</span></li>
                    }
                    <li className="order-name">{order.project_name} <span>({order.order_products.length} items) </span>
                        <Link to={''} onClick={e=>{e.preventDefault(); this.props.toggleNameModal(order)}}><i className="fa fa-pencil"></i></Link>
                    </li>
                    {this.props.partnerOrders ?
                        // <li className="order-total"><span className={order.partner_status}>{formatName(order.partner_status)}</span></li>
                        <li className="order-total"><PartnerStatusSelect order={order} /></li>
                        :
                    <li className="order-total"><span>{formatPrice(order.total_price, true, true)} </span></li>
                    }
                    <li className={'order-add-to-cart'}>
                    {((order.status==='saved_cart'||order.status==='pending')&&!this.props.partnerOrders) &&
                        <button className="btn btn-primary mr-1 pull-left proceedToPayment"
                                onClick={(e) => this.props.proceedToPayment(e,order)}>
                            Proceed to payment
                        </button>
                    }
                    </li>
                    <li className={'btn-block'}>
                        <OrdersBtnBlock
                            order={order}
                            toggleModal={this.props.toggleModal}
                            deleteOrder={this.props.deleteOrder}
                            show={this.state.show}
                            setShow={this.setShow.bind(this)}
                        />
                    </li>

                </ul>
                <div className={'order-information-mobile'}>
                    <div className={'top'}>
                        <div className={'info'}>
                            <div className={'order-number'}>Order #{order.id}</div>
                            <div className={'order-date'}>Project PO {order.project_name}<Link to={''} onClick={e=>{e.preventDefault(); this.props.toggleNameModal(order)}}><i className="fa fa-pencil"></i></Link></div>
                            <div className={'order-date'}>{order.createdAt}</div>
                            <div className={'order-item-count'}>{order.order_products.length} items</div>
                        </div>
                        <div className={'btn-block'}>
                            <OrdersBtnBlock
                                order={order}
                                toggleModal={this.props.toggleModal}
                                deleteOrder={this.props.deleteOrder}
                                show={this.state.show}
                                setShow={this.setShow.bind(this)}
                            />
                        </div>

                    </div>
                    <div className={'bottom'}>
                        {order.status !== 'saved_cart' ? <span className="completed">{formatName(order.status)}</span> : ''}
                        {!this.props.partnerOrders &&
                            <>
                                <div className={'order-total'}>{formatPrice(order.total_price, true, true)}</div>
                                {(order.status === 'saved_cart' || order.status === 'pending') &&
                                <button className="btn btn-primary mr-1 pull-left proceedToPayment"
                                        onClick={(e) => this.props.proceedToPayment(e, order)}>
                                    Proceed to payment
                                </button>
                                }
                            </>
                        }

                    </div>
                </div>
                {show &&
                    <div className={"order-products "} id={'collapse'+order.id}>
                    {order.order_products.map((product,index)=>{
                            return (
                                    userDevice() === 'desktop' ?
                                    <React.Fragment key={index}>
                                        {(!!product.product) &&<ProductItem hidePrice={!!this.props.partnerOrders} product={product} order={order} deleteProduct={this.props.deleteProduct}/>}
                                        {(!!product.order_sample) &&<OrderSample hidePrice={!!this.props.partnerOrders}  product={product} order={order} deleteProduct={this.props.deleteProduct}/>}
                                        {(!!product.order_kit) &&<KitItem
                                            hidePrice={!!this.props.partnerOrders}
                                            product={product}
                                            order={order}
                                            deleteProduct={this.props.deleteProduct}
                                            editKit={this.props.editKit}

                                            />}
                                    </React.Fragment> :
                                        <React.Fragment key={index}>
                                            {(!!product.order_sample) &&<OrderSampleMobile hidePrice={!!this.props.partnerOrders}  product={product} order={order} deleteProduct={this.props.deleteProduct}/>}
                                            {(!!product.order_kit) &&<KitItemMobile
                                                hidePrice={!!this.props.partnerOrders}
                                                product={product}
                                                order={order}
                                                deleteProduct={this.props.deleteProduct}
                                                editKit={this.props.editKit}

                                            />}
                                        </React.Fragment>
                            );
                        }
                    )}

                    {order.order_services &&
                    <OrderServices order={order} />
                    }
                    {order.order_discounts &&
                    <OrderDiscounts order={order} />
                    }

                    <div className="row no-padding justify-content-end">
                        {
                            (order.status === 'saved_cart') &&
                            <div className="col-md-3">
                                <button className="btn btn-add mr-1 pull-left addToCart"
                                        onClick={e => this.props.addToCart(e, order)}>
                                    Add All Items to Cart
                                </button>
                                <Link to={'/calc-categories'} className="btn btn-add mr-1 pull-left addToCart">
                                    Add Items
                                </Link>
                            </div>
                        }
                        {order.shipping_tracking_link  &&
                        <div className="col-md-3">
                            <a className="btn btn-dark" rel="noopener noreferrer" target="_blank" href={order.shipping_tracking_link}>Track the package</a>
                        </div>
                        }
                    </div>
                    {order.order_refund && order.order_refund.completed &&
                    <div className={'row color-red'}>{formatName(order.order_refund.type)} - {currencySymbol}{formatPrice(order.order_refund.total)} - {(order.order_refund.updatedAt || order.order_refund.createdAt)}</div>
                    }
                    <div className={'hide-link'} onClick={e=>this.setShow()}>Hide project details</div>
                </div>

                }
            </div>

        )
    }
}



export default withRouter(AccountOrdersItem);
