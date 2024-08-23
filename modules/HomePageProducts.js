import React, { Component } from 'react';
import ProductList from "./category/product_list";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import axios from "axios";

class HomePageProducts extends Component {

    state = {
        products: []
    };

    constructor(props) {
        super(props);
        this.getProducts();
    }

    getProducts() {
        let apiUrl = process.env.REACT_APP_API_SERVER_URL+'/products/getHome';
        console.log('url', apiUrl)
        axios.get(apiUrl)
            .then(res => {
                if (res.data && res.data.rows) {
                    this.setState({products: res.data.rows});
                }
            })
            .catch(err => {
                console.log('error');
                console.log(err);
            })
    }

    render() {
        return (
            this.state.products && this.state.products.length > 0
                    ?
                    <div className="module module-viewed-products row align-items-center">
                        <div className="full-width-title text-align-center">
                            <h2 className="title">FEATURED PRODUCTS</h2>
                        </div>
                        <ProductList isSlider={true} owl={this.props.owl} products = {this.state.products} itemClass={'viewed-product'} wrapperClass={'viewed-products col-xl-12 col-lg-12 col-md-12 col-sm-12 p-3'}/>
                    </div>
                    :''

        )
    }
}
HomePageProducts.propTypes = {
    init: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    init: state.init,
});
export default connect(mapStateToProps)(HomePageProducts);
