import React, { Component } from 'react';
import {
    Link,
    withRouter
}from 'react-router-dom';
import {store} from "../../../../store";
import {getInfo} from "../../../../actions/admin";
import Breadcrumbs from "../breadcrumbs";
import {signCustomer} from "../../../../actions/authentication";



class AccountActivate extends Component {


    state={
        errors:false
    };




    componentDidMount() {
        let token = this.props.match.params.token;
        if(token){
            let mobile = new URLSearchParams(this.props.location.search);

            mobile = mobile.get('mobile');
            this.activateAccount(token,mobile)
        }

    }


    activateAccount (token,mobile){
        this.setState({success:false});
        this.setState({errors:false});
        let url = '/customers/activate/'+token;
        console.log('activateAccount');
        store.dispatch(getInfo(url)).then(res=>{

            console.log('res',res);

            if(res && res.success){
                this.setState({success:res.success},()=>{
                    if(res.token){
                        store.dispatch(signCustomer(res.token,this.props, res.success));
                    }
                });




                if(mobile){
                    var open = window.open(mobile);
                    if (open == null || typeof(open)=='undefined'){
                        window.location.href=mobile;
                    }
                }
            }
        }).catch(error=>{
            console.log(error);
            this.setState({errors:(error.message ? error.message : error)});
            if(mobile){
                window.open(mobile);
            }
        });

    }

    render() {

        return (
            this.state.success?
                <main>
                    <section className="no-padding-bottom">
                        <Breadcrumbs
                            list={
                                [
                                    {
                                        name: 'Account Activation',
                                    },
                                ]
                            }
                        />
                    </section>
                    <section className="no-padding-top">
                        <div className="container">
                            <div className={'alert alert success activate'}>{this.state.success}</div>
                        </div>
                    </section>
                </main>
                : ''



        )
    }
}

export default withRouter(AccountActivate);
