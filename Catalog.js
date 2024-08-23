import React, {Component} from 'react';
import ViewedProducts from './modules/ViewedProducts';
import CategoriesModule from './modules/catalog/categories';
import {store} from "../../store";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {
    getCatalog,
    getContacts,
    getCatalogGalleries,
    setStaticPage,
    setCatalog,
    setGalleries,
    getMenu,
    getSocial,
    getCatalogCategories,
    getCalculateCategories,
} from "../../actions/init";

import $ from 'jquery';
import Breadcrumbs from "./modules/breadcrumbs";
import WebpImage from "./modules/parts/WebpImage";
import axios from "axios";
import {isMobile} from "../../functions/frontend";

if (typeof window === 'undefined') {
    global.window = {}
} else {
    window.jQuery = $;
    window.$ = $;
    global.jQuery = $;
}

class Catalog extends Component {

    state = {
        featured_products: false
    }

    constructor(props) {
        super(props);
        if (!this.props.init.catalog) {
            store.dispatch(getCatalog());
        }
        if (!this.props.init.galleries) {
            store.dispatch(getCatalogGalleries());
        }

        if (!this.props.catalogCategories) {
            store.dispatch(getCatalogCategories());
        }

        if (!this.props.calculateCategories) {
            store.dispatch(getCalculateCategories());
        }

        if (!this.state.featured_products) {
            this.getFeaturedProducts();
        }
    }

    componentWillUnmount() {
        store.dispatch(setStaticPage(false));
        store.dispatch(setCatalog(false));
        store.dispatch(setGalleries(false));
    }

    componentWillUpdate(nextProps) {
        if (!nextProps.init.catalog) {
            store.dispatch(getCatalogGalleries());
        }
    }

    getFeaturedProducts() {
        let apiUrl = process.env.REACT_APP_API_SERVER_URL+'/products?featured=1';
        axios.get(apiUrl)
            .then(res => {
                this.setState({featured_products: res.data});
            })
            .catch(err => {
                console.log('error');
                console.log(err);
            })
    }

    render() {
        let page = this.props.init.staticPage;
        let images = (page && page.system_files) ? page.system_files : false;

        return (
            <main>
                {(images && images[0]) &&
                <section className="no-padding-bottom catalog">
                    <div className="container-fluid">
                        <div className="row no-padding">
                            <div className="category-main-image  col-12"><WebpImage
                                src={(images && images[0]) ? images[0].disk_name : ''}
                                alt={(images && images[0]) ? images[0].disk_name : ''}/></div>
                        </div>
                    </div>
                </section>
                }
                <section className="no-padding">
                    <Breadcrumbs
                        list={
                            [
                                {
                                    name: 'Catalog'
                                }
                            ]
                        }
                    />
                </section>
                <section className="no-padding">
                    <div className="container">
                        <div className="row categories">
                            <div className="category-title col-12">
                                <h1>PRODUCT CATEGORIES</h1>
                            </div>
                        </div>
                    </div>
                </section>
                {this.props.init.catalogCategories &&
                <section className={'background-grey catalog-category no-padding'}>
                    <div className="container">
                        <div className="row">
                            <CategoriesModule/>
                        </div>
                    </div>
                </section>
                }
                {(page && page.description) ?
                    <section className={''}>
                        <div className="container">
                            <div className={'category-seo'} dangerouslySetInnerHTML={{__html: page.description}}/>
                        </div>
                    </section>
                : ''}
                <section className="dark with-full-title">
                    <div className="container">
                        <ViewedProducts
                            title={'Featured Products'}
                            description={'SAMPLE TEXT Trend, design, innovation, tradition, and selection. In our newly designed and user-friendly Decorative Hardware Website section, you can enjoy an offering of cabinet hardware with the widest selection of finishes, materials, and design combinations.\n'}
                            products={this.state.featured_products ? this.state.featured_products : []}
                            owl={!isMobile()}
                        />
                    </div>
                </section>
            </main>
        )
    }
}

Catalog.serverFetch = [getCatalog, getContacts, getSocial, getMenu, getCatalogCategories, getCalculateCategories]; // static declaration of data requirements

Catalog.propTypes = {
    init: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    init: state.init,
    catalogCategories: state.init.catalogCategories,
    calculateCategories: state.init.calculateCategories,
});
export default connect(mapStateToProps)(Catalog);
