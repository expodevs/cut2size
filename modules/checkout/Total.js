import React, { Component } from 'react';
import {formatPrice} from "../../../../functions/frontend";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {getGst, getShipping} from "../../../../actions/cart";
import {store} from "../../../../store";
import {getInfo} from "../../../../actions/admin";

const VANITIES_ID = 45;

class Total extends Component {


    constructor(props){
        super(props);
        this.state={
            shipping:(this.props.order  && this.props.order.shipping_price) ? this.props.order.shipping_price : false,
            shippingLoading: false,
            customShipping: (this.props.order  && this.props.order.shipping_price) ? this.props.order.shipping_price : false,
            usa_customer: false,
            vanities_shipping_price: false,
        }

    }

    componentDidMount() {
        if(!this.props.cart.gst){
            store.dispatch(getGst());
        }
        if(this.state.customShipping){
            this.props.setPaymentShipping({amount:this.state.customShipping})
        }
        if(!this.props.cart.shipping || !this.props.cart.shipping.price){
            this.setState({
                shippingLoading:true
            });
          store.dispatch(getShipping(this.props.order)).then(res=>{
              this.setState({
                  shippingLoading:false
              });


              if(res && res.payload && res.payload[0] && res.payload[0].provider && !(this.state.customShipping)){

                  // this.setState({
                  //     shipping:res.payload[0].amount
                  // });
                  // if(this.props.setPaymentShipping){
                  //     this.props.setPaymentShipping(res.payload[0]);
                  // }

              }
          });
        }

        this.getVanitiesShippingPrice();
        this.checkPaymentCountry();

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

    chooseShipping=(e)=>{
        e.preventDefault();
        let shipping = JSON.parse(e.target.value);
        this.props.setPaymentShipping(shipping);
        this.setState({
            shipping:shipping.amount
        });
    };

    checkPaymentCountry() {
        const countrySelect = document.querySelector('select[name="shipping_country"]');
        const countryValue = countrySelect ? countrySelect.value : false;

        if (!countryValue) {
            const countrySelect = document.querySelector('select[name="payment_country"]');
            const countryValue = countrySelect ? countrySelect.value : false;
        }

        if (countryValue === 'USA') {
            this.setState({usa_customer:true})
        }

        this.props.cart.shipping = this.props.cart.shipping.filter((shipping) => {
            return !((countryValue === 'Canada' || countryValue === 'canada') && shipping.providerSlug === 'us_shipping');
        });

    }

        render() {



            let subtotal = parseFloat(this.props.total);
            let total = this.props.order?.order_discounts.amount ? parseFloat(this.props.total) -parseFloat(this.props.order.order_discounts.amount )  :  parseFloat(this.props.total);

            let allProducts = this.props.cart.products;

            let shippingMerchantPrice = 0;
            if (this.props.merchant) {
                let merchantProducts = allProducts ? allProducts.filter(product => product.category_id === VANITIES_ID) : null;
                shippingMerchantPrice = allProducts ? (merchantProducts.reduce((total, product) => total + (this.state.vanities_shipping_price * product.quantity), 0)) : null;
                total += shippingMerchantPrice;
            }

            let totalWithoutGst = (total
                    +parseFloat((this.state.shipping && !isNaN(this.state.shipping)) ? this.state.shipping : 0)
                )
            ;
            let gst = (this.props.cart.gst && totalWithoutGst) && !this.state.usa_customer ?  totalWithoutGst*parseFloat(this.props.cart.gst)/100 : 0;

            let totalWithGst = totalWithoutGst+gst;

            let shippingShow = !(this.state.customShipping) && !(this.props.merchant);





        return (
            <div className="total-price">


                <p className="price">Order Subtotal:<span><b className="number">{formatPrice(subtotal,true,true)}</b></span></p>

                {!!(this.state.customShipping)&&
                <p className="price">Custom Shipping Price {this.props.order.shipping_provider ? "("+this.props.order.shipping_provider+")" : "" }:<span><b className="number">{formatPrice(this.state.customShipping,true,true)}</b></span></p>
                }

                {this.props.order && shippingShow ?
                    <div className={'price'}>
                        Shipping:
                        {(this.state.shippingLoading && shippingShow)  ?
                            <span>
                                <div className="spinner loading" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div>
                            </span>
                            :
                            <select className="estimated form-control" name={'shipping_price'} onChange={e=>this.chooseShipping(e)}>
                                <option value="">Choose shipping method</option>
                                {this.props.cart.shipping.map((shipping,index)=>
                                    <option key={index}  value={JSON.stringify(shipping)}>
                                        {shipping.provider}: {shipping.error ? shipping.error  : formatPrice(shipping.amount,true,true,false)}
                                    </option>
                                )
                                }
                            </select>
                        }

                    </div>
                    :''
                }

                {this.props.merchant ?
                    <p className="price">Shipping:<span><b className="number">{formatPrice(shippingMerchantPrice,true,true)}</b></span></p>
                    :''
                }

                <p className="price">GST {this.props.cart.gst}%:<span><b className="number">{formatPrice(gst,true,true)}</b></span></p>
                {!!this.props.order?.order_discounts &&
                <>
                    {/*<p className="price">Old Subtotal:<span><b className="number">{formatPrice(this.props.order.order_discounts.subtotal_old,true,true)}</b></span></p>*/}
                    <p className="price">Discount:<span><b className="number">{formatPrice(this.props.order.order_discounts.amount,true,true)}</b></span></p>
                </>
                }
                <p className="price-total">Order Total:<span><b className="number">{formatPrice(totalWithGst,true,true)}</b></span></p>
                <input type="hidden" name={'subtotal_price'} value={formatPrice(subtotal,false,false,false,false)}/>
                {this.props.merchant && <input type="hidden" name={'shipping_price'} value={formatPrice(shippingMerchantPrice,false)}/>}
                {this.props.merchant && <input type="hidden" name={'is_merchant'} value={'1'}/>}
                <input type="hidden" name={'gst'} value={formatPrice(this.props.cart.gst,false,false,false,false)}/>
                <input type="hidden" name={'total_price'} value={formatPrice(totalWithGst,false,false,false,false)}/>
            </div>
        )
    }
}

Total.propTypes = {
    cart: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    cart: state.cart,
});
export default connect(mapStateToProps)(Total);

