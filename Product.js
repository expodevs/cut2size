import React, { Component } from 'react';
import ViewedProducts from './modules/ViewedProducts';
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {store} from "../../store";
import { setViewedProducts} from "../../actions/init";
import {arrayObjectPropertySum, filterKeys, groupBy} from "../../functions/main";
import ProductDocuments from "./modules/product/ProductDocuments";
import ProductsSeries from "./modules/product/ProductsSeries";
import {addProductToCart} from "../../actions/cart";
import Breadcrumbs from "./modules/breadcrumbs";
import {addToCartAnimation, formatPrice, isMobile} from "../../functions/frontend";
import ProductImage from "./modules/product/ProductImage";
import ProductDescription from "./modules/product/ProductDescription";
import RelatedProducts from "./modules/product/RelatedProducts";
import Reviews from "./modules/product/Reviews";
import Rating from "react-rating";
import {UncontrolledTooltip} from "reactstrap";
import ProductAddonOptions from "./modules/product/ProductAddonOptions";
import ProductLine from "./modules/product/ProductLine";
import {setGtag, setGtmEvent} from "../../functions/GtmDataLayer";
import IkeaMaterials from "./modules/product/IkeaMaterials";
import IkeaSizes from "./modules/product/ikeaSizes";

class Product extends Component {

    state={
        addQuantity:1,
        selectedProduct:true,
        addonTotal:false,
        selectedAddons:[],
        selectedMaterial:false,
        selectedSize:false,
    };



    componentDidMount() {
        this.setViewed();
        this.topFunction();

        let product = {...this.props.init.page.result};

        if (product.product_category && product.product_category.slug === 'vanities') {
            setGtag('view_item', product, product.price_new ?? product.price)
        }

        setGtmEvent('view_item', this.props.init.page.result)
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.location !== prevProps.location) {
            this.topFunction();
        }
    }

    topFunction() {
        window.scrollTo(0, 0);
    }

    setViewed(){
        let viewed_products = JSON.parse(localStorage.getItem('viewed_products'));
        if(typeof viewed_products == 'undefined' || viewed_products ==null){
            viewed_products = [];
        }
        let exist = false;
        for(let i in viewed_products){
            if(viewed_products[i].id === this.props.init.page.result.id){
                exist = true;
                break;
            }
        }
        if(!exist){

            let viewedProduct = this.props.init.page.result;
            viewedProduct = filterKeys(viewedProduct, [
                'id'
            ]);
            viewed_products.push(viewedProduct);
        }
        localStorage.setItem('viewed_products', JSON.stringify(viewed_products));
        store.dispatch(setViewedProducts());
    }

    changeQuantity(e,plus){
        e.preventDefault();
        let quantity  = this.state.addQuantity;
        quantity = plus ? quantity+1 : ((quantity>1) ? quantity-1 : 1);
        this.setState({addQuantity:quantity});
    }

    addToCart(e){
        e.preventDefault();

        let product = {...this.props.init.page.result};

        if (product.product_category && product.product_category.slug === 'vanities') {
            setGtag('add_to_cart', product, this.props.cart.total)
        }

        product.addons = this.state.selectedAddons;

        if (this.state.selectedSize && this.state.selectedMaterial) {
            let sizes = this.state.selectedSize.product_property.values.split(',');
            let width = sizes[0];
            let height = sizes[1];

            let area = width * height;
            product.price = this.state.selectedMaterial.price * area;

            product.name = product.name + ' (' + this.state.selectedSize.product_property.name + '&' + this.state.selectedMaterial.name + ')';
        } else {
            product.price = product.price + product.addons.map(item=>item.price).reduce((partialSum, a) => partialSum + a, 0)
        }


        product.price_new = product.price_new?  product.price_new + product.addons.map(item=>item.price).reduce((partialSum, a) => partialSum + a, 0) : product.price_new
        store.dispatch(addProductToCart(product, this.state.addQuantity));
        addToCartAnimation('gallery-image','gallery-image');
    }
    getProductDescription=()=>{
        return [
            {
                name:"Product Number",
                content:<div className="tab-content description" dangerouslySetInnerHTML={{__html:this.props.init.page.result.code}}/>
            },
            {
                name:"Description",
                content:<div className="tab-content description" dangerouslySetInnerHTML={{__html:this.props.init.page.result.description}}/>
            },
            {
                name:"Related Documents",
                content: <ProductDocuments documents={this.props.init.page.result ? this.props.init.page.result.product_documents : false}/>

            },

        ]
    };

    setSelectedProduct(product){
        this.setState({
            selectedProduct:product
        })
    }

    setSelectedMaterial(material) {
        this.setState({
            selectedMaterial: material,
        })
    }

    setSelectedSize(size) {
        this.setState({
            selectedSize: size,
        })
    }



    render() {

        let breadcrumbList = [
            {
                link: '/catalog',
                name: 'Catalog',
            }
        ];
        if((this.props.init.page && this.props.init.page.result && this.props.init.page.result.product_category)){
            breadcrumbList.push({
                link: '/catalog/'+this.props.init.page.result.product_category.slug,
                name: this.props.init.page.result.product_category.name,
            });
        }
        breadcrumbList.push({
            name: this.props.init.page.result.name
        });



        let images = [];
        if (this.props.init.page.result.system_files && this.props.init.page.result.system_files.length>0) {
            images.push(this.props.init.page.result.system_files.map((item, index) => {
                return item.disk_name;
            }));
        }

        let reviewsArray = [];
        this.props.init.page.result.product_reviews.map((item, index) => {
            let review = {
                "@type": "Review",
                "author": (item.customer && item.customer.name ? item.customer.name : ''),
                "datePublished": item.createdAt,
                "reviewBody": item.text,
                "reviewRating": {
                    "@type": "Rating",
                    "bestRating": 5,
                    "ratingValue": item.rating,
                    "worstRating": 1
                }
            };
            reviewsArray.push(review);
        });

        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        let yyyy = today.getFullYear()+5;
        let priceValidUntil = yyyy + '-' + mm + '-' + dd;

        let jsonData = {
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": this.props.init.page.result.name,
            "image": images,
            "brand": "cut2size",
            "offers": {
                "@type": "Offer",
                "availability": this.props.init.page.result.product_status.name === "in_stock" ? "https://schema.org/InStock" : "https://schema.org/PreOrder",
                "price": this.props.init.page.result.price_new ? this.props.init.page.result.price_new : this.props.init.page.result.price,
                "priceCurrency": process.env.REACT_APP_PAYMENT_CURRENCY,
                "priceValidUntil": priceValidUntil,
                "url": process.env.REACT_APP_SERVER_URL + "/" + this.props.init.page.result.slug,
            }
        };

        if (reviewsArray.length>0) {
            jsonData["review"] = reviewsArray;
        }
        if (this.props.init.page.result.description) {
            jsonData["description"] = this.props.init.page.result.description;
        }
        if (this.props.init.page.result.product_reviews.length && this.props.init.page.result.product_reviews.length>0) {
            jsonData["aggregateRating"] = {
                "@type": "AggregateRating",
                "ratingValue": this.props.init.page.result.product_reviews? arrayObjectPropertySum(this.props.init.page.result.product_reviews,'rating')/this.props.init.page.result.product_reviews.length:0,
                "ratingCount": this.props.init.page.result.product_reviews.length
            }
        }

        if (this.props.init.page.result.code) {
            jsonData["sku"] = this.props.init.page.result.code;
        }

        let price;
        if (this.state.selectedSize && this.state.selectedMaterial) {

            let sizes = this.state.selectedSize.product_property.values.split(',');
            let width = sizes[0];
            let height = sizes[1];

            let area = width * height;
            price = formatPrice(this.state.selectedMaterial.price * area * this.state.addQuantity, true,true);
        } else {
             price = formatPrice((this.props.init.page.result.price_new
                ? this.props.init.page.result.price_new
                : this.props.init.page.result.price) * this.state.addQuantity + this.state.addonTotal,true,true);
        }



        return (
            <main className={'product-page'}>
                <section className="no-padding product-breadcrumbs">
                    <Breadcrumbs
                        list={breadcrumbList}
                    />
                </section>
                <section className="page-product-wrapper">
                    <section className="no-padding-top">
                        <div className="">
                            <div className="container">
                                <div className="row">
                                    <div className="gallery col-xl-6 col-lg-6 col-md-6 col-sm-6">
                                        <ProductImage
                                            system_files = {this.props.init.page.result.system_files}
                                        />
                                    </div>
                                    <div className="product-information col-xl-6 col-lg-6 col-md-6 col-sm-6">
                                        <div className="container product-title-block">
                                                <h1 className="product-title product-page-title">{this.props.init.page.result.name}</h1>
                                                {this.props.init.page.result.line_id &&
                                                    <ProductLine lineId={this.props.init.page.result.line_id} categoryName={this.props.init.page.result.product_category.slug}></ProductLine>
                                                }
                                                <div className={'product-rating'}>
                                                    <Rating
                                                        initialRating={this.props.init.page.result.product_reviews? arrayObjectPropertySum(this.props.init.page.result.product_reviews,'rating')/this.props.init.page.result.product_reviews.length:0}
                                                        readonly
                                                        emptySymbol={<svg width="19" height="19" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg"
                                                                          style={{maxWidth:"inherit"}}
                                                        >
                                                            <path d="M9.73267 13.8074L9.5 13.6851L9.26733 13.8074L4.58011 16.2717L5.47529 11.0524L5.51972 10.7933L5.33149 10.6098L1.53944 6.91346L6.77992 6.15197L7.04005 6.11417L7.15639 5.87845L9.5 1.12978L11.8436 5.87845L11.9599 6.11417L12.2201 6.15197L17.4606 6.91346L13.6685 10.6098L13.4803 10.7933L13.5247 11.0524L14.4199 16.2717L9.73267 13.8074Z"
                                                                  fill="white" stroke="#FCB72A"
                                                            />
                                                        </svg>
                                                        }
                                                        fullSymbol={<svg width="19" height="19" viewBox="0 0 19 18" fill="none" xmlns="http://www.w3.org/2000/svg"
                                                                         style={{maxWidth:"inherit"}}
                                                        >
                                                            <path fillRule="evenodd" clipRule="evenodd" d="M9.5 14.25L3.91604 17.1857L4.98248 10.9678L0.464963 6.56434L6.70802 5.65717L9.5 0L12.292 5.65717L18.535 6.56434L14.0175 10.9678L15.084 17.1857L9.5 14.25Z"
                                                                  fill="#FCB72A"
                                                            />
                                                        </svg>
                                                        }
                                                    />
                                                    <div className={'reviews-count'}>{this.props.init.page.result.product_reviews ? this.props.init.page.result.product_reviews.length : 0} Reviews</div>
                                                </div>
                                        </div>
                                        <div className="product-information-wrap">

                                        {!!(this.props.init.page.result && this.props.init.page.result.seriesProps&& this.props.init.page.result.seriesProps.length && this.props.init.page.result.category_id !== 46)&&
                                            <ProductsSeries
                                                product_series = {this.props.init.product_series.rows}
                                                product={this.props.init.page.result}
                                                setSelectedProduct={this.setSelectedProduct.bind(this)}
                                            />
                                            }

                                            {this.props.init.page.result.category_id === 46 &&
                                                <IkeaMaterials
                                                    materials={this.props.init.page.result.materials}
                                                    selectedMaterial={this.state.selectedMaterial}
                                                    setSelectedMaterial={this.setSelectedMaterial.bind(this)}
                                                />
                                            }

                                            {this.props.init.page.result.category_id === 46 &&
                                                <IkeaSizes
                                                    sizes={this.props.init.page.result.product_property_values}
                                                    selectedSize={this.state.selectedSize}
                                                    setSelectedSize={this.setSelectedSize.bind(this)}
                                                />
                                            }

                                             <ProductAddonOptions
                                                 options={this.props.init?.page?.result?.product_addon_options}
                                                 setTotal={(total)=>this.setState({addonTotal:total})}
                                                 setSelectedAddons={(addons)=>this.setState({selectedAddons:addons})}
                                                 total={this.state.addonTotal}
                                                 selectedAddons={this.state.selectedAddons}
                                             />

                                        {this.state.selectedProduct ?
                                            <React.Fragment>
                                            <div className="price-quantity">

                                                    {(this.props.init.page.result.product_status && this.props.init.page.result.product_status.id) &&
                                                    <div className="stock-status">
                                                        <div className="price-text">Stock:</div>
                                                        <span id={'product-stock-status'} className={'stock-indicator'} style={{background:this.props.init.page.result.product_status.color}}></span>
                                                        <UncontrolledTooltip placement="top" autohide={true} target={'product-stock-status'}>{this.props.init.page.result.product_status.label}</UncontrolledTooltip>
                                                    </div>
                                                    }
                                                    {(this.props.init.page.result.product_status && this.props.init.page.result.product_status.id && !this.props.init.page.result.product_status.product_active)
                                                        ?
                                                        ''
                                                        :
                                                        <React.Fragment>
                                                            <div className="product-quantity">
                                                                <div className="price-text">Quantity:</div>
                                                                <div className="quantity-buttons">
                                                                    <div className="quantity minus"><button className="quantity-minus" aria-label="Minus count" onClick={e=>this.changeQuantity(e,false)}><svg className="minus-icon" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 42 42" style={{enableBackground: "new 0 0 42 42"}} xmlSpace="preserve"><rect y="19" width="42" height="4"/></svg></button></div>
                                                                    <div className="quantity input"><input className="quantity-number" readOnly type="text" name="product-quantity" value={this.state.addQuantity} /></div>
                                                                    <div className="quantity plus"><button className="quantity-plus" aria-label="Plus count" onClick={e=>this.changeQuantity(e,true)}><svg className="plus-icon" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 42 42" style={{enableBackground: "new 0 0 42 42"}} xmlSpace="preserve"><polygon points="42,19 23,19 23,0 19,0 19,19 0,19 0,23 19,23 19,42 23,42 23,23 42,23 "/></svg></button></div>
                                                                </div>
                                                            </div>
                                                            <div className="product-total-price">
                                                                <div className="price-text">Total Price:</div>
                                                                <div className="price-value">
                                                                    {price}
                                                                </div>
                                                            </div>

                                                        </React.Fragment>
                                                    }
                                                </div>
                                                    <div className="product-button">
                                                        {(this.props.init.page.result.category_id !== 46 || (this.state.selectedSize && this.state.selectedMaterial)) &&
                                                        <button className="add-to-cart" aria-label="Add to card" onClick={e=>this.addToCart(e)}>Add to Cart</button>
                                                        }
                                                    </div>
                                                </React.Fragment>
                                            :
                                            <div className={'row'}>
                                                <div className="col-sm-12">
                                                    <div className="price-text">Please select all options!</div>
                                                </div>
                                            </div>
                                        }
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div className={'container'}>
                            <div className={'product-description-wrapper'}>
                                <div className="product-description-left">
                                    <ProductDescription description={this.getProductDescription()} />
                                    <Reviews
                                        reviews={this.props.init.page.result.product_reviews}
                                        productId={this.props.matchObject.id}
                                    />
                                </div>
                                <div className="product-description-right">
                                    <RelatedProducts products={this.props.init.page.result.related} />
                                </div>
                                <div className={'product-description-left reviews-mobile'}>
                                    <Reviews
                                        reviews={this.props.init.page.result.product_reviews}
                                        productId={this.props.matchObject.id}
                                    />
                                </div>
                            </div>
                        </div>
                    </section>
                    {this.props.init.viewed_products && this.props.init.viewed_products.length>0&&
                    <section className="dark with-full-title">
                        <div className="container">
                            <ViewedProducts
                                title={'Recently Viewed Products'}
                                products={this.props.init.viewed_products}
                                owl={!isMobile()}
                            />
                        </div>
                    </section>
                    }
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonData) }}
                    />
                </section>
            </main>
        )
    }
}




Product.propTypes = {
    init: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    init: state.init,
    cart: state.cart,
});
    export default connect(mapStateToProps)(Product);
