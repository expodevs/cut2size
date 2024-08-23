import React, { Component } from 'react';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import {connect} from "react-redux";
import {login, register} from "../../../../actions/authentication";
import {store} from "../../../../store";
import {withRouter} from "react-router-dom";
import PropTypes from "prop-types";
import FacebookLoginLayer from "./SocialAuth/FacebookLoginLayer";

class SocialAuth extends Component {

    socialResponse = (response,type) => {

        if(response && response.credential){
            if(this.props.formType==='login'){
                store.dispatch(login(false,{
                    access_token:response.credential,
                    [type]:true,
                }, this.props,this.props.setState.bind(this),"/customers/login"))
            }
            if(this.props.formType==='register'){
                store.dispatch(register(false,{
                    access_token:response.credential,
                    referral: typeof Storage!=='undefined' ?  localStorage.getItem("referral") : '',
                    [type]:true,
                }, this.props,this.props.setState.bind(this),"/customers/signup"))
            }
        }

    };

    onFailure = (error) => {
        console.log('error',error);
    };
    render() {
        let textType = this.props.formType==='login' ? 'Sign In':"Sign Up";
        return (
            <React.Fragment>
                    <div className="field submit social">
                        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_AUTH_CLIENT_ID}>
                            <GoogleLogin
                                buttonText={textType+" with Google"}
                                onSuccess={response=>this.socialResponse(response,'google_auth')}
                                onFailure={this.onFailure}
                                />
                        </GoogleOAuthProvider>
                    </div>
            </React.Fragment>
        );
    }
}

SocialAuth.propTypes = {
    customer: PropTypes.object.isRequired
};
const mapStateToProps = (state) => ({
    customer: state.auth.customer,
    previousUrl: state.auth.previousUrl,
    loginShow: state.init.loginShow
});
export default connect(mapStateToProps)(withRouter(SocialAuth));


