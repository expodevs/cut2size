import React, { Component } from 'react';
import MiniCart from './cart/MiniCart';
import LoginModal from './account/LoginModal';
import QuickSearch from './search/QuickSearch';
import {
    Link, withRouter
} from 'react-router-dom';
import Helmet from "react-helmet";
import PropTypes from "prop-types";
import {connect} from "react-redux";




class Breadcrumbs extends Component {





    render() {

        return (
            <div className="container">
                <div className="row no-padding-top">
                    <div className="breadcrumb col-12">
                        <ul className="breadcrumb-list">
                            <li className="breadcrumb-item">
                                <Link className="breadcrumb-link" to="/">
                                    <svg className="home-icon" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 22 20" style={{enableBackground: 'new 0 0 22 20'}} xmlSpace="preserve"><g><g transform="translate(-150 -430)"><g><path d="M171.9,438.7c-0.2,0.3-0.5,0.3-0.8,0.1c0,0,0,0,0,0l-10.1-7.5l-10.1,7.5c-0.2,0.2-0.6,0.1-0.8-0.1c0,0,0,0,0,0c-0.2-0.3-0.1-0.6,0.1-0.8l10.4-7.8c0.2-0.2,0.5-0.2,0.7,0l10.4,7.8C172,438.1,172.1,438.5,171.9,438.7L171.9,438.7zM169.6,439.6v9.9c0,0.3-0.3,0.6-0.6,0.6c0,0,0,0,0,0h-5.7c-0.3,0-0.6-0.3-0.6-0.6c0,0,0,0,0,0v-5.6c0-1-0.8-1.8-1.7-1.8c-0.9,0-1.7,0.8-1.7,1.8v5.6c0,0,0,0,0,0c0,0.3-0.3,0.5-0.6,0.5H153c-0.3,0-0.6-0.3-0.6-0.6c0,0,0,0,0,0v-9.9c0-0.3,0.3-0.6,0.6-0.6c0.3,0,0.6,0.3,0.6,0.6v9.3h4.6v-5.1c0-1.6,1.3-2.9,2.9-2.9s2.9,1.3,2.9,2.9v5.1h4.6v-9.3c0-0.3,0.3-0.6,0.6-0.6C169.3,439,169.6,439.2,169.6,439.6L169.6,439.6z"/></g></g></g></svg>
                                </Link></li>
                            {(this.props.list&& this.props.list.length>0)?
                                this.props.list.map((item,index)=>
                                    <li key={index} className="breadcrumb-item">
                                        <ItemWrapper link={item.link? item.link:false}>{item.name}</ItemWrapper>
                                    </li>
                                )
                                :''}
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}

export class ItemWrapper extends Component{

    render(){
        return(
            this.props.link?
            // todo: временный фикс, чтобы запустить рекламу. желательно потом вернуть Link
                <a href="#" onClick={() => { window.location.replace(this.props.link) }}>{this.props.children}</a>
                :
                <span className="breadcrumb-current">{this.props.children}</span>
        );
    }
}


Breadcrumbs.propTypes = {
    init: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    init: state.init,
});
export default connect(mapStateToProps)(withRouter(Breadcrumbs));