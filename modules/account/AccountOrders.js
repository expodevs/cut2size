import React, { Component } from 'react';

import {store} from "../../../../store";
import {getInfo, sendPost} from "../../../../actions/admin";
import AccountOrdersItem from "./AccountOrdersItem";
import {confirmAlert} from "react-confirm-alert";
import {withRouter} from "react-router-dom";
import {addProductToCart} from "../../../../actions/cart";
import {addToCartAnimation} from "../../../../functions/frontend";
import { orderProductToCart} from "../../../../functions/main";
import FormErrors from "../FormErrors";
import {deleteProduct, editKit, generateOrderPdf, getKit} from "../../../../functions/kit";
import Modal from "react-responsive-modal";
import EmptyOrders from "./EmptyOrders";
import PartnerInvoiceModal from "./Orders/PartnerInvoiceModal";
import SaveProjectModal from "./Orders/SaveProjectModal";
import Placeholder from "../parts/Placeholder";

const ApiUrl = process.env.REACT_APP_API_SERVER_URL;

class AccountOrders extends Component {



    constructor(props) {
        super(props);
        this.state={
            orders:false,
            errors:false,
            success:false,
            modalShow: false,
            modalItem: false,
            partnerModal: false,
            projectNameModal: false,
            project_name: '',
        };
        this.generateOrderPdf = this.generateOrderPdf.bind(this);
    }


    componentDidMount() {
        if(!this.state.orders){
            this.getOrders()
        }
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.props.url !== prevProps.url)
            this.getOrders()

    }

    getOrders(){

        let url = this.props.url ? ApiUrl+this.props.url : ApiUrl+'/orders/customer';
        this.setState({orders:false});
        store.dispatch(getInfo(url))
            .then(res=>{
                if(res.errors){
                    this.setState({errors:res.errors})
                }else{
                    this.setState({orders:res},()=>{
                        if (typeof window !== 'undefined') {
                            let ordersDiv = document.getElementsByClassName("order-products");
                            for (let orderDiv of ordersDiv) {
                                if(orderDiv.classList.contains('show')){
                                    orderDiv.scrollIntoView();
                                }
                            }
                        }
                    });
                }
            })
            .catch(error=>{
                this.setState({errors:error})

            });
    }
    toggleModal(order) {
        this.setState({modalShow: !this.state.modalShow});
        this.setState({modalItem: order});
    }
    toggleNameModal(order) {
        this.setState({projectNameModal: !this.state.projectNameModal});
        this.setState({modalItem: order});
    }



    generateOrderPdf(e,order, disablePrices=false){
        const ApiUrl = process.env.REACT_APP_API_SERVER_URL;
        let url = ApiUrl+'/orders/customer/generate-order-pdf/';
        if(this.props.partnerOrders){
             url = ApiUrl+'/orders/customer/generate-partner-pdf/';

        }
        generateOrderPdf(e,url,order,disablePrices)
    }

    proceedToPayment=(e,order)=>{
        e.preventDefault();
        let self = this;
        if(this.validateShippingInfo()){
            this.props.history.push({
                pathname: "/cart/checkout",
                state: {
                    order: order,
                }
            })
        }else{
            this.setState({
                errors:"Please fill shipping info!"
            },()=>{
                setTimeout(()=>{
                    self.props.history.push("/account-information?saved_cart=true")
                },2000)
            });
        }
    };


    validateShippingInfo=()=>{
        let validate = true;

        if(!this.props.account)
            return false;

        let requiredKeys=[
            'payment_firstname',
            'payment_lastname',
            'payment_address',
            'payment_city',
            'payment_province',
            'payment_postal_code',
            'payment_contry',
        ];



        Object.keys(this.props.account).forEach((key)=>{
            if(requiredKeys.includes(key)){

                let shippingKey = key.replace("payment_","shipping");
                if(
                    (!this.props.account[key] || this.props.account[key]==='' || this.props.account[key]===null)
                    &&
                    (!this.props.account[shippingKey] || this.props.account[shippingKey]==='' || this.props.account[shippingKey]===null)
                ){
                    validate = false;
                }
            }
        });

        return validate;
    };

    deleteOrder=(e,order)=>{
        confirmAlert({
            title: 'Confirm delete',
            message: 'Are you sure you want to delete the order?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () =>
                        store.dispatch(sendPost(process.env.REACT_APP_API_SERVER_URL+'/orders/customer/deleteSavedOrder/'+order.id,{

                        },"PUT")).then(res=>{

                            if(res.data.errors && res.data.errors.length){
                                this.setState({errors:res.data.errors})
                            }else{
                                this.setState({success:res.data.success});
                                let ordersState = {...this.state.orders};
                                ordersState.rows = ordersState.rows.filter((orderState)=>{
                                    return orderState.id !==order.id ;
                                });


                                this.setState({
                                    orders:ordersState
                                });
                            }

                        }).catch(err=>{console.log(err)})
                },
                {
                    label: 'No',
                }
            ]
        });
    };


    deleteProduct=(e,order,product)=>{
        const url = process.env.REACT_APP_API_SERVER_URL+'/orders/customer/deleteOrderProduct/'+order.id+'?kit_id='+product.kit_id+'&product_id='+product.product_id+'&sample_id='+product.sample_id;
        let self  = this;



        deleteProduct(url, function (res){

            if(res.data.errors && res.data.errors.length){
                self.setState({errors:res.data.errors})
            }else{
                self.setState({success:res.data.success});
                let ordersState = {...self.state.orders};
                ordersState.rows.forEach((orderState,index, ordersStateRows)=>{
                    if(orderState.id === order.id){
                        orderState.order_products = orderState.order_products.filter((productState)=>{
                            return (productState.kit_id !==product.kit_id ||  productState.product_id !==product.product_id||  productState.sample_id !==product.sample_id) ;
                        });

                    }
                    if(res.data.order){
                        ordersStateRows[index] = res.data.order
                    }
                });
                self.setState({
                    orders:ordersState
                });
            }
        });
    };



    addToCart=(e,order)=>{
        let target = e.currentTarget;
        let targetContent =target.innerHTML;
        let proms = [];
        order.order_products.forEach((product)=>{
            target.disabled=true;
            target.innerHTML = '<div class="spinner-border" role="status">\n' +
                '  <span class="sr-only">Loading...</span>\n' +
                '</div>';
            if (product.order_kit)
                proms.push(getKit(product.order_kit.erp_id));
        });
        Promise.all(proms).then(kits => {
            order.order_products.forEach((product)=> {
                let cartProduct = {};
                if (product.order_sample) {
                    cartProduct = {
                        id: new Date().getTime(),
                        name: product.order_sample.name,
                        price: product.price,
                        system_files: [{disk_name: product.order_sample.image}],
                        sample_id: product.sample_id
                    };
                } else if(product.product) {
                    cartProduct = {
                        id: new Date().getTime(),
                        name: product.product.name,
                        price: product.price,
                        system_files: product.product.system_files,
                        product_id: product.product_id
                    };
                } else {
                    let calcOptionState = orderProductToCart(product);

                    if (calcOptionState.in) {
                        Object.keys(calcOptionState.in).forEach((key) => {
                            calcOptionState[key] = calcOptionState.in[key];
                        })
                        delete calcOptionState.in;
                    }
                    kits.map((kit) => {
                        if (!(product.order_kit && product.order_kit.erp_id) || product.order_kit.erp_id !== kit.id)
                                return;
                            kit.kit_id = product.order_kit.erp_id;
                            if (kit.calcCategories && kit.calcCategories[0]) {
                                kit.calcCategory = kit.calcCategories[0];
                            }
                            cartProduct = {
                                id: new Date().getTime(),
                                name: product.order_kit.name,
                                price: product.price,
                                system_files: [{disk_name: product.order_kit ? product.order_kit.image : ''}],

                                kit: kit,
                                fields: calcOptionState,
                            };
                    })

                }
                store.dispatch(addProductToCart(cartProduct, product.quantity));
                console.log('product.sample_id', product.sample_id)
                addToCartAnimation('orderItemImage-' + (product.kit_id || product.product_id || product.sample_id), 'orderItemImage-' + (product.kit_id || product.product_id || product.sample_id));
                target.innerHTML = targetContent;
                target.disabled = false;
            });
        }).catch((err)=>{
            console.log(err);
            target.innerHTML = targetContent;
            target.disabled=false;
        });



    };

    editKit=(e,order,product )=>{
        editKit(e,order,product,this.props.history);
    };

    render() {
        return (
            <React.Fragment>
                {(this.state.orders && this.state.orders.rows && this.state.orders.rows.length) ?
                    <h1 className="account-title">{this.props.savedCart ? 'Your Saved Projects' : 'Your Order History'}</h1>
                    :''
                }
                <div className="orders-history">
                    <div className="">
                        {this.state.errors? <FormErrors formErrors={this.state.errors} />:''}
                        {this.state.success? <div  className={'alert alert-success '}>{this.state.success}</div>:''}
                    </div>
                    <div className="orders-list">
                        {(this.state.orders && this.state.orders.rows && this.state.orders.rows.length) ?
                            <React.Fragment>
                                <div className={'orders-list-header'}>
                                    <div className={'header-order-number'}>{this.props.savedCart ? 'Project ID' : 'Order ID'}</div>
                                    <div className={'header-order-date'}>Date</div>
                                    {
                                        !this.props.savedCart && <div className={'header-order-status'}>Status</div>
                                    }
                                    <div className={'header-order-name'}>Project PO</div>
                                    {this.props.partnerOrders ?
                                    <div className={'header-order-total'}>Partner status</div>
                                        :
                                    <div className={'header-order-total'}>Total Price</div>
                                    }
                                    <div className={'header-order-add-to-cart'}>&ensp;</div>
                                    <div className={'header-btn-block'}>&ensp;</div>
                                </div>
                                {this.state.orders.rows.map((order, index) =>
                                    <AccountOrdersItem key={index}
                                                       index={index}
                                                       order={order}
                                                       proceedToPayment={this.proceedToPayment}
                                                       addToCart={this.addToCart}
                                                       deleteOrder={this.deleteOrder}
                                                       deleteProduct={this.deleteProduct}
                                                       editKit={this.editKit}
                                                       generateOrderPdf={this.generateOrderPdf}
                                                       toggleModal={this.toggleModal.bind(this)}
                                                       partnerOrders={this.props.partnerOrders}
                                                       toggleNameModal={this.toggleNameModal.bind(this)}
                                    />)}
                            </React.Fragment>
                            : (this.state.orders && this.state.orders.rows) ?
                                <EmptyOrders
                                    title={this.props.savedCart ? 'No Saved Projects' : 'No Orders'}
                                    text={this.props.savedCart ? 'You don’t have any saved projects yet.' : 'You don’t have any orders yet.'}
                                    history={this.props.history}
                                />
                                :
                                <Placeholder />}
                    </div>
                </div>
                {
                    this.state.modalItem ?
                        <Modal open={this.state.modalShow} onClose={this.toggleModal.bind(this)} blockScroll={false} center
                               styles={{
                                   modal: {
                                       maxWidth: "350px",
                                       textAlign: 'center',
                                   }
                               }}
                               classNames={{
                                   modal: 'orders-modal',
                               }}
                        >
                            <div className="modal-body">
                                <div className={'check-email-title'}>Print</div>
                                <p className={'check-email-text'}>Choose an option that suits you</p>
                                {this.props.partnerOrders
                                    ?
                                    <button className="btn btn-outline-primary  generatePdf" onClick={e=>{
                                        this.toggleModal(this.state.modalItem);
                                        this.setState({partnerModal:true})}}>Generate invoice</button>
                                    :
                                    <button className="btn btn-outline-primary  generatePdf" onClick={e=>this.generateOrderPdf(e,this.state.modalItem)}>{this.state.modalItem.status==='completed' ? 'Print Invoice' : 'Print PDF'}</button>
                                }
                                <button className="btn btn-outline-primary  generatePdf" onClick={e=>this.generateOrderPdf(e,this.state.modalItem, true)}>{this.state.modalItem.status==='completed' ? 'Print PDF without price' : 'Print PDF without price'}</button>
                            </div>
                        </Modal>
                        : ''
                }
                <PartnerInvoiceModal
                    modalItem={this.state.modalItem}
                    partnerModal={this.state.partnerModal}
                    closeModal={()=>{
                        this.setState({
                            partnerModal:false,
                            modalItem:false,
                        })
                    }}
                    getOrders={this.getOrders.bind(this)}

                />
                <SaveProjectModal
                    order={this.state.modalItem}
                    projectNameModal={this.state.projectNameModal}
                    closeModal={this.toggleNameModal.bind(this)}
                    getOrders={this.getOrders.bind(this)}
                />
            </React.Fragment>
        )
    }
}


export default withRouter(AccountOrders);
