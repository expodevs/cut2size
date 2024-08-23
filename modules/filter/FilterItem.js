import React, { Component } from 'react';

import Number from "./Items/Number";
import Checkbox from "./Items/Checkbox";



class FilterItem extends Component {

    state = {
        active: true
    }

    componentDidMount() {
        let property_values = this.props.property_values;
        if (property_values[this.props.keyItem][0]['product_property.filter_open'])
            this.setActive(true);
    }

    setActive(active) {
        this.setState({active: active});
    }

    getChecked(value,filters){


        if(filters && filters.filters && filters.filters[value['product_property.slug']]){
            let filterVals = filters.filters[value['product_property.slug']].values;
            for(let i in filterVals){
                if(filterVals[i] === value.value){
                    return true;
                }
            }

        }
        return false
    }

    render() {

        let index = this.props.index;
        let property_values = this.props.property_values;
        let key = this.props.keyItem;
        switch(property_values[key][0]['product_property.type']){
            case 'number':
                return(<Number active={this.state.active} setActive={this.setActive.bind(this)} name={key}  getChecked = {this.getChecked.bind(this)} handleFilter={this.props.handleFilter}  count = {this.props.count} property_values={property_values[key]} index={index}/>);
            default:
                return(<Checkbox active={this.state.active} setActive={this.setActive.bind(this)} getChecked = {this.getChecked.bind(this)} handleFilter={this.props.handleFilter}   count = {this.props.count} property_values={property_values[key]} index={index}/>);
        }
    }
}
export default FilterItem
