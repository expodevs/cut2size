import React, { Component } from 'react';
import axios from "axios";

const Url = process.env.REACT_APP_SERVER_URL || process.env.NEXT_PUBLIC_SERVER_URL;
const ApiServer = process.env.REACT_APP_API_SERVER_URL || process.env.NEXT_PUBLIC_API_SERVER_URL;

class OurProducts extends Component {

    state = {
        active: false,
        products: {}
    }

    constructor() {
        super();
        this.getProducts();
    }

    toggle = () => {
        this.setState({ active: !this.state.active });
    };

    getProducts()
    {
        let apiUrl = `${Url + ApiServer}/our-products`;
        axios
            .get(apiUrl)
            .then((res) => {
                console.log('DATA', res.data);
                this.setState({ products: res.data.rows });
            })
            .catch((err) => {
                console.log('error');
                console.log(err);
            });
    }

    render() {

        const { active, products } = this.state;

        return (<>
            {products && products.length > 0 && <button className={"btn-products-widget "+(active?" active":"")} onClick={this.toggle}>Our Products
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_17_18086)">
                        <path d="M11.0002 5V16.17L6.12021 11.29C5.73021 10.9 5.09021 10.9 4.70021 11.29C4.31021 11.68 4.31021 12.31 4.70021 12.7L11.2902 19.29C11.6802 19.68 12.3102 19.68 12.7002 19.29L19.2902 12.7C19.6802 12.31 19.6802 11.68 19.2902 11.29C18.9002 10.9 18.2702 10.9 17.8802 11.29L13.0002 16.17V5C13.0002 4.45 12.5502 4 12.0002 4C11.4502 4 11.0002 4.45 11.0002 5Z" fill="#fff"/>
                    </g>
                    <defs>
                        <clipPath id="clip0_17_18086">
                            <rect width="24" height="24" fill="white"/>
                        </clipPath>
                    </defs>
                </svg>
            </button>}
            {active && <div className="products-widget-wrapper">
                <div className="products-widget-wrap">
                    {products.map((product) => {
                        return <div className="item-product">
                            <div className="thumb">
                                <a href={product.link}>
                                    {product.system_files
                                        && product.system_files.length > 0
                                        && <img src={product.system_files[0].url} alt={product.name}/>}
                                </a>
                            </div>
                            <a href={product.link} className="title">{product.name}</a>
                            <div className="link-wrap"><a href={product.link}>More</a></div>
                        </div>
                    })}
                </div>
            </div>}
        </>)
    }

}

export default OurProducts