import React, { Component } from 'react';
import {setGtmEvent} from "../../../../functions/GtmDataLayer";

import {
    Link, withRouter
} from 'react-router-dom';
import {isMobile} from "react-device-detect";
import {store} from "../../../../store";
import {deleteProduct, setQuantity} from "../../../../actions/cart";
import {setKitItem} from "../../../../functions/main";
import {setCalcOptions, setMiniCart, setPrice} from "../../../../actions/kit";
import loadable from "@loadable/component";
const CartProduct = loadable(() => import('./CartProduct'));
const CartProductMobile = loadable(() => import('./CartProductMobile'));
const _ = require('lodash');




class CartItem extends Component {

    deleteItem(e,product){
        e.preventDefault();
        setGtmEvent('remove_from_cart', product);
        store.dispatch(deleteProduct(product.id));
    }
    setProductQuantity(e,product,quantity){

        e.preventDefault();
        if(parseInt(quantity)>=1){
            store.dispatch(setQuantity(product,parseInt(quantity)));
        }
    }

    editKit=async (e,product)=>{
        e.preventDefault();
        if(!product.kit){
            return;
        }
        await setKitItem({});


        store.dispatch(setPrice({price: product.price}));

        let inState = {};

        if(product.fields.dimension){
            Object.keys(product.fields.dimension).forEach((name)=>{
                if(product.fields.dimension[name]==='in'){
                    inState[name] = product.fields[name];
                }
            });
        }


        const calcOptionState={...product.fields,...{quantity:product.quantity},...{in:inState}};

        const immutableCalcOptionState = _.clone(calcOptionState);
        console.log('immutableCalcOptionState',immutableCalcOptionState);

        //
        await store.dispatch(setCalcOptions(immutableCalcOptionState));

        await setKitItem(product.kit);


        store.dispatch(setMiniCart({miniCart:product.id}));
        this.props.history.push('/calculator/specifications/'+product.kit.id,{
            cart:true
        });
    };

    render() {

        let product = this.props.product;
        let fields = {...product.fields};
        if(fields.dimension){
            Object.keys(fields.dimension).map(function (dimensionKey) {
                if(fields[dimensionKey] && typeof fields[dimensionKey] ==='object' && !Array.isArray(fields[dimensionKey])){
                    fields[dimensionKey] =fields[dimensionKey][Object.keys(fields[dimensionKey])[0]];
                }else{
                    if(fields[dimensionKey] && fields.dimension[dimensionKey]==='in'){

                        if(!fields[dimensionKey][1] || fields[dimensionKey][1]=='' || !fields[dimensionKey][2] || fields[dimensionKey][2]==''){
                            fields[dimensionKey] = fields[dimensionKey][0] + '"';
                        }else{
                            fields[dimensionKey] = fields[dimensionKey][0]+ ' '+fields[dimensionKey][1] + '/'+fields[dimensionKey][2]+'"' ;
                        }
                    }else{
                        fields[dimensionKey] = fields[dimensionKey] ?   fields[dimensionKey]+' '+fields.dimension[dimensionKey] : fields[dimensionKey]
                    }
                }
            });
        }

        let colWidth = this.props.minicart ? 12 :  6;

        let product_property_values = {...product.product_property_values};

        let product_properties = {};
        if (product_property_values) {
            Object.keys(product_property_values).map(function(property) {
                product_properties[product_property_values[property].product_property.name] = product_property_values[property].value;
            });
        }

        return (
            (product) ?
                (isMobile || this.props.isModal) ?
                    <CartProductMobile
                        product={product}
                        fields={fields}
                        product_properties={product_properties}
                        colWidth={colWidth}
                        deleteItem={this.deleteItem}
                        editKit={this.editKit}
                        setProductQuantity={this.setProductQuantity}
                        minicart={this.props.minicart}
                    />
                    :
                    <CartProduct
                        product={product}
                        fields={fields}
                        product_properties={product_properties}
                        colWidth={colWidth}
                        deleteItem={this.deleteItem}
                        editKit={this.editKit}
                        setProductQuantity={this.setProductQuantity}
                        minicart={this.props.minicart}
                    />
                : ''

        )
    }
}

export class LinkSpan extends Component{
    render() {
        return (
            (this.props.to && this.props.to !=='/undefined') ?
                <Link onClick={this.props.onClick} to={this.props.to}>{this.props.children}</Link>
                :
                <span onClick={this.props.onClick}>{this.props.children}</span>
        );
    }
}

export default (withRouter(CartItem));

