import React, { Component } from 'react';
import Filters from './modules/filter/Filters';
import ViewedProducts from './modules/ViewedProducts';
import $ from 'jquery';
import {getCatalog, getMenu, getProducts, getSocial, setStaticPage} from "../../actions/init";
import {store} from "../../store";
import ProductList from "./modules/category/product_list";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import Pagination from "react-js-pagination";
import CurrentBadges from "./modules/filter/CurrentBadges";
import ProductsSort from "./modules/product/ProductsSort";
import {groupBy} from "../../functions/main";
import Breadcrumbs from "./modules/breadcrumbs";
import WebpImage from "./modules/parts/WebpImage";
import CategoriesModule from "./modules/catalog/categories";
import axios from "axios";
import {isMobile} from "../../functions/frontend";
import {setFilters} from "../../actions/filters";
import ProductLineList from "./modules/product/ProductLineList";
if (typeof window === 'undefined') {
    global.window = {}
}else{
    window.jQuery = $;
    window.$ = $;
    global.jQuery = $;
}


class Category extends Component {

    state = {
        featured_products: false,
        filtersOpen: false,
				isActive: false,
    }

    constructor(props) {
        super(props);
        const params = new URLSearchParams(this.props.location.search);
        const page = params.get('page');
        let activePage = 1;
        if(page && page>0){
            activePage = parseInt(page);
        }
        this.state  = {
            activePage: activePage,
            limit: process.env.REACT_APP_PRODUCTS_LIMIT,
        };
    }
    componentWillUnmount() {
        console.log('unmount category');
        store.dispatch(setStaticPage(false));
    }

    componentDidMount() {
        if(!this.props.init.products){
            // this.getInfo(this.props.matchObject.slug,this.state.activePage,this.state.limit);
        }
        if (!this.props.init.catalog) {
            store.dispatch(getCatalog());
        }

        if (!this.state.featured_products) {
            this.getFeaturedProducts();
        }

        // start on top page
        $(function () {
            $('html, body').animate({scrollTop : 0},10);
        });



        // show/hide category navigation
        $('.category-navigation .current-category').click(function () {
            if ( $(this).parent('.category-navigation').hasClass('active')) {
                $(this).parent('.category-navigation').removeClass('active');
            } else {
                $(this).parent('.category-navigation').addClass('active');
            }
        });

        $('.category-navigation .category-list .list-item').click(function () {
            var categoryName;

            categoryName = $(this).text();

            $('.category-navigation .category-list .list-item').removeClass('current');
            $(this).addClass('current');

            $('.category-navigation .current-category').text(categoryName);
            $('.category-navigation').removeClass('active');

        });

        $('body').click(function(e) {
            if ($(e.target).closest('.category-navigation').length === 0) {
                if ($('.category-navigation').hasClass('active')) {
                    $('.category-navigation').removeClass('active');
                }
            }
        });


    }

    handlePageChange(pageNumber, add = false) {
        const params = new URLSearchParams(this.props.location.search);
        params.set('page', pageNumber);

        let newUrl = `${this.props.location.pathname}?${params}`;
        if(pageNumber ===1){
             newUrl = `${this.props.location.pathname}`;
        }


        this.props.history.push( newUrl);

        this.setState({activePage: pageNumber});

        this.getInfo(this.props.matchObject.slug,pageNumber,this.state.limit, add);
    }

		toggleFilters = () => {
			this.setState({ isActive: !this.state.isActive });
		}
    getInfo (url,page, limit, add = false){

        url+= '&offset='+((page-1)*limit);
        url+= '&limit='+limit;
        store.dispatch(getProducts(url, add));
    }


    getPageUrl(page){

        if(page===1){
            return '';
        }
        return '?page='+page;
    }

    getFeaturedProducts() {
        let apiUrl = `${process.env.REACT_APP_API_SERVER_URL}/products/?featured=1&active=1&category_id=${this.props.init.page.result.id}`;
        axios.get(apiUrl)
            .then(res => {
                this.setState({featured_products: res.data});
            })
            .catch(err => {
                console.log('error');
                console.log(err);
            })
    }

    openFilters(value) {
        this.setState({filtersOpen: !value});
    }

    resetFilters() {
        store.dispatch(setFilters(false));
        this.setState({filtersOpen: false});
        this.props.history.push(this.props.matchObject.slug);
        store.dispatch(getProducts(this.props.matchObject.slug));
    }

    render() {
        let category = this.props.init.page.result;
        let products = {...this.props.init.products};

        let selectedFiltersCount = 0;
        let filters = this.props.filters ? (this.props.filters.filters ? this.props.filters.filters : []) : [];
        Object.keys(filters).map(function(index, item) {
            if (index !== 'page')
                selectedFiltersCount = selectedFiltersCount + filters[index].values.length;
        })
        let activePage = this.state.activePage;
        let images = groupBy(category.system_files, 'field');
        return (
            <main>
                {images.main &&
                    <section className="no-padding-bottom catalog">
                        <div className="container-fluid">
                            <div className="row no-padding">
                                <div className="category-main-image col-12"><WebpImage src={images.main ? images.main[0].disk_name : ''} alt={images.main ? images.main[0].file_name : ''}  width="1920" height="230"/></div>
                            </div>
                        </div>
                    </section>
                }
                <section className="no-padding">
                    <Breadcrumbs
                        list={
                            [
                                {
                                    link: '/catalog',
                                    name: 'Catalog',
                                },
                                {
                                    name: category.name,
                                }
                            ]
                        }
                    />
                </section>
                <section className="no-padding-top">
                    <div className="container">
                        <div className="category row">
                            <div className="category-title col-12">
                                <h1>{category.name}</h1>
                            </div>
                            <div className="category-content col-md-12">
                                <div>
                                    <div className="filters-toggle-btn" onClick={this.toggleFilters}>
                                        <span className="ico">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <path d="M11 8L20 8" stroke="#333333" stroke-width="2" stroke-linecap="round"/>
                                                <path d="M4 16L14 16" stroke="#333333" stroke-width="2" stroke-linecap="round"/>
                                                <ellipse cx="7" cy="8" rx="3" ry="3" transform="rotate(90 7 8)" stroke="#333333" stroke-width="2" stroke-linecap="round"/>
                                                <ellipse cx="17" cy="16" rx="3" ry="3" transform="rotate(90 17 16)" stroke="#333333" stroke-width="2" stroke-linecap="round"/>
                                            </svg>
                                        </span>
                                        Filters</div>
                                </div>
                                <div className={this.state.isActive ? "filters-wrapper open" : "filters-wrapper"}>
                                    <div className="row">
                                        <div className="shrink">
                                            <Filters
                                                matchObject={ this.props.matchObject }
                                                limit = {this.state.limit}
                                                activePage = {this.state.activePage}
                                                isOpen={this.state.filtersOpen}
                                                openFilters={this.openFilters.bind(this)}
                                                resetFilters={this.resetFilters.bind(this)}
                                            />
                                        </div>
                                        <div className={'shrink'}>
                                            <ProductLineList/>
                                        </div>
                                        <div className="shrink">
                                            <div className="category-sorting">
                                                <ProductsSort  count={this.props.init.products.count} matchObject={ this.props.matchObject } limit = {this.state.limit} activePage = {this.state.activePage}/>
                                                <div className="filter-result">
                                                    <CurrentBadges matchObject={ this.props.matchObject } limit = {this.state.limit} activePage = {this.state.activePage}/>
                                                </div>
                                                <div className={'filter-btn'} onClick={e=> this.openFilters(this.state.filtersOpen)}>Filter by
                                                    {selectedFiltersCount && selectedFiltersCount > 0 ?
                                                        <span>{selectedFiltersCount}</span>
                                                        : ''
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                    <ProductList  itemClass={'product-layout col-xl-4 col-lg-4 col-md-4 col-sm-6'} wrapperClass={'category-products  row'}
                                                  products={products}
                                    />
                                <div className={'load-more'}>
                                    <button onClick={e => {this.handlePageChange(activePage + 1, true)}}>Load More items</button>
                                </div>
                                <div className="product-pagination">
                                    <Pagination
                                        activePage={this.state.activePage}
                                        itemsCountPerPage={parseInt(this.state.limit)}
                                        totalItemsCount={this.props.init.products.count || 0}
                                        pageRangeDisplayed={20}
                                        itemClass={'pagination-item'}
                                        linkClass={'pagination-link'}
                                        activeLinkClass={'current'}
                                        prevPageText={'<- Prev Page'}
                                        nextPageText={'Next Page ->'}
                                        itemClassPrev={'pagination-prev'}
                                        itemClassNext={'pagination-next'}
                                        hideFirstLastPages={true}
                                        hideDisabled={true}
                                        getPageUrl = {this.getPageUrl.bind(this)}
                                        onChange={this.handlePageChange.bind(this)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
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
                <section className="background-white no-padding-top">
                    <div className="container">
                        <div className="row">
                            <div className="category-title col-12">
                                <h1>more product categories</h1>
                            </div>
                        </div>
                        <CategoriesModule/>
                    </div>
                </section>
                {
                    this.props.init.viewed_products && this.props.init.viewed_products.length>0&&
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
            </main>
        )
    }
}


Category.serverFetch = [getProducts,getMenu,getSocial]; // static declaration of data requirements


Category.propTypes = {
    init: PropTypes.object.isRequired,
    filters: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    init: state.init,
    filters: state.filters,
});
export default connect(mapStateToProps)(Category);
