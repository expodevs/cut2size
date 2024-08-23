import React, { Component } from 'react';
import {withRouter} from 'react-router-dom';

import PropTypes from "prop-types";
import {connect} from "react-redux";
import {store} from "../../../../store";
import {getProducts} from "../../../../actions/init";


class ProductsSort extends Component {


    constructor(props) {
        super(props);
        const params = new URLSearchParams(this.props.location.search);
        const sort = params.get('sort');
        let currentSort =  {
            name : 'Default',
            value : 'sort',
        };


        let sortList = [
            {name : 'Default',value : 'sort'},
            {name : 'Featured',value : 'featured'},
            {name : 'Price',value : 'price'},
            {name : 'Date',value : 'createdAt'},
            {name : 'Name',value : 'name'},
        ];
        if(sort && sort!==''){
            for(let i in sortList){

                if(sortList[i].value===sort){
                    currentSort =  sortList[i];
                    break;
                }
            }
        }


        this.state  = {
            sort:currentSort ,
            list:sortList,
            openSort : false
        };
    }

    openSort(e){
        e.preventDefault();
        const toggledIsOpen = !this.state.openSort;

        this.setState({
            openSort: toggledIsOpen
        });
    }
    sort(e,item){
        this.setState({sort:item});

        const toggledIsOpen = !this.state.openSort;

        this.setState({
            openSort: toggledIsOpen
        });


        let url = this.props.matchObject.slug;
        let page = this.props.activePage;
        let limit = this.props.limit;
        url+= '&offset='+((page-1)*limit);
        url+= '&limit='+limit;
        url+= '&sort='+item.value;


        const params = new URLSearchParams(this.props.location.search);
        params.set('sort', item.value);

        let newUrl = `${this.props.location.pathname}?${params}`;

        this.props.history.push( newUrl);

        store.dispatch(getProducts(url));
    }

    render() {

        return (
            <div className="sorting">
                <p className="sorting-text">Sort <span className={'items-count'}>{this.props.count} items</span> by:</p>
                <div className={"sorting-variant"+(this.state.openSort ? ' active ' : '')}>
                    <p className="current-sorting"
                       onClick={e=> this.openSort(e)}
                    >{this.state.sort.name}</p>
                    <ul className="sorting-list">
                        {this.state.list.map((item,index)=>{
                            return <li key={index} className={"list-item "+( (this.state.sort.value ===item.value) ? ' current ' : '')} onClick={e=>this.sort(e,item)}>{item.name}</li>
                        })}
                    </ul>
                </div>
            </div>


        )
    }
}

ProductsSort.propTypes = {
    init: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    init:state.filters,
});
export default connect(mapStateToProps)(withRouter(ProductsSort));
