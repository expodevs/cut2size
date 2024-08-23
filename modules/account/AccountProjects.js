import React, { Component } from 'react';

import {store} from "../../../../store";
import {getInfo} from "../../../../actions/admin";
import {getInfoByUrl} from "../../../../actions/init";



class AccountProjects extends Component {

    state={
        projects:false,
        errors:false,
        success:false,
        loadingProjects:false,
        loadingRequest:false
    };

    componentDidMount() {
        if(!this.state.projects){
            this.getProjects();
        }
    }


    getProjects(){
        const ApiUrl = process.env.REACT_APP_API_SERVER_URL;
        this.setState({loadingProjects:true});
        store.dispatch(
            getInfo(ApiUrl+'/orders/get-projects?email='+this.props.account.email))
            .then(res=>{
                if(res.errors){
                    this.setState({errors:res.errors})
                }else{
                    this.setState({projects:res});
                }
                this.setState({loadingProjects:false});

            })
            .catch(error=>{
                console.log('error',error);

                this.setState({errors:error,loadingProjects:false})

            });


    }
    requestPayment(e,estimate_id,partner_id){
        e.preventDefault();
        const ApiUrl = process.env.REACT_APP_API_SERVER_URL+'/orders/request-payment?estimate_id='+estimate_id+'&partner_id='+partner_id;
        if(!this.state.loadingRequest){
            this.setState({loadingRequest:true});
            store.dispatch(
                getInfoByUrl(ApiUrl))
                .then(res=>{
                    if(res.errors){
                        this.setState({errors:res.errors})
                    }else{
                        this.getProjects();
                    }
                    this.setState({loadingRequest:false});

                })
                .catch(error=>{
                    this.setState({errors:error,loadingRequest:false})

                });
        }

    }


    render() {
        return (
            <React.Fragment>
                <h1 className="account-title">My Projects</h1>
                <div className="orders-history">
                    <div className="orders-list">
                        {this.state.loadingProjects && <span>Loading...</span>}
                        {(this.state.projects && this.state.projects[0] && this.state.projects[0].estimateToPartner) ?
                            this.state.projects[0].estimateToPartner.map((estimate,index)=>

                                <div className="order-item" key={index}>
                                    <ul className="order-information">
                                        <li className="order-number">№ <span>{estimate.estimate.number}</span></li>
                                        <li className="order-total">Total: <span>{estimate.estimate.total}$</span></li>
                                        <li className="order-total">KickBack: <span>{estimate.estimate.total*estimate.discount/100}$ ({estimate.discount}%)</span></li>
                                        <li className="order-status"><span className="completed">{estimate.status}</span></li>
                                        {estimate.status === 'SENT'?
                                            <li className="orders">
                                                <button className="btn btn-success" onClick={e=>this.requestPayment(e,estimate.estimate_id, estimate.partner_id)} type="button">{this.state.loadingRequest ? ' Loading... ' : 'REQUEST PAYMENT'}</button>
                                            </li>
                                            : ''}
                                    </ul>
                                </div>
                            )
                            : ''}
                    </div>
                </div>
            </React.Fragment>
        )
    }
}


export default AccountProjects;
