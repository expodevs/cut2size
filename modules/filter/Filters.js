import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {filtersToHistory, filterToString, getFilterName, groupBy} from "../../../../functions/main";
import FilterItem from "./FilterItem";
import {store} from "../../../../store";
import { getProducts} from "../../../../actions/init";
import {setFilters} from "../../../../actions/filters";





class Filters extends Component {


    // eslint-disable-next-line no-useless-constructor
    constructor(props) {
        super(props);
    }


    setParamsFromHistory(nextProps){
        const params = new URLSearchParams(this.props.location.search);
        let filters = {};
        for( let pair of params.entries()) {
            if(pair[0] !=='sort'){
                filters[pair[0]] = {};
                filters[pair[0]]['values'] = pair[1].split(',');
                filters[pair[0]]['name'] = getFilterName(pair[0],nextProps.init.products.properties);
            }
        }

        store.dispatch(setFilters((Object.keys(filters).length > 0) ? filters : false));
    }

    componentWillUpdate(nextProps, nextState, nextContext) {

        if(!this.props.init.products && nextProps.init.products){
            this.setParamsFromHistory(nextProps);
        }
    }

    componentDidMount() {
        this.setParamsFromHistory(this.props);
    }

    handleFilter(e,slug,name,value){
        if(e){
            // e.preventDefault();
            // e.target.setAttribute('checked', 'checked');
        }

        let filters = Object.assign({}, this.props.filters.filters);    //creating copy of object
        if(typeof filters[slug] !== 'undefined' && value.indexOf(':') === -1 && (filters[slug].values && filters[slug].values[0] && filters[slug].values[0].indexOf(':') === -1) ){
            let exist = false;
            for(let i in filters[slug]['values']){
                if(filters[slug]['values'][i]=== value){
                    filters[slug]['values'].splice(i, 1);
                    exist = true;
                    break;
                }
            }
            if(!exist){
                filters[slug]['values'].push(value);
            }
            if(filters[slug]['values'].length===0){
                delete filters[slug];
            }
        }else{
            filters[slug] = {};
            filters[slug]['values'] = [value];
            filters[slug]['name'] = name;
        }                      //updating value
        if(Object.keys(filters).length===0){
            filters = false;
        }
        this.setState({filters});
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
    render() {
        let filters = Object.assign({}, this.props.filters.filters);    //creating copy of object

        let property_values   = (this.props.init.products && this.props.init.products.properties &&  this.props.init.products.properties.length>0) ? groupBy(this.props.init.products.properties, 'property_id') : false;
        const filterLimit = process.env.REACT_APP_FILTER_VALUES_LIMIT;

        return (
            <div className={"filters" + (this.props.isOpen ? ' open' : '')}>
                <div className={'close-btn'} onClick={e => this.props.openFilters(this.props.isOpen)}></div>
                <div className={'title'}>Choose filters</div>
                <div className="filters-list">
                    {(Object.keys(property_values) && Object.keys(property_values).length>0)? Object.keys(property_values).map((key,index)=>{
                            return (<FilterItem handleFilter={this.handleFilter.bind(this)} key = {index} keyItem = {key} property_values={property_values} index={index} count = {filterLimit}/>);
                    })
                            :
                ''}
                </div>
                <div className={'filters-btn-block'}>
                    <div className={'reset-filters-btn'} onClick={e => this.props.resetFilters()}>Reset Filters</div>
                    <div className={'apply-filters-btn'} onClick={e => this.props.openFilters(this.props.isOpen)}>Apply Filters</div>
                </div>
            </div>
        )
    }
}
Filters.propTypes = {
    init: PropTypes.object.isRequired,
    filters: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    init: state.init,
    filters:state.filters,
});
export default connect(mapStateToProps)(withRouter(Filters));
