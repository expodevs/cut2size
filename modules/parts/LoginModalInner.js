import React, {PureComponent} from 'react';
import {
    Link,
    withRouter
}from 'react-router-dom';

import {store} from "../../../../store";
import {toogleLoginModal} from "../../../../actions/init";
import {setPreviousUrl} from "../../../../actions/authentication";
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {customerLogout} from "../../../../functions/frontend";
import RegisterForm from "../account/RegisterForm";
import Tabs from '../parts/Tabs';
import LoginForm from "../account/LoginForm";

class LoginModalInner extends PureComponent {

    state={
        errors:false,
        passwordType:'password',
        repasswordType:'password',
        submitButtonDisable:false,
        loginSuccess: false,
    };

    constructor(props){
        super(props);
        this.unlisten = this.props.history.listen((location, action) => {
            store.dispatch(toogleLoginModal(false));
        });
    }



    setPassType(e,type){
        e.preventDefault();
        this.state[type]==='password' ? this.setState({[type]:'text'}): this.setState({[type]:'password'})
    }



    componentWillUnmount() {
        this.unlisten();

    }



    setPreviousUrl=(e)=>{
        // e.preventDefault();
        let previousUrl = this.props.history.location.pathname+this.props.history.location.hash;
        store.dispatch(setPreviousUrl(previousUrl));

    };


    render() {
        const account = this.props.account;
        let isPartner = account && account.customer_roles && account.customer_roles['partner'];
        let isCustomer = account && account.customer_roles && account.customer_roles['customer'];

        return (
            <React.Fragment>
                {this.props.loginShow ?
                    <div id="accountModal" className="account-modal" style={{
                        maxHeight: '90vh',
                    }}>
                        {(this.props.customer && this.props.customer.id) ?
                            <div className="account-information">
                                <div className="account-name"><b>Hello!</b><p>{this.props.customer.email}</p></div>
                                <div className={'logout-btn'} onClick={e=>customerLogout(e, this.props.history)}>Log Out</div>

                                <ul className="account-list">
                                    <li><Link to="/account-information"><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 350 350" style={{enableBackground: "new 0 0 350 350"}} xmlSpace="preserve"><g><path d="M175,171.2c38.9,0,70.5-38.3,70.5-85.6C245.5,38.3,235.1,0,175,0s-70.5,38.3-70.5,85.6C104.5,132.9,136.1,171.2,175,171.2z"/><path d="M41.9,301.9C41.9,299,41.9,301,41.9,301.9L41.9,301.9z"/><path d="M308.1,304.1C308.1,303.3,308.1,298.6,308.1,304.1L308.1,304.1z"/><path d="M307.9,298.4c-1.3-82.3-12.1-105.8-94.4-120.7c0,0-11.6,14.8-38.6,14.8s-38.6-14.8-38.6-14.8c-81.4,14.7-92.8,37.8-94.3,118c-0.1,6.5-0.2,6.9-0.2,6.1c0,1.4,0,4.1,0,8.7c0,0,19.6,39.5,133.1,39.5c113.5,0,133.1-39.5,133.1-39.5c0-3,0-5,0-6.4C308.1,304.6,308,303.7,307.9,298.4z"/></g></svg><span>My Account</span></Link></li>
                                    {!!isCustomer &&
                                    <li><Link to="/account-information/#orders">
                                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 512 512" style={{enableBackground: "new 0 0 512 512"}} xmlSpace="preserve"><g><path d="M75,497c0,8.3,6.7,15,15,15h331c8.3,0,15-6.7,15-15v-45H75V497z"/><path d="M421,86H90c-8.3,0-15,6.7-15,15v321h361V101C436,92.7,429.3,86,421,86z M197.1,352.1l-29.5,29.5c-2.8,2.8-6.6,4.4-10.6,4.4s-7.8-1.6-10.6-4.4l-12-12c-5.9-5.9-5.9-15.4,0-21.2c5.9-5.9,15.4-5.9,21.2,0l1.4,1.4l18.9-18.9c5.9-5.9,15.4-5.9,21.2,0C203,336.8,203,346.2,197.1,352.1z M197.1,263.1l-29.5,29.5c-2.8,2.8-6.6,4.4-10.6,4.4s-7.8-1.6-10.6-4.4l-12-12c-5.9-5.9-5.9-15.4,0-21.2c5.9-5.9,15.4-5.9,21.2,0l1.4,1.4l18.9-18.9c5.9-5.9,15.4-5.9,21.2,0C203,247.8,203,257.2,197.1,263.1z M197.1,173.6l-29.5,29.5c-2.9,2.9-6.8,4.4-10.6,4.4s-7.7-1.5-10.6-4.4l-12-12c-5.9-5.9-5.9-15.4,0-21.2c5.9-5.9,15.4-5.9,21.2,0l1.4,1.4l18.9-18.9c5.9-5.9,15.4-5.9,21.2,0C203,158.3,203,167.8,197.1,173.6z M361,372H246.2c-8.3,0-15-6.7-15-15s6.7-15,15-15H361c8.3,0,15,6.7,15,15S369.3,372,361,372z M361,283H246.2c-8.3,0-15-6.7-15-15s6.7-15,15-15H361c8.3,0,15,6.7,15,15S369.3,283,361,283z M361,193.5H246.2c-8.3,0-15-6.7-15-15c0-8.3,6.7-15,15-15H361c8.3,0,15,6.7,15,15S369.3,193.5,361,193.5z"/><path d="M205,15c0-8.3-6.7-15-15-15h-70c-8.3,0-15,6.7-15,15v41h100V15z"/><path d="M406,15c0-8.3-6.7-15-15-15h-70c-8.3,0-15,6.7-15,15v41h100V15z"/></g></svg>
                                        <span>Orders</span></Link></li>
                                    }
                                    {!!isPartner &&
                                    <li><Link to="/account-information/#partner-orders">
                                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 512 512" style={{enableBackground: "new 0 0 512 512"}} xmlSpace="preserve"><g><path d="M75,497c0,8.3,6.7,15,15,15h331c8.3,0,15-6.7,15-15v-45H75V497z"/><path d="M421,86H90c-8.3,0-15,6.7-15,15v321h361V101C436,92.7,429.3,86,421,86z M197.1,352.1l-29.5,29.5c-2.8,2.8-6.6,4.4-10.6,4.4s-7.8-1.6-10.6-4.4l-12-12c-5.9-5.9-5.9-15.4,0-21.2c5.9-5.9,15.4-5.9,21.2,0l1.4,1.4l18.9-18.9c5.9-5.9,15.4-5.9,21.2,0C203,336.8,203,346.2,197.1,352.1z M197.1,263.1l-29.5,29.5c-2.8,2.8-6.6,4.4-10.6,4.4s-7.8-1.6-10.6-4.4l-12-12c-5.9-5.9-5.9-15.4,0-21.2c5.9-5.9,15.4-5.9,21.2,0l1.4,1.4l18.9-18.9c5.9-5.9,15.4-5.9,21.2,0C203,247.8,203,257.2,197.1,263.1z M197.1,173.6l-29.5,29.5c-2.9,2.9-6.8,4.4-10.6,4.4s-7.7-1.5-10.6-4.4l-12-12c-5.9-5.9-5.9-15.4,0-21.2c5.9-5.9,15.4-5.9,21.2,0l1.4,1.4l18.9-18.9c5.9-5.9,15.4-5.9,21.2,0C203,158.3,203,167.8,197.1,173.6z M361,372H246.2c-8.3,0-15-6.7-15-15s6.7-15,15-15H361c8.3,0,15,6.7,15,15S369.3,372,361,372z M361,283H246.2c-8.3,0-15-6.7-15-15s6.7-15,15-15H361c8.3,0,15,6.7,15,15S369.3,283,361,283z M361,193.5H246.2c-8.3,0-15-6.7-15-15c0-8.3,6.7-15,15-15H361c8.3,0,15,6.7,15,15S369.3,193.5,361,193.5z"/><path d="M205,15c0-8.3-6.7-15-15-15h-70c-8.3,0-15,6.7-15,15v41h100V15z"/><path d="M406,15c0-8.3-6.7-15-15-15h-70c-8.3,0-15,6.7-15,15v41h100V15z"/></g></svg>
                                        <span>My Orders</span></Link></li>
                                    }
                                    {!!isCustomer &&
                                    <li><Link to="/account-information/#saved-cart">
                                        <i className='fa fa-save fa-2x'/>
                                        <span>Saved Carts</span></Link></li>
                                    }
                                    {/*{!!isCustomer &&*/}
                                    {/*<li><Link to="/account-information/#planner-projects">*/}
                                    {/*    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 124.34 125.76" style={{enableBackground: "new 0 0 124.34 125.76"}} xmlSpace="preserve"><g><path d="M2.8,19.56L61.05,0.17c0.7-0.24,1.42-0.21,2.07,0.01V0.17l59.01,20.21c1.45,0.49,2.33,1.9,2.2,3.37 c0.01,0.07,0.01,0.15,0.01,0.24v68.63h-0.01c0,1.19-0.65,2.33-1.79,2.91l-58.59,29.77c-0.49,0.3-1.07,0.47-1.69,0.47 c-0.66,0-1.26-0.19-1.77-0.52L1.76,94.61c-1.11-0.58-1.75-1.71-1.75-2.89H0V22.8C0,21.15,1.22,19.79,2.8,19.56L2.8,19.56L2.8,19.56 z M74.79,58.73c2.92-1.42,5.82-2.83,8.73-4.23c2.9-1.4,5.79-2.79,8.69-4.18c3.41-1.64,6.19-2.45,8.36-2.46 c2.18-0.01,4.05,0.57,5.61,1.73c1.57,1.16,2.8,2.78,3.7,4.87c0.91,2.09,1.53,4.45,1.86,7.12c0.52,4.16,0.45,7.63-0.25,10.42 c-0.69,2.79-1.84,5.43-3.43,7.91c-1.6,2.49-3.41,4.53-5.43,6.14c-2.76,2.2-5.3,3.92-7.61,5.13c-3.23,1.7-6.45,3.4-9.69,5.1 c-3.24,1.71-6.48,3.43-9.73,5.15C75.4,94.38,75.2,87.3,75.06,80.2C74.93,73.07,74.85,65.91,74.79,58.73L74.79,58.73z M86.92,62.52 c0.17,3.79,0.35,7.58,0.55,11.36c0.2,3.77,0.41,7.53,0.63,11.28c1.04-0.53,2.08-1.07,3.12-1.61c2.66-1.38,4.53-2.64,5.61-3.8 c1.06-1.15,1.85-2.6,2.35-4.36c0.5-1.76,0.6-4.24,0.32-7.45c-0.37-4.27-1.28-6.86-2.75-7.78c-1.46-0.92-3.73-0.64-6.84,0.88 C88.91,61.53,87.92,62.03,86.92,62.52L86.92,62.52z M26.7,61.24c-2.11-1.04-4.22-2.07-6.33-3.09c-2.1-1.02-4.21-2.04-6.32-3.05 c1.22-2.91,3.36-4.79,6.46-5.62c1.54-0.41,3.38-0.53,5.52-0.32c2.14,0.21,4.59,0.73,7.34,1.6c3.16,0.99,5.87,2.12,8.12,3.36 c2.26,1.24,4.08,2.62,5.44,4.13c2.74,3.03,4.05,6.16,3.92,9.33c-0.07,1.85-0.71,3.32-1.91,4.39c-1.2,1.07-2.98,1.73-5.33,1.98 c1.86,1.11,3.28,2.12,4.25,3.03c1.58,1.49,2.79,3.11,3.63,4.88c0.84,1.78,1.22,3.66,1.15,5.64c-0.1,2.48-0.92,4.55-2.5,6.19 c-1.57,1.62-3.78,2.42-6.63,2.4c-1.43-0.01-3.06-0.25-4.91-0.75c-1.84-0.5-3.91-1.24-6.19-2.21c-4.43-1.89-7.91-3.78-10.42-5.69 c-2.51-1.9-4.56-3.95-6.14-6.21c-1.56-2.23-2.73-4.7-3.49-7.43c2.26,0.63,4.53,1.27,6.79,1.9c2.26,0.63,4.53,1.27,6.8,1.89 c0.43,2.43,1.17,4.29,2.26,5.61c1.07,1.3,2.47,2.33,4.21,3.04c1.8,0.74,3.34,0.81,4.6,0.19c1.25-0.61,1.91-1.87,1.99-3.75 c0.08-1.9-0.42-3.6-1.54-5.1c-1.11-1.49-2.67-2.6-4.64-3.35c-1.06-0.4-2.52-0.73-4.39-0.99c0.35-2.56,0.7-5.14,1.06-7.74 c0.73,0.35,1.3,0.61,1.72,0.76c1.74,0.62,3.22,0.67,4.42,0.13c1.2-0.54,1.84-1.46,1.9-2.77c0.06-1.27-0.35-2.43-1.19-3.47 c-0.85-1.05-2.04-1.83-3.56-2.34c-1.58-0.53-2.87-0.56-3.91-0.08C27.87,58.21,27.14,59.39,26.7,61.24L26.7,61.24z M58.99,117.12 V51.48L6.53,27.7v62.06L58.99,117.12L58.99,117.12L58.99,117.12z M117.79,28.48L65.52,51.51v65.67l52.28-26.57V28.48L117.79,28.48 L117.79,28.48z M62.04,6.69L12.42,23.21l49.85,22.61l49.85-21.97L62.04,6.69L62.04,6.69L62.04,6.69z"/></g></svg>*/}
                                    {/*    <span>3D Planner Projects</span></Link></li>*/}
                                    {/*}*/}


                                </ul>
                            </div>
                            :
                            <div className="login-form">
                                <Tabs
                                    data={
                                        [
                                            {
                                                name: 'Login',
                                                content: <LoginForm
                                                    passwordType={this.state.passwordType}
                                                    submitButtonDisable={this.state.submitButtonDisable}
                                                    setPassType={this.setPassType.bind(this)}
                                                    setState={this.setState.bind(this)}
                                                />
                                            },
                                            {
                                                name: 'Sign Up',
                                                content: <RegisterForm
                                                    passwordType={this.state.passwordType}
                                                    repasswordType={this.state.repasswordType}
                                                    submitButtonDisable={this.state.submitButtonDisable}
                                                    setPassType={this.setPassType.bind(this)}
                                                    setState={this.setState.bind(this)}
                                                    // createAccount={this.createAccount.bind(this)}
                                                    setPreviousUrl={this.setPreviousUrl.bind(this)}
                                                />
                                            },
                                            {
                                                name: 'Partners login',
                                                content: <LoginForm
                                                    passwordType={this.state.passwordType}
                                                    submitButtonDisable={this.state.submitButtonDisable}
                                                    setPassType={this.setPassType.bind(this)}
                                                    setState={this.setState.bind(this)}
                                                    partner={true}
                                                />
                                            },
                                        ]
                                    }
                                />

                                {/*{this.state.errors? <FormErrors formErrors={this.state.errors} />:''}*/}
                                {/*{this.state.success? <div  className={'alert alert-success '}>{this.state.success}</div>:''}*/}

                            </div>

                        }
                    </div>
                    : ''}


            </React.Fragment>
        )
    }
}

LoginModalInner.propTypes = {
    customer: PropTypes.object.isRequired,
    account: PropTypes.object,

};

const mapStateToProps = (state) => ({
    customer: state.auth.customer,
    account: state.auth.account,
    previousUrl: state.auth.previousUrl,
    loginShow: state.init.loginShow
});
export default connect(mapStateToProps)(withRouter(LoginModalInner));
