import React, { Component } from 'react';
import {
    getAboutPage,
    getContacts,
    getCountOrders,
    getDiscountAmounts,
    getHomeGalleries,
    getHomePage,
    getMenu,
    getSocial,
    setGalleries,
    setStaticPage,
    getPromoCode, getCatalogCategories, getCalculateCategories,
} from "../../actions/init";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {store} from "../../store";
import AboutUs from "./modules/home/AboutUs";
import SliderGallery from "./modules/galleries/SliderGallery";
import {groupBy} from "../../functions/main";
import HowCut2sizeWorks from "../site/modules/home/HowCut2sizeWorks";
import VideoItems from "../site/modules/home/VideoItems";
import Numbers from "./modules/home/Numbers";
import ClientComments from "./modules/home/ClientComments";
import Portfolio from "./modules/home/Portfolio";
import {isMobile} from "../../functions/frontend";
import HomePageProducts from "./modules/HomePageProducts";
import CategoriesModule from "./modules/catalog/categories";
import Instagram from "./modules/home/Instagram";

class Home extends Component {

    constructor(props) {
        super(props);

        if(!this.props.galleries){
            store.dispatch(getHomeGalleries());
        }
        if(!this.props.contacts){
            store.dispatch(getContacts());
        }
        if(!this.props.social){
            store.dispatch(getSocial());
        }
        if(!this.props.countOrders){
            store.dispatch(getCountOrders());
        }
        if(!this.props.discountAmounts){
            store.dispatch(getDiscountAmounts());
        }
        if(!this.props.promoCode){
            store.dispatch(getPromoCode());
        }

        if (!this.props.init.catalogCategories) {
            store.dispatch(getCatalogCategories());
        }

        if (!this.props.init.calculateCategories) {
            store.dispatch(getCalculateCategories());
        }

    }

    componentWillUnmount() {
        store.dispatch(setStaticPage(false));
        store.dispatch(setGalleries(false));

    }

    componentDidUpdate() {

        this.scrollToHash();
    }

    componentDidMount() {

        this.scrollToHash();

    }

    scrollToHash=()=>{
        let hash = this.props.location.hash;

        if (hash && typeof window!=='undefined') {

            let element = document.querySelector(hash);
            if(element){
                const topPos = element.getBoundingClientRect().top ;
                window.scrollTo({
                    top: topPos, // scroll so that the element is at the top of the view
                    behavior: 'smooth' // smooth scroll
                })
            }
        }
    };

    render() {
        let sliderGallery = (this.props.galleries&&this.props.galleries.rows)  ? (groupBy(this.props.galleries.rows,'type').slider[0] ? groupBy(this.props.galleries.rows,'type').slider[0] : false)  : false;
        let tempProjectsGallery =(this.props.galleries&&this.props.galleries.rows)  ? (groupBy(this.props.galleries.rows,'name').portfolio[0] ? groupBy(this.props.galleries.rows,'name').portfolio[0] : false)  : false;
        return (
            <main>
                <section className={"with-full-title first-title background-grey" +  (this.props.promoCode ? ' with-promo' : '')} id="top">
                    <div className="slider-home-wrapper">
                        <SliderGallery gallery={sliderGallery} />
                    </div>
                </section>
                <section className="with-full-title background-white">
                    <HowCut2sizeWorks/>
                </section>

                {this.props.init.catalogCategories && this.props.init.catalogCategories.rows
                    && this.props.init.calculateCategories && this.props.init.calculateCategories.rows &&
                <section className={'background-grey pt-4'}>
                    <div className="container">
                        <div className="row">
                            <div className="category-title col-12">
                                <h1>PRODUCT CATEGORIES</h1>
                            </div>
                            <CategoriesModule catalogCategories={this.props.init.catalogCategories} calculateCategories={this.props.init.calculateCategories}/>
                        </div>
                    </div>
                </section>
                }
                <section className="with-full-title background-grey">
                    <VideoItems/>
                </section>
                <section className="dark with-full-title">
                    <div className="container">
                        <HomePageProducts
                            owl={true}
                        />
                    </div>
                </section>
                {/*<section className="with-full-title background-white" id="gallery">
                    <Tabs galleries={this.props.galleries} />
                </section>*/}
                <section id="about" className="with-full-title background-grey">
                    <AboutUs/>
                </section>
                {isMobile() ? <div className="calc-button mobile"><a href="/calc-categories">Get Instant Quote</a></div> : ''}
                <section className="with-full-title background-white">
                    <Numbers/>
                </section>
                    <Instagram/>
                {/*<section className={"with-full-title background-grey"}>
                    <Portfolio gallery={tempProjectsGallery}/>
                </section>*/}
                {/*<section className={"background-white"}>*/}
                {/*    <FreeShipping discountAmounts={this.props.discountAmounts}/>*/}
                {/*</section>*/}
                {isMobile() ? '' :
                    <section className=" background-white">
                        <ClientComments/>
                    </section>
                }
            </main>
        )
    }
}

Home.serverFetch = [getContacts,getSocial,getHomeGalleries,getAboutPage,getHomePage,getMenu,getCountOrders,getDiscountAmounts, getCatalogCategories, getCalculateCategories]; // static declaration of data requirements


Home.propTypes = {
    kit: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    init: state.init,
    kit: state.kit,
    page: state.init.staticPage,
    galleries: state.init.galleries,
    countOrders: state.init.countOrders,
    discountAmounts: state.init.discountAmounts,
    promoCode: state.init.promoCode,
    contacts: state.init.contacts,
    social: state.init.social,
});
export default connect(mapStateToProps)(Home);
