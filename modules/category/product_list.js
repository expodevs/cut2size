import React, { Component } from 'react';
import { withRouter} from "react-router-dom";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import Slider from "react-slick";
import ProductViewedItem from "../product/ProductViewedItem";

class ProductList extends Component {

    state = {
        isMore: false
    }

    componentDidMount() {
        if (!this.props.isSlider) {
            this.setState({isMore: true})
        }
    }

    render() {


        let products =(this.props.products && this.props.products.rows ) ? [...this.props.products.rows] : (Array.isArray(this.props.products) ? [...this.props.products] : []);
        let properties = (this.props.products && this.props.products.properties) ? [...this.props.products.properties] : [];

        return (

            <div className={this.props.wrapperClass} id={this.props.id}>
                    <ListWrapper
                        owl ={this.props.owl}
                    >
                        {
                            products && products.length>0
                                ?
                                products.map((product, index) => {
                                        if (this.props.isSlider || this.state.isMore){
                                            return <ProductViewedItem
                                                key={index}
                                                product={product}
                                                itemClass={this.props.itemClass}
                                                properties={properties}
                                            />
                                        }
                                    }
                                )
                            :
                            <div>No results found</div>
                        }
                    </ListWrapper>


        </div>
        )
    }
}

export class ListWrapper extends Component {


    render(){
        let itemsCount = this.props.children.length;
        const settings = {
            dots: false,
            arrows: true,
            infinite: true,
            speed: 500,
            slidesToShow: 6,
            slidesToScroll: 1,
            rows: itemsCount > 12 ? 2 : 1,
            swipeToSlide: true,
            centerMode: false,
            responsive: [
                {
                    breakpoint: 992,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1,
                        rows: itemsCount > 4 ? 2 : 1,
                    }
                },
            ]
        };
        return (
            this.props.owl?

                <Slider {...settings} ref={slider=>this.slider=slider} >
                    {this.props.children}
                </Slider>
                :
                <React.Fragment>
                    {this.props.children}
                </React.Fragment>

        );
    }
}



Number.propTypes = {
    filters: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    filters:state.filters,
});
export default connect(mapStateToProps)(withRouter(ProductList));
