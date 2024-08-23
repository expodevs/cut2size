import React, { Component } from 'react';
import {getMenu, getPageInfo} from "../../actions/init";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import PagesKit from "./modules/page/PagesKit";
import {withRouter} from "react-router-dom";
import ReactDOM from "react-dom";
import PageModule from "./modules/page/PageModule";


class Page extends Component {



    constructor(props) {
        super(props);

        this.state={
            kitInsert:true
        }
    }


    componentDidMount() {
        this.topFunction();
        this.renderKitBlock();


    }



    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.location !== prevProps.location) {
            window.scrollTo(0, 0)
        }
    }


    renderKitBlock(){

        const page = this.props.staticPage || this.props.init.page.result;
        if( document.querySelector('#pagesKit')!==null){
            //<div id="pagesKit">&nbsp;</div>
            ReactDOM.render(<PagesKit pages_kit={page.pages_kit||[]}/>, document.querySelector('#pagesKit'));
        }else{
            this.setState({
                kitInsert:false
            });
        }
    }
    topFunction() {
        window.scrollTo(0, 0);
        getPageInfo(this?.props?.match?.params?.alias)
    }

    getDescription(){
        let page = this.props.staticPage || this.props.init.page.result;

        let description = page ? page.description : '';
        if(description.indexOf('[[kits]]')!==-1){
            description = description.replace('[[kits]]','<div id="pagesKit"></div>')
        }

        return description
    }


    render() {

        return (
            <PageModule page={this.props.staticPage || this.props.init.page.result} kitInsert={this.state.kitInsert}/>
        )
    }
}


Page.serverFetch = [getPageInfo,getMenu]; // static declaration of data requirements


Page.propTypes = {
    init: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    init: state.init,
});
export default connect(mapStateToProps)(withRouter(Page));
