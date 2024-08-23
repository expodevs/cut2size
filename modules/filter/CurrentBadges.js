import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';

import PropTypes from "prop-types";
import {connect} from "react-redux";
import {store} from "../../../../store";
import {setFilters} from "../../../../actions/filters";
import {filtersToHistory, filterToString} from "../../../../functions/main";
import {getProducts} from "../../../../actions/init";


class CurrentBadges extends Component {


    getValues(values){


        let str = [];
        for(let i in values){
            if(values[i].indexOf(':')!== -1){
                str.push('From '+ values[i].split(':')[0] + ' to '+ values[i].split(':')[1])
            }else{
                str.push(values[i])
            }
        }
        return str.join(",");

    }

    deleteFilter(e,slug){
        if(e){
            e.preventDefault();
        }

        let filters = Object.assign({}, this.props.filters.filters);

        delete filters[slug];


        if(Object.keys(filters).length===0){
            filters = false;
        }
        store.dispatch(setFilters(filters));
        let url = this.props.matchObject.slug;
        let page = this.props.activePage;
        let limit = this.props.limit;
        url+= '&offset='+((page-1)*limit);
        url+= '&limit='+limit;
        let filtersUrl  = filterToString(filters, this.props.location,this.props.history);
        filtersToHistory(filters, this.props.location,this.props.history);
        url+= '&'+filtersUrl;


        store.dispatch(getProducts(url));
    }

    clearFilters(e){
        e.preventDefault();

        store.dispatch(setFilters(false));
        filtersToHistory(false, this.props.location,this.props.history);
        let url = this.props.matchObject.slug;
        let page = this.props.activePage;
        let limit = this.props.limit;
        url+= '&offset='+((page-1)*limit);
        url+= '&limit='+limit;
        store.dispatch(getProducts(url));
    }


    render() {
        let filters = [];
        Object.keys(this.props.filters.filters).map((filter_item,index)=>{
            if (filter_item !== 'page') {
                filters.push(this.props.filters.filters[filter_item]);
            }
        });
        return (
            filters && filters.length>0 ?
                <ul className="result-list">

                    {Object.keys(filters).map((filter_item,index)=>{
                            return <li key={index} className="result-item 11"><span className="result">{filters[filter_item].name}: {this.getValues(filters[filter_item].values)}</span><button onClick={e=> this.deleteFilter(e,filter_item)} className="remove-result"><svg className="close-icon" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 10 10" style={{enableBackground: 'new 0 0 10 10'}} xmlSpace="preserve"><g><g transform="translate(-730 -756)"><g><path d="M734.5,761l-4.4,4.5c-0.1,0.1-0.1,0.3,0,0.4c0.1,0.1,0.3,0.1,0.4,0c0,0,0,0,0,0l4.5-4.5l4.5,4.5c0.1,0.1,0.3,0.1,0.4,0c0,0,0,0,0,0c0.1-0.1,0.1-0.3,0-0.4l-4.4-4.5l4.4-4.5c0.1-0.1,0.1-0.3,0-0.4c-0.1-0.1-0.3-0.1-0.4,0c0,0,0,0,0,0l-4.5,4.5l-4.5-4.5c-0.1-0.1-0.3-0.1-0.4,0c0,0,0,0,0,0c-0.1,0.1-0.1,0.3,0,0.4L734.5,761z"/></g></g></g></svg></button></li>
                        })}
                    <li className="result-item clear"><button onClick={e=>this.clearFilters(e)} className="clear-all">Clear</button></li>
                </ul>
                : ''

        )
    }
}

CurrentBadges.propTypes = {
    filters: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    filters:state.filters,
});
export default connect(mapStateToProps)(withRouter(CurrentBadges));
