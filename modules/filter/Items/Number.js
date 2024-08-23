import React, { Component } from 'react';
import InputRange from 'react-input-range';
import MoreButton from "../MoreButton";
import {checkActive} from "../../../../../functions/main";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import $ from "jquery";
if (typeof window === 'undefined') {
    global.window = {}
}else{
    window.jQuery = $;
    window.$ = $;
    global.jQuery = $;
}

if(typeof document !== "undefined"){

    require('jquery-ui-dist/jquery-ui.min');
    require('jquery-ui-touch-punch');
}
class Number extends Component {


    constructor(props){
        super(props);
        let range = this.getRangeValues(props.filters);
        this.state = {
            slider: {
                min: range.min,
                max: range.max,
            }
        }
    }


    componentWillUpdate(nextProps, nextState, nextContext) {

        if(this.props.filters !== nextProps.filters){
            let range = this.getRangeValues(nextProps.filters);
            this.setState({
                slider: {
                    min: range.min,
                    max: range.max,
                }
            })
        }
    }
    changeSliderInput(slug,name,slider){
        this.setState({ slider });

        this.props.handleFilter(false,slug,name,slider.min+':'+slider.max)
    }

    checkinput(value){
        value = parseInt(value);
        return (value>=this.state.slider.min && value<=this.state.slider.max )
    }


    getRangeValues(filters=false){
        if(
            filters
            &&filters.filters
            && this.props.property_values[0]
            && this.props.property_values[0]['product_property.slug']
            &&filters.filters[this.props.property_values[0]['product_property.slug']]
            &&filters.filters[this.props.property_values[0]['product_property.slug']].values
        ){

            let values = Array.isArray(filters.filters[this.props.property_values[0]['product_property.slug']].values)
                ? filters.filters[this.props.property_values[0]['product_property.slug']].values[0]
                : filters.filters[this.props.property_values[0]['product_property.slug']].values;
            if(values.indexOf(":")!==-1){
                values = values.split(':')
                const min =Math.min.apply(Math, values);
                const max =Math.max.apply(Math, values);
                return {min:min,max:max};
            }

        }
        const values = [...this.props.property_values].map(item=>parseFloat(item.slug));
        const min =Math.min.apply(Math, values);
        const max =Math.max.apply(Math, values);
        return {min:min,max:max};
    }



    render() {

        let index = this.props.index;
        let property_values = this.props.property_values;

        let filtersState = this.props.filters.filters;
         return (
            <div key={index} className={"filter "+property_values[0]['product_property.slug']}>
                <p className="filter-title">{property_values[0]['product_property.name']}</p>
                <InputRange
                    name={property_values[0].slug}
                    maxValue={this.getRangeValues().max}
                    minValue={this.getRangeValues().min}
                    value={this.state.slider}
                    onChange={value => this.changeSliderInput(property_values[0]['product_property.slug'],property_values[0]['product_property.name'],value)} />
                <ul className="filter-list">
                    { property_values.map((value_item,index_item)=>{
                        return ( <li key={index_item}  className={"filter-item col-4 "+((index_item>(this.props.count-1)) ? ' hide-filter ' : '')+(this.checkinput(value_item.value) ? '' : ' deactivated ') +((value_item.exist===true) ? '' : 'deactivated')+ (checkActive(filtersState,value_item) ? ' active ' : '')}><label><input  onChange={e=>this.props.handleFilter(e,property_values[0]['product_property.slug'],property_values[0]['product_property.name'],value_item.slug)} disabled={!(this.checkinput(value_item.value))}  checked={this.props.getChecked(value_item,this.props.filters)} type="checkbox" name={value_item.slug} value={value_item.value} /><span className="filter-name">{value_item.value}</span></label></li>);
                    })}
                </ul>
                <MoreButton count={(property_values.length-this.props.count)}/>
            </div>
        )
    }
}


Number.propTypes = {
    filters: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    filters:state.filters,
});
export default connect(mapStateToProps)(withRouter(Number));
