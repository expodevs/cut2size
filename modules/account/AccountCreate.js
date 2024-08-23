import React, { Component } from 'react';
import {
    withRouter
}from 'react-router-dom';
import {store} from "../../../../store";
import FormErrors from "../FormErrors";
import Breadcrumbs from "../breadcrumbs";
import {login} from "../../../../actions/authentication";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import LoginForm from "./LoginForm";
import {Modal, ModalBody} from "reactstrap";
import {formSubmit, toogleLoginModal} from "../../../../actions/init";



class AccountCreate extends Component {


    state={
        errors:false,
        passwordType:'password',
        forgotShow:false,
        submitButtonDisable:false,
        forgotButtonDisable:false,
    };



    setPassType(e,type){
        e.preventDefault();
        this.state[type]==='password' ? this.setState({[type]:'text'}): this.setState({[type]:'password'})
    }


    login (e){
        e.preventDefault();
        store.dispatch(login(e,false,this.props,this.setState.bind(this)))
    }


    forgot (e){
        e.preventDefault();

        this.setState({errors:false});
        this.setState({success:false});
        this.setState({forgotButtonDisable: true});
        store.dispatch(formSubmit(e,'post')).then(res=>{
            this.setState({forgotButtonDisable: false});
            if(res.data.errors){
                this.setState({errors:res.data.errors})
            }else{
                this.setState({success:res.data});
                let self = this;
                setTimeout(()=>{
                    self.toggleForgot(e,true)
                },2000);
            }

        }).catch(error=>{
            this.setState({forgotButtonDisable: false});

            this.setState({errors:(error.message ? error.message : error)})

        });
    }

    toggleForgot(e, close){
        e.preventDefault();

        this.setState({errors:false});
        this.setState({success:false});
        this.setState({forgotShow:!this.state.forgotShow});
        // if(close){
        //     store.dispatch(toogleLoginModal(true));
        // }else{
        //     store.dispatch(toogleLoginModal(false));
        // }

    }
    goToSign(e){
        e.preventDefault();
        store.dispatch(toogleLoginModal(true));
        if(typeof window !== 'undefined'){
            window.scrollTo(0, 0);
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
                                    name: 'Account',
                                },
                            ]
                        }
                    />
                </section>
                <section className="no-padding-top">
                    <div className="container">
                        <div className="row">
                            <div className="account-create col-12">
                                <h1 className="account-title">Create Account</h1>
                                <div className="create-form login-form">

                                    <LoginForm
                                        passwordType = {this.state.passwordType}
                                        submitButtonDisable = {this.state.submitButtonDisable}
                                        setPassType = {this.setPassType.bind(this)}
                                        setState = {this.setState.bind(this)}
                                        login = {this.login.bind(this)}
                                        toggleForgot = {this.toggleForgot.bind(this)}
                                        goToSign = {this.goToSign.bind(this)}
                                    />

                                    {this.state.errors? <FormErrors formErrors={this.state.errors} />:''}
                                    {this.state.success? <div  className={'alert alert-success '}>{this.state.success}</div>:''}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                {this.state.forgotShow &&

                <Modal isOpen={this.state.forgotShow} toggle={this.state.toggleForgot} className="modal-dialog">
                    {/*<ModalHeader toggle={this.toggle}>NEED ANY HELP?</ModalHeader>*/}
                    <ModalBody>
                        <div className="forgot-modal">
                            <div id="forgotModal" className="forgot-content">
                                <div className="forgot-title"><h4>Password Renewal</h4></div>
                                <div className="forgot-form">
                                    <form id="forgotPassword"action="/customers/reset" method="post" onSubmit={e=>this.forgot(e)}>
                                        <div className="field"><p>Please enter the e-mail address used to register. We will send your new password to that address.</p></div>
                                        <div className="field email">
                                            <label><input name="email" type="email" placeholder="Email Address" /></label>
                                        </div>
                                        <div className="field submit"><a href="/"   onClick={e=>this.toggleForgot(e,true)}  className="back-to-login">Back</a><input type="submit" value="Send" disabled={this.state.forgotButtonDisable}/></div>

                                        {this.state.errors? <FormErrors formErrors={this.state.errors} notModal={true}/>:''}
                                        {this.state.success? <div  className={'alert alert-success '}>{this.state.success}</div>:''}
                                    </form>
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                </Modal>


                }
            </main>
        )
    }
}

AccountCreate.propTypes = {
    customer: PropTypes.object.isRequired

};

const mapStateToProps = (state) => ({
    customer: state.auth.customer,
    previousUrl: state.auth.previousUrl,
    loginShow: state.init.loginShow,

});
export default connect(mapStateToProps)(withRouter(AccountCreate));

