import React, {Component} from 'react';
import {Link} from "react-router-dom";
import {groupBy} from "../../../../functions/main";
import WebpImage from "../parts/WebpImage";
import {isMobile} from "../../../../functions/frontend";
import axios from "axios";

class CalculateCategoriesModule extends Component {

    state = {
        selectedCategory: false
    }

    selectCategory(category) {
        this.setState({selectedCategory:category})
    }

    getCalculateCategories() {
        if (!this.state.calculate_categories) {
            let apiUrl = process.env.REACT_APP_API_SERVER_URL + '/calculate-categories';
            axios.get(apiUrl)
                .then(res => {
                    this.setState({calculate_categories: res.data});
                })
                .catch(err => {
                    console.log('error');
                    console.log(err);
                })
        }
    }

    render() {
        this.getCalculateCategories();
        let categories = this.state && this.state.calculate_categories ? this.state.calculate_categories.rows : [];

        return (<div className="category-list row col-12">
            { categories.length > 0 ?
                categories.map((category, index)=>{

                    let images = groupBy(category.system_files, 'field');
                    let image = images['system_files[]'] ? images['system_files[]'][0] : false;

                    return(
                        <React.Fragment>
                            {!isMobile() ?
                                <a href="#" onClick={() => { window.location.replace('/' + category.url) }}
                                      key={index} className="category-item col-xl-2 col-lg-3 col-md-3 col-sm-4">
                                    <div className="category-name">
                                        <h4><Link to={category.url}>{category.name}</Link></h4>
                                    </div>
                                    <div className="category-image">
                                        <a href="#" onClick={() => { window.location.replace('/' + category.url)}}>
                                            {image ?
                                                <WebpImage src={image ? image.url : ''}
                                                           alt={image ? images.file_name : ''}/>
                                                :
                                                ''}
                                        </a>
                                    </div>
                                    <a href="#" onClick={() => { window.location.replace('/' + category.url)}}
                                          className={'category-view-btn'}>
                                        View Products
                                    </a>
                                </a>
                                :
                                <React.Fragment>
                                    <div key={index} className={"category-item" + (this.state.selectedCategory.url === category.url ? ' selected' : '')}
                                         onClick={e => this.selectCategory(category)}>
                                        <div className="category-name">
                                            <h4>{category.name}</h4>
                                        </div>
                                        <div className="category-image">
                                            {image ?
                                                <WebpImage src={image ? image.url : ''}
                                                           alt={image ? images.file_name : ''}/>
                                                :
                                                ''}
                                        </div>
                                    </div>
                                    <a href="#" onClick={() => { window.location.replace('/' + category.url)}}
                                          className={'category-view-btn-mobile' + (this.state.selectedCategory.url === category.url ? ' selected' : '')}>
                                        View
                                    </a>
                                </React.Fragment>
                            }
                        </React.Fragment>
                    );
                }):
                ''
            }
        </div>)
    }
}
export default CalculateCategoriesModule
