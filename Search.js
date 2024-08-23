import React, { Component } from 'react';
import {
    Link, withRouter,
} from 'react-router-dom';
import {store} from "../../store";
import {getInfo} from "../../actions/admin";
import FormErrors from "./modules/FormErrors";
import Breadcrumbs from "./modules/breadcrumbs";
import WebpImage from "./modules/parts/WebpImage";


class Search extends Component {



    state={
        result:false,
    };
    componentDidMount() {
        this.resultSearch();
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if(!this.props.location.state || this.props.location.state.query!==nextProps.location.state.query){

            this.resultSearch(nextProps.location.state.query);
        }
    }

    resultSearch(newQuery){

        let query=newQuery ? newQuery : ((this.props.location.state && this.props.location.state.query) ? this.props.location.state.query : null);
        const ApiUtl = process.env.REACT_APP_API_SERVER_URL;
        if(query){
            store.dispatch(getInfo(ApiUtl+'/search/'+query+'?limit=12'))
                .then(res=>{
                    if(res.errors){
                        this.setState({errors:res.errors})
                    }else{
                        this.setState({result:res});
                    }
                })
                .catch(error=>{
                    this.setState({errors:error})

                });
        }


    }
    render() {

        return (
            <main>
                <section className="no-padding-bottom">
                    <Breadcrumbs
                        list={
                            [
                                {
                                    name: 'Search Result',
                                },
                            ]
                        }
                    />
                </section>
                <section className="no-padding-top">
                    <div className="container">
                        {this.state.errors? <FormErrors formErrors={this.state.errors} />:''}
                        {(this.state.result &&this.state.result.rows && this.state.result.rows.length>0 )?
                        <div className="row">


                            <div className="col-12 search-title">
                                <h1>Your search: <span className="search-word">{this.props.location.state.query}</span>, Found: <span className="number">{this.state.result.count}</span> results                                </h1>
                            </div>

                            <div className="result-items col-12">
                                {this.state.result.rows.map((product,index)=>
                                    <SearchItem key={index} product={product}/>
                                )}
                            </div>
                        </div>
                            :''}

                    </div>
                </section>
            </main>
        )
    }
}

export default withRouter(Search);


export class SearchItem extends Component {


    render() {

        let product = this.props.product;
        let image = (product.system_files && product.system_files.length>0)? product.system_files[0].disk_name: '';
        return(
            <div className={"result-item "+((product.price_new) ? ' promotional-price' : '')}>
                <div className="product-image"><Link to={'/'+product.slug}><WebpImage src={image} alt=""/></Link></div>
                <div className="product-information">
                    <h5 className="product-name"><Link to={'/'+product.slug}>{product.name}</Link></h5>
                    <p className="product-code"><span className="text">Product number:</span><span className="value">{product.code}</span></p>
                    <div className="product-price">
                        <p className="price-text">Price:</p>
                        <p className="price-value">
                            {(product.price_new) ?
                                <React.Fragment>
                                    <b className="old-price"><span className="number">{product.price}</span><span className="currency">$</span></b>
                                    <b className="new-price"><span className="number">{product.price_new}</span><span className="currency">$</span></b>
                                </React.Fragment>
                                :
                                <b className="new-price"><span className="number">{product.price}</span><span className="currency">$</span></b>
                            }
                        </p>

                    </div>
                </div>
                <div className="product-link">
                    <Link to={'/'+product.slug}>View details</Link>
                </div>
            </div>
        )
    }
}
