import React, { Component } from 'react';
import MoreButton from "../MoreButton";
import {checkActive} from "../../../../../functions/main";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";


class Checkbox extends Component {





    render() {
        let index = this.props.index;
        let property_values = this.props.property_values;
        let filtersState = this.props.filters.filters;

         return (
            <div key={index} className={"filter "+property_values[0]['product_property.slug']}>
                <p className={"filter-title" + (this.props.active ? ' active' : '')} onClick={e => this.props.setActive(!this.props.active)}>{property_values[0]['product_property.name']}</p>
                <ul className={"filter-list" + (this.props.active ? ' active' : '')}>
                    { property_values.map((value_item,index_item)=>{
                        return ( <li  key={index_item} className={"filter-item "+((index_item>(this.props.count-1)) ? 'hide-filter' : '')+((value_item.exist===true) ? '' : 'deactivated') + (checkActive(filtersState,value_item) ? ' active ' : '')}>
                            <label>
                                <input disabled={!value_item.exist} onChange={e=>this.props.handleFilter(e,property_values[0]['product_property.slug'],property_values[0]['product_property.name'], value_item.slug)} type="checkbox" checked={this.props.getChecked(value_item,this.props.filters)} name={value_item.slug} value={value_item.value} />
                                <span className="filter-name">{value_item.value}</span>
                            </label>
                        </li>);
                    })}
                </ul>
                <MoreButton count={(property_values.length-this.props.count)}/>
            </div>
        )
    }
}


Checkbox.propTypes = {
    filters: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    filters:state.filters,
});
export default connect(mapStateToProps)(withRouter(Checkbox));
