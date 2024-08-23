import React, { Component } from 'react';


import ProductList from "./category/product_list";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import axios from "axios";



class ViewedProducts extends Component {

    state = {
        actual_products_id: [],
        products: []
    };

    constructor(props) {
        super(props);
        this.getProducts();
    }

    getProducts() {
        let apiUrl = process.env.REACT_APP_API_SERVER_URL+'/products/getInfoByIds';
        let ids = this.props.products.map((el) => {
            return el['id'];
        });
        axios.get(apiUrl+'?ids='+ids.join(','))
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
            this.state.products && this.state.products.length>0
                    ?
                    <div className="module module-viewed-products row align-items-center">
                        <div className="full-width-title text-align-center">
                            <h2 className="title">{this.props.title}</h2>
                            <div className={'description col-xl-8 col-lg-8 col-md-8 col-sm-12'}>{this.props.description}</div>
                        </div>
                        <ProductList isSlider={true} owl={this.props.owl} products = {this.state.products} itemClass={'viewed-product'} wrapperClass={'viewed-products col-xl-12 col-lg-12 col-md-12 col-sm-12'}/>
                    </div>
                    :''

        )
    }
}
ViewedProducts.propTypes = {
    init: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    init: state.init,
});
export default connect(mapStateToProps)(ViewedProducts);
