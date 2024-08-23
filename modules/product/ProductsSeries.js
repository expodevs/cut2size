import React, { Component } from 'react';
import {
    withRouter,
}from 'react-router-dom';
const _ = require('lodash');
class ProductsSeries extends Component {




    constructor(props) {
        super(props);
        this.state = {
            seriesProps:{},
            productState:false,
            selectedProduct:false
        };

        this.state = this.initSeries(this.state);
        this.initOptions(props,this.state, true);

        this.props.setSelectedProduct(true);

        this.resetOptions = this.resetOptions.bind(this);

    }


    initSeries(state=false){

        let product = {...this.props.product};

        let seriesProps = {};
        if(!product.seriesProps){
            return ;
        }


        product.seriesProps.forEach(item=>{

            seriesProps[item.slug] = {
                id:item.id,
                name:item.name,
                slug:item.slug,
                values:{},
                sort_values: (item.values ? item.values.split(',') : false)
            };
            item.product_property_values.forEach(value=>{
                    let selected = ((!seriesProps[item.slug].values[value.slug] ||  !seriesProps[item.slug].values[value.slug].selected ) && value.product_id ===product.id  )
                        ||  (seriesProps[item.slug].values[value.slug] && seriesProps[item.slug].values[value.slug].selected);


                    let image = (item.main && parseInt(item.main)===1 && value.product && value.product.system_files&& value.product.system_files[0]) ? value.product.system_files[0] : false;

                    let valueSlug = value.slug.toString().replace(/((^|[^\\])(\\\\)*)'/g, "$1\\'").trim();


                    seriesProps[item.slug].values[valueSlug] = {
                        slug:value.slug,
                        value:value.value,
                        selected:selected,
                        image:image
                    }
            });

        });



        Object.keys(seriesProps).forEach((item, index) => {
            if (seriesProps[item].sort_values) {
                let values = {};
                seriesProps[item].sort_values.forEach(value => {
                    let trimmedValue = value.trim();
                    if (seriesProps[item].values[trimmedValue])
                        values[trimmedValue] = seriesProps[item].values[trimmedValue];
                });
                seriesProps[item].values = values;
            }
        });

        if(!state){
            this.setState({
                seriesProps: {...seriesProps}
            })
        }
        state.seriesProps = seriesProps;

        return state;
    }

    initOptions(props,state=false,init=false){

        if(!props.product_series){
            return
        }
        const product_series = [...props.product_series];

        let selectedProductState = false;
        let productState = [];


        product_series.forEach(seriesItem=>{

            let product = {
                id:seriesItem.id,
                product_id:seriesItem.product_id,
                slug:seriesItem.slug,
                properties:{}
            };
            let properties = {};

            let selectedProduct=true;
            seriesItem.product_property_values.forEach(item=>{
                if(item.product_property && item.product_property.slug){

                    let itemSlug = item.slug.trim();
                    let itemPropertySlug = item.product_property.slug.trim();

                    let selected = this.state.seriesProps && this.state.seriesProps[itemPropertySlug]
                                    &&  this.state.seriesProps[itemPropertySlug].values[itemSlug]
                                    &&  this.state.seriesProps[itemPropertySlug].values[itemSlug].selected;



                    if(!selected){
                        selectedProduct = false;
                    }

                    properties[item.product_property.slug] = {
                        id:item.id,
                        value:item.slug,
                        selected:selected
                    }

                }
            });

            if(selectedProduct){
                selectedProductState = product;
            }

            product.properties = properties;
            productState.push(product);
        });




        if(selectedProductState && selectedProductState.slug && selectedProductState.slug!==this.props.product.slug && !init){
            // this.props.history.push(`/${selectedProductState.slug}`)
            window.location.href=`/${selectedProductState.slug}`;
        }



         /**
          * * Show hide price
             *
          * */
        this.props.setSelectedProduct(selectedProductState);

        if(state){
            state.productState = productState;
            state.selectedProduct = selectedProductState;
            return state;
        }

        this.setState({
            productState:productState,
            selectedProduct:selectedProductState,
        });
    }

    changeOption(e,propSlug,valueSlug,select=true){
        if(!this.props.product_series){
            return;
        }
        let seriesProps = _.cloneDeep(this.state.seriesProps);

        Object.keys(seriesProps).forEach(propKey=>{
            Object.keys(seriesProps[propKey].values).forEach(valueKey=>{
                if(propSlug===propKey ){
                    seriesProps[propKey].values[valueKey].selected = ( valueSlug===valueKey && select)
                }
            });
        });

        this.setState({
            seriesProps:seriesProps
        },()=>{

            let state  = _.cloneDeep(this.state);

            state =_.cloneDeep(this.initOptions(this.props,state));

            /**
             * Unselect if prop or value doesn't exist in the product
             * */

            if(state.selectedProduct && state.selectedProduct.id){
                if(select && state.selectedProduct.properties && (!state.selectedProduct.properties[propSlug] || state.selectedProduct.properties[propSlug].value!==valueSlug)){
                    state.selectedProduct = false;
                }
                this.props.setSelectedProduct(state.selectedProduct)
            }


            const seriesPropsWithDisabled = _.cloneDeep(state.seriesProps);
            const productStateNew = _.cloneDeep(state.productState);
            if(select){

                let enabledProducts = [];


                productStateNew.forEach(productNew=>{


                    Object.keys(productNew.properties).forEach(propKey=>{

                        if(propKey === propSlug && productNew.properties[propKey].value===valueSlug){
                            enabledProducts.push(productNew);
                        }

                        if(seriesPropsWithDisabled[propKey]
                            && seriesPropsWithDisabled[propKey].values[productNew.properties[propKey].value]
                            && propSlug!==propKey
                        ){
                            seriesPropsWithDisabled[propKey].values[productNew.properties[propKey].value].disabled=true;
                        }
                    });
                });

                enabledProducts.forEach(enabledProduct=>{
                    Object.keys(enabledProduct.properties).forEach(propKey=>{

                        if(seriesPropsWithDisabled[propKey] && seriesPropsWithDisabled[propKey].values[enabledProduct.properties[propKey].value] ){
                            seriesPropsWithDisabled[propKey].values[enabledProduct.properties[propKey].value].disabled=false;
                        }

                        if(!seriesPropsWithDisabled[propKey] || !seriesPropsWithDisabled[propKey].values[enabledProduct.properties[propKey].value]  ){
                            seriesPropsWithDisabled[propKey].values[enabledProduct.properties[propKey].value.trim()].selected=false;
                        }


                    })
                });

                state.seriesProps=seriesPropsWithDisabled;

            }
            this.setState(state);
        });
    }

    resetOptions(){

        let seriesProps = {...this.state.seriesProps};

        Object.keys(seriesProps).forEach(propKey=>{
            Object.keys(seriesProps[propKey].values).forEach(valueKey=>{
                seriesProps[propKey].values[valueKey].selected = false;
                seriesProps[propKey].values[valueKey].disabled = false;
            });
        });

        let self = this;
        this.setState({
            seriesProps:seriesProps
        },()=>{
            this.initOptions(self.props);
        });

    }


    render() {
        return (
            <div className="options product-options">
                <div className={'product-options-buttons'}>
                    <button className={'product-options-reset'} aria-label="Button reset options" onClick={this.resetOptions}>Reset Filters</button>
                    {/*<button className={'product-options-print'}>Print PDF</button>*/}
                </div>
                {!!(this.state.seriesProps)
                    &&
                    Object.keys(this.state.seriesProps).map(propKey=>{
                            const property = this.state.seriesProps[propKey];
                            return <div className="option" key={this.state.seriesProps[propKey].id}>
                                        <p className="option-name">{this.state.seriesProps[propKey].name}:</p>
                                        <ul className="option-list">
                                            {
                                                Object.keys(this.state.seriesProps[propKey].values).map((valueKey, index)=>{
                                                    const value = this.state.seriesProps[propKey].values[valueKey];
                                                    return <li key={index} className={"thumb option-item" + (value.selected ? ' checked' : '')+ (value.disabled ? ' disabled' : '')}>
                                                                <label>
                                                                    {!!value.image &&
                                                                        <img src={value.image.disk_name} alt={'option'} width="50" height="50" />
                                                                    }
                                                                    <input
                                                                        onClick={e=>this.changeOption(e,propKey,valueKey,!value.selected )}
                                                                        type="radio"
                                                                        name={property.slug}
                                                                        value={value.value}
                                                                        defaultChecked={(value.selected )}
                                                                    />
                                                                    <span className="value">{value.value}</span>
                                                                </label>
                                                                {
                                                                    value.disabled
                                                                    ?
                                                                    <svg width="28" height="28" viewBox="0 0 36 36" data-testid="close-icon">
                                                                        <path d="M28.5 9.62L26.38 7.5 18 15.88 9.62 7.5 7.5 9.62 15.88 18 7.5 26.38l2.12 2.12L18 20.12l8.38 8.38 2.12-2.12L20.12 18z"/>
                                                                    </svg>
                                                                    :
                                                                    ''
                                                                }
                                                            </li>
                                                })
                                            }
                                        </ul>
                                    </div>
                    }
                    )
                }
            </div>
        )
    }
}

export default withRouter(ProductsSeries);
