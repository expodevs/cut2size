import React, { Component } from 'react';
import {
    Link,
    withRouter
}from 'react-router-dom';

import {store} from "../../../../store";
import {getInfo} from "../../../../actions/admin";
import FormErrors from "../FormErrors";
import WebpImage from "./WebpImage";




class QuickSearchInner extends Component {



    state={
        query:'',
        result:false,
    };

    constructor(props){
        super(props);
        this.unlisten = this.props.history.listen((location, action) => {
            this.setState({result: false,query:''});
            this.props.toogleShow(false);
        });
    }

    componentWillUnmount() {
        this.unlisten();
        this.setState({result: false,query:''});
    }

    quickSearch(e){
        e.preventDefault();

        this.setState({query: e.target.value});


        const ApiUtl = process.env.REACT_APP_API_SERVER_URL;
        store.dispatch(getInfo(ApiUtl+'/search/'+e.target.value+'?limit=8'))
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
    submitSearch(e){
        e.preventDefault();
        console.log(e);
        this.props.history.push({
            pathname: "/search",
            state: {
                query: this.state.query ,
            }
        })
    }

    render() {

        return(
            <React.Fragment>
                <form id="searchForm"  className={"search-form"+(this.props.show ? ' show ' : '')} onSubmit={e=>this.submitSearch(e)} action="/search-result" method="post">
                    <label className="form-field"><input type="text" name="header-search" onChange={e=>this.quickSearch(e)} value={this.state.query} placeholder="Search" /></label>
                    <label className="submit"><button type="submit"><svg className="search-icon" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 16 16" style={{enableBackground: "new 0 0 16 16"}} xmlSpace="preserve"><g><g transform="translate(-521 -22)"><g><path className="st0" d="M536.8,37.8c-0.3,0.3-0.7,0.3-0.9,0c0,0,0,0,0,0L532,34c-2.9,2.4-7.1,1.9-9.5-0.9s-1.9-7.1,0.9-9.5c2.9-2.4,7.1-1.9,9.5,0.9c2,2.5,2,6.1,0,8.5l3.8,3.8C537,37.1,537.1,37.5,536.8,37.8C536.8,37.8,536.8,37.8,536.8,37.8zM533.1,28.7c0-3-2.4-5.4-5.4-5.4c-3,0-5.4,2.4-5.4,5.4c0,3,2.4,5.4,5.4,5.4C530.7,34.1,533.1,31.7,533.1,28.7z"/></g></g></g></svg></button></label>
                </form>

                {this.state.errors? <FormErrors formErrors={this.state.errors} />:''}

                {(this.state.result &&this.state.result.rows && this.state.result.rows.length>0 )?
                    <div className="search-results">
                        <div className="result-list">
                            {this.state.result.rows.map((product,index)=>{
                                return(
                                    <QuickSearchItem key={index} product={product}/>
                                );
                            })}
                        </div>
                    </div>
                    :''}
            </React.Fragment>
        )
    }
}

export default withRouter(QuickSearchInner);

export class QuickSearchItem extends Component {


    render() {
        let product = this.props.product;
        let image = (product.system_files && product.system_files.length>0)? product.system_files[0].disk_name: '';
        return(
            <div  className={"result-item "+((product.price_new) ? ' promotional-price' : '')}>
                <div className="product-image"><Link to={'/'+product.slug}><WebpImage src={image} alt={image}/></Link></div>
                <div className="product-information">
                    <h5 className="product-name"><Link to={'/'+product.slug}>{product.name}</Link></h5>
                    <p className="product-code"><span className="text">Product number:</span><span className="value">{product.code}</span></p>
                </div>
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
        )
    }
}
