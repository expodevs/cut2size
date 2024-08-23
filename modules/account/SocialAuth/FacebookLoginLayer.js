import React, { Component } from 'react';
import FacebookLogin from "react-facebook-login";
class FacebookLoginLayer extends Component {

    isNotServer() {
        if (typeof window != 'undefined' && window.document) {
            return <FacebookLogin
                appId={this.props.appId}
                autoLoad={this.props.autoLoad}
                fields="name,email,picture"
                callback={this.props.callback}
                textButton={this.props.textButton}
                icon="fa-facebook"
                onFailure={this.props.onFailure}
                size="small"
            />
        }
    }

    render() {
        return this.isNotServer();
    }

}

export default FacebookLoginLayer;