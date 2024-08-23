import React, { PureComponent } from 'react';
import loadable from '@loadable/component'

import {store} from "../../../../store";
import {toogleLoginModal} from "../../../../actions/init";
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import WebpImage from "../parts/WebpImage";
import {locationSearchToArray} from "../../../../functions/main";
import AccountButton from "../widgets/AccountButton";
const LoginModalInner = loadable(() => import('../parts/LoginModalInner'));

class LoginModal extends PureComponent {

    state={
        errors:false,
        passwordType:'password',
        forgotShow:false,
        submitButtonDisable:false,
        forgotButtonDisable:false,
        increment:0,
        customer:this.props.customer
    };


    componentDidMount() {

        this.toggleLoginFromSearch();
        //add click outside cart listener
        if (typeof document !== 'undefined') {

            // document.addEventListener('click', this.hideShow.bind(this),{passive: true});
        }

        this.setState({increment:this.state.increment+1});
        this.forceUpdate();

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(JSON.stringify(prevProps.location.search) !==JSON.stringify(this.props.location.search)){
            this.toggleLoginFromSearch();
        }
    }


    toggleLoginFromSearch=()=>{
        let search = locationSearchToArray(this.props.location.search);
        if(search.get('login')=='true'){
            store.dispatch(toogleLoginModal(true));
        }
    };

    componentWillUnmount() {

        //remove click outside cart listener
        if (typeof document !== 'undefined') {
            // document.removeEventListener('click', this.hideShow.bind(this),false);
        }
    }






    toggleShow(e){
        e.preventDefault();

        this.setState({errors:false});
        this.setState({success:false});
        store.dispatch(toogleLoginModal(!this.props.loginShow));

    }
    hideShow(e){
        if(this.node && !this.node.contains(e.target)){
            if(!e.target.classList.contains('loginToogle')){
                store.dispatch(toogleLoginModal(false));
            }
        }
    }



    render() {

        return (

            <div className={"account-nav"} ref={node=>this.node=node}>
                <AccountButton toggleShow={this.toggleShow.bind(this)}/>
                {(this.props.loginShow||this.state.forgotShow) &&
                    <LoginModalInner
                        toggleShow={this.toggleShow.bind(this)}
                        hideShow={this.hideShow.bind(this)}
                        forgotShow={this.state.forgotShow}
                    />
                }
            </div>

        )
    }
}

LoginModal.propTypes = {
    customer: PropTypes.object.isRequired

};

const mapStateToProps = (state) => ({
    customer: state.auth.customer,
    previousUrl: state.auth.previousUrl,
    loginShow: state.init.loginShow
});
export default connect(mapStateToProps)(LoginModal);
