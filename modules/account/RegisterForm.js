import React, {Component, useState} from 'react'
import SocialAuth from "./SocialAuth";
import {store} from "../../../../store";
import {register} from "../../../../actions/authentication";
import Modal from 'react-responsive-modal';
import FormErrors from "../FormErrors";

class RegisterForm extends Component {

    state = {
        errors: false,
        success: false,
        modalShow: false,
    }

    createAccount = (e) => {
        e.preventDefault();
        store.dispatch(register(e,false,this.props,this.setState.bind(this)));
    }

    onCloseModal = () => {
        this.setState({ modalShow: false });
    };

    render() {

        return <React.Fragment>
            <form id="createForm" action={'/customers/signup'} className={'mobile'} onSubmit={e=>this.createAccount(e)} method="post">
                <div className={'login-title'}>
                    Create an account to calculate your price
                </div>
                <SocialAuth
                    formType={'register'}
                    setState={this.props.setState.bind(this)}
                />

                <div className={'login-line'}>or</div>

                <div className="field"><label>E-mail<input name="email" type="email" placeholder="Email Address"/></label></div>
                <div className="field"><label>Password<input name="password" type={this.props.passwordType} placeholder="Password"/><span onClick={e=>this.props.setPassType(e,'passwordType')} className="show-password"><svg className="eye-open" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 511.6 511.6" style={{enableBackground: "new 0 0 511.6 511.6"}} xmlSpace="preserve"><g><path d="M505.9,236.1c-26.7-43.6-62.5-78.6-107.5-105.1c-45-26.5-92.5-39.7-142.6-39.7s-97.6,13.2-142.6,39.7c-45,26.5-80.8,61.5-107.5,105.1C1.9,242.8,0,249.3,0,255.8s1.9,13,5.7,19.7c26.6,43.6,62.5,78.6,107.5,105.1c45,26.5,92.6,39.7,142.6,39.7c50.1,0,97.6-13.2,142.6-39.5c45-26.4,80.9-61.4,107.5-105.2c3.8-6.7,5.7-13.2,5.7-19.7C511.6,249.3,509.7,242.8,505.9,236.1zM194.6,158c17-17,37.4-25.6,61.2-25.6c3.8,0,7,1.3,9.7,4c2.7,2.7,4,5.9,4,9.7c0,3.8-1.3,7-4,9.7c-2.7,2.7-5.9,4-9.7,4c-16.4,0-30.4,5.8-42,17.4c-11.6,11.6-17.4,25.6-17.4,42c0,3.8-1.3,7-4,9.7c-2.7,2.7-5.9,4-9.7,4c-3.8,0-7-1.3-9.7-4c-2.7-2.7-4-5.9-4-9.7C169,195.5,177.5,175.1,194.6,158z M379.9,349c-38.2,23.1-79.5,34.7-124.1,34.7c-44.5,0-85.9-11.6-124.1-34.7s-69.9-54.2-95.2-93.2c28.9-44.9,65.2-78.5,108.8-100.8c-11.6,19.8-17.4,41.2-17.4,64.2c0,35.2,12.5,65.3,37.5,90.4s55.2,37.5,90.4,37.5c35.2,0,65.3-12.5,90.4-37.5s37.5-55.1,37.5-90.4c0-23-5.8-44.4-17.4-64.2c43.6,22.3,79.8,55.9,108.8,100.8C449.8,294.8,418,325.9,379.9,349z"/></g></svg><svg className="eye-close" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 511.6 511.6" style={{enableBackground: "new 0 0 511.6 511.6"}} xmlSpace="preserve"><g><g><path d="M361.2,291.7c15-21.8,22.6-45.9,22.6-72.4c0-7.4-0.8-15.4-2.3-24l-79.9,143.3C326.2,329.1,346.1,313.4,361.2,291.7z"/><path d="M372.9,94.2c0.2-0.4,0.3-1.2,0.3-2.6c0-3.2-1.5-5.8-4.6-7.7c-0.6-0.4-2.4-1.5-5.6-3.3c-3.1-1.8-6.1-3.6-9-5.3c-2.9-1.7-6-3.5-9.4-5.3c-3.4-1.8-6.4-3.3-8.8-4.4c-2.5-1.1-4.2-1.7-5.1-1.7c-3.4,0-6.1,1.5-8,4.6l-15.4,27.7c-17.3-3.2-34.5-4.9-51.4-4.9c-51.2,0-98.4,12.9-141.6,38.8C71,156.1,34.8,191.4,5.7,236.1C1.9,242,0,248.6,0,255.8c0,7.2,1.9,13.8,5.7,19.7c16.7,26.1,36.6,49.4,59.5,69.9c22.9,20.6,48,37,75.2,49.4c-8.4,14.3-12.6,22.6-12.6,24.8c0,3.4,1.5,6.1,4.6,8c23.2,13.3,36,20,38.3,20c3.4,0,6.1-1.5,8-4.6l14-25.4c20.2-36,50.2-89.9,90.2-161.9C322.9,183.9,352.9,130,372.9,94.2zM158.5,362.9c-49.5-22.3-90.1-58-121.9-107.1c28.9-44.9,65.2-78.5,108.8-100.8c-11.6,19.8-17.4,41.2-17.4,64.2c0,20.4,4.7,39.7,14,58c9.3,18.3,22.3,33.4,38.8,45.4L158.5,362.9z M265.5,155.9c-2.7,2.7-5.9,4-9.7,4c-16.4,0-30.4,5.8-42,17.4c-11.6,11.6-17.4,25.6-17.4,42c0,3.8-1.3,7-4,9.7c-2.7,2.7-5.9,4-9.7,4c-3.8,0-7-1.3-9.7-4c-2.7-2.7-4-5.9-4-9.7c0-23.8,8.5-44.2,25.6-61.2c17-17,37.4-25.6,61.2-25.6c3.8,0,7,1.3,9.7,4c2.7,2.7,4,5.9,4,9.7C269.5,150,268.2,153.2,265.5,155.9z"/><path d="M505.9,236.1c-10.9-18.1-24.6-35.6-41.3-52.5c-16.6-16.9-34-31.5-52.1-43.7l-18,32c31.8,21.9,58.6,49.9,80.5,83.9c-23,35.8-51.7,65-86.1,87.6c-34.4,22.7-71.7,35.7-112.1,39.1l-21.1,37.7c42.3,0,82.2-9,119.8-27.1c37.6-18.1,70.7-43.5,99.2-76.2c13.3-15.4,23.7-29.2,31.1-41.4c3.8-6.5,5.7-13,5.7-19.7C511.6,249.2,509.7,242.6,505.9,236.1z"/></g></g></svg></span></label></div>
                <div className="field"><label>Confirm Password<input name="repassword" type={this.props.repasswordType} placeholder="Confirm Password"/><span className="show-password" onClick={e=>this.props.setPassType(e,'repasswordType')}><svg className="eye-open" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 511.6 511.6" style={{enableBackground: "new 0 0 511.6 511.6"}} xmlSpace="preserve"><g><path d="M505.9,236.1c-26.7-43.6-62.5-78.6-107.5-105.1c-45-26.5-92.5-39.7-142.6-39.7s-97.6,13.2-142.6,39.7c-45,26.5-80.8,61.5-107.5,105.1C1.9,242.8,0,249.3,0,255.8s1.9,13,5.7,19.7c26.6,43.6,62.5,78.6,107.5,105.1c45,26.5,92.6,39.7,142.6,39.7c50.1,0,97.6-13.2,142.6-39.5c45-26.4,80.9-61.4,107.5-105.2c3.8-6.7,5.7-13.2,5.7-19.7C511.6,249.3,509.7,242.8,505.9,236.1zM194.6,158c17-17,37.4-25.6,61.2-25.6c3.8,0,7,1.3,9.7,4c2.7,2.7,4,5.9,4,9.7c0,3.8-1.3,7-4,9.7c-2.7,2.7-5.9,4-9.7,4c-16.4,0-30.4,5.8-42,17.4c-11.6,11.6-17.4,25.6-17.4,42c0,3.8-1.3,7-4,9.7c-2.7,2.7-5.9,4-9.7,4c-3.8,0-7-1.3-9.7-4c-2.7-2.7-4-5.9-4-9.7C169,195.5,177.5,175.1,194.6,158z M379.9,349c-38.2,23.1-79.5,34.7-124.1,34.7c-44.5,0-85.9-11.6-124.1-34.7s-69.9-54.2-95.2-93.2c28.9-44.9,65.2-78.5,108.8-100.8c-11.6,19.8-17.4,41.2-17.4,64.2c0,35.2,12.5,65.3,37.5,90.4s55.2,37.5,90.4,37.5c35.2,0,65.3-12.5,90.4-37.5s37.5-55.1,37.5-90.4c0-23-5.8-44.4-17.4-64.2c43.6,22.3,79.8,55.9,108.8,100.8C449.8,294.8,418,325.9,379.9,349z"/></g></svg><svg className="eye-close" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 511.6 511.6" style={{enableBackground: "new 0 0 511.6 511.6"}} xmlSpace="preserve"><g><g><path d="M361.2,291.7c15-21.8,22.6-45.9,22.6-72.4c0-7.4-0.8-15.4-2.3-24l-79.9,143.3C326.2,329.1,346.1,313.4,361.2,291.7z"/><path d="M372.9,94.2c0.2-0.4,0.3-1.2,0.3-2.6c0-3.2-1.5-5.8-4.6-7.7c-0.6-0.4-2.4-1.5-5.6-3.3c-3.1-1.8-6.1-3.6-9-5.3c-2.9-1.7-6-3.5-9.4-5.3c-3.4-1.8-6.4-3.3-8.8-4.4c-2.5-1.1-4.2-1.7-5.1-1.7c-3.4,0-6.1,1.5-8,4.6l-15.4,27.7c-17.3-3.2-34.5-4.9-51.4-4.9c-51.2,0-98.4,12.9-141.6,38.8C71,156.1,34.8,191.4,5.7,236.1C1.9,242,0,248.6,0,255.8c0,7.2,1.9,13.8,5.7,19.7c16.7,26.1,36.6,49.4,59.5,69.9c22.9,20.6,48,37,75.2,49.4c-8.4,14.3-12.6,22.6-12.6,24.8c0,3.4,1.5,6.1,4.6,8c23.2,13.3,36,20,38.3,20c3.4,0,6.1-1.5,8-4.6l14-25.4c20.2-36,50.2-89.9,90.2-161.9C322.9,183.9,352.9,130,372.9,94.2zM158.5,362.9c-49.5-22.3-90.1-58-121.9-107.1c28.9-44.9,65.2-78.5,108.8-100.8c-11.6,19.8-17.4,41.2-17.4,64.2c0,20.4,4.7,39.7,14,58c9.3,18.3,22.3,33.4,38.8,45.4L158.5,362.9z M265.5,155.9c-2.7,2.7-5.9,4-9.7,4c-16.4,0-30.4,5.8-42,17.4c-11.6,11.6-17.4,25.6-17.4,42c0,3.8-1.3,7-4,9.7c-2.7,2.7-5.9,4-9.7,4c-3.8,0-7-1.3-9.7-4c-2.7-2.7-4-5.9-4-9.7c0-23.8,8.5-44.2,25.6-61.2c17-17,37.4-25.6,61.2-25.6c3.8,0,7,1.3,9.7,4c2.7,2.7,4,5.9,4,9.7C269.5,150,268.2,153.2,265.5,155.9z"/><path d="M505.9,236.1c-10.9-18.1-24.6-35.6-41.3-52.5c-16.6-16.9-34-31.5-52.1-43.7l-18,32c31.8,21.9,58.6,49.9,80.5,83.9c-23,35.8-51.7,65-86.1,87.6c-34.4,22.7-71.7,35.7-112.1,39.1l-21.1,37.7c42.3,0,82.2-9,119.8-27.1c37.6-18.1,70.7-43.5,99.2-76.2c13.3-15.4,23.7-29.2,31.1-41.4c3.8-6.5,5.7-13,5.7-19.7C511.6,249.2,509.7,242.6,505.9,236.1z"/></g></g></svg></span></label></div>
                <div className="field submit">
                    <input type="hidden" name={'referral'} value={typeof Storage!=='undefined' ?  localStorage.getItem("referral") : ''}/>
                    <input className="create-account" type="submit" value="Create Account" disabled={this.props.submitButtonDisable} />
                </div>
            </form>
            {this.state.errors? <FormErrors formErrors={this.state.errors} notModal={false}/>:''}
            <Modal open={this.state.modalShow} onClose={this.onCloseModal} blockScroll={false} center
                styles={{
                    modal: {
                        maxWidth: "350px",
                        textAlign: 'center',
                    }
                }}
            >
                <div className="modal-body">
                    <div className={'email-icon-modal'}></div>
                    <div className={'check-email-title'}>Check your Email</div>
                    <p className={'check-email-text'}>Thank you for choosing Cut2Size!</p>
                    <p className={'check-email-text'}>To finish your registration please follow the link we have sent to your email.</p>
                </div>
            </Modal>
        </React.Fragment>;
    }

};

export default RegisterForm
