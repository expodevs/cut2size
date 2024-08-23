import React, {Component} from 'react';
import axios from "axios";

class ProductLine extends Component {

    constructor(props) {
        super(props);
        this.state = { data: []};
        this.getProductLine();
    }

     getProductLine() {
        const Url = process.env.REACT_APP_SERVER_URL || process.env.NEXT_PUBLIC_SERVER_URL;
        const ApiServer = process.env.REACT_APP_API_SERVER_URL || process.env.NEXT_PUBLIC_API_SERVER_URL;

        axios.get(Url + ApiServer + '/product-lines/' + this.props.lineId)
            .then(res => {
                console.log('DATA', res.data)
                this.setState({data: res.data})
            })
    }

    render() {
        return (
            <a href={`/catalog/${this.props.categoryName}?line=${this.state.data.slug}`} className="product-line-btn">
                {this.state.data.name}
            </a>
        );
    }


}
export default ProductLine;
