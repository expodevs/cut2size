import React, {PureComponent} from "react";
import Helmet from "react-helmet";
import PropTypes from "prop-types";
import {connect} from "react-redux";


class Head extends PureComponent {


    getTitle(){
        let title = 'Cut2size';

        if (this.props.init.page.result && this.props.init.page.result.meta_title) {
            title = this.props.init.page.result.meta_title;
        } else if (this.props.init.staticPage && this.props.init.staticPage.meta_title) {
            title = this.props.init.staticPage.meta_title;
        } else if (this.props.staticPage && this.props.staticPage.meta_title) {
            title = this.props.staticPage.meta_title;
        }

        return title;
    }

    getDescription(){
        let description = 'Cut2size description';

        if (this.props.init.page.result && this.props.init.page.result.meta_description) {
            description = this.props.init.page.result.meta_description;
        } else if (this.props.init.staticPage && this.props.init.staticPage.meta_description) {
            description = this.props.init.staticPage.meta_description;
        } else if (this.props.staticPage && this.props.staticPage.meta_description) {
            description = this.props.staticPage.meta_description;
        }

        return description;
    }

    isPaginationOrFilter() {
        // if (window) {
        //     let url = window.location.href;
        //     let filterParam = '?1=';
        //     let paginationParam = '?page=';
        //
        //     return url.includes(filterParam) || url.includes(paginationParam)
        // }
        return false;
    }

    render() {
        return <Helmet>
                    <title>{this.getTitle()}</title>
                    <meta name="description" content={this.getDescription()} />
                    {this.isPaginationOrFilter() && <meta name="robots" content="noindex, nofollow"/>}
                </Helmet>
    }
}




Head.propTypes = {
    init: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    init: state.init,

});
export default connect(mapStateToProps)(Head);
