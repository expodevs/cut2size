import React, { Component } from 'react';
import {Link} from "react-router-dom";
import {groupBy} from "../../../../functions/main";
import WebpImage from "../parts/WebpImage";
import {isMobile} from "../../../../functions/frontend";
import {connect} from "react-redux";
import {getCalculateCategories, getCatalogCategories} from "../../../../actions/init";


class CategoriesModule extends Component {

    state = {
        selectedCategory: false,
        catalogCategories: this.props.catalogCategories,
        calculateCategories: this.props.calculateCategories,
    }

    componentDidMount() {
        if(isMobile()){
            window.addEventListener('popstate', () => {
                window.location.reload();
            });
        }
    }

    selectCategory(category) {
        this.setState({selectedCategory:category})
    }

    render() {
        return (
            <div className="category-list list-section row col-12">
                { this.props.catalogCategories && this.props.catalogCategories.rows && this.props.catalogCategories.rows.length > 0 ?
                    this.props.catalogCategories.rows.map((category,index)=>{

                        if (category.id !== 46) {
                            let images = groupBy(category.system_files, 'field');

                            return(
                                <React.Fragment>
                                    {!isMobile() ?
                                        <Link to={'/catalog/'+category.slug} key={index} className="category-item">
                                            <div className="category-name">
                                                <h4><Link to={category.slug}>{category.name}</Link></h4>
                                            </div>
                                            <div className="category-image">
                                                <Link to={'/catalog/'+category.slug}>
                                                    {(images && images.small)
                                                        ?
                                                        <WebpImage src={images.small ? images.small[0].disk_name : ''}
                                                                   alt={images.small ? images.small[0].file_name : ''}
                                                                   width="215"
                                                                   height="250"
                                                        />
                                                        :

                                                        ''
                                                    }
                                                </Link>
                                            </div>
                                            <Link to={'/catalog/'+category.slug} className={'category-view-btn'}>
                                                View Products
                                            </Link>
                                        </Link>
                                        :
                                        <React.Fragment>
                                            <div key={index} className={"category-item" + (this.state.selectedCategory.slug === category.slug ? ' selected' : '')}
                                                 onClick={e => this.selectCategory(category)}>
                                                <div className="cat-info-row">
                                                    <div className="category-image">
                                                        {(images && images.small) ?
                                                            <WebpImage src={images.small ? images.small[0].disk_name : ''}
                                                                       alt={images.small ? images.small[0].file_name : ''}
                                                                       width="69"
                                                                       height="80"/>
                                                            :

                                                            ''}
                                                    </div>
                                                    <div className="category-name">
                                                        <h4>{category.name}</h4>
                                                    </div>

                                                </div>

                                                <Link to={'/catalog/'+category.slug}
                                                      className={'category-view-btn-mobile' + (this.state.selectedCategory.slug === category.slug ? ' selected' : '')}>
                                                    View
                                                </Link>
                                            </div>

                                        </React.Fragment>
                                    }
                                </React.Fragment>
                            );
                        }

                    }):
                    ''
                }
                { this.state.calculateCategories && this.state.calculateCategories.rows && this.state.calculateCategories.rows.length > 0 ?
                    this.state.calculateCategories.rows.map((category, index)=>{

                        let images = groupBy(category.system_files, 'field');
                        let image = images['system_files[]'] ? images['system_files[]'][0] : false;

                        return(
                            <React.Fragment>
                                {!isMobile() ?
                                    <a href="#" onClick={() => { window.location.replace('/' + category.url) }}
                                       key={index} className="category-item">
                                        <div className="category-name">
                                            <h4><Link to={category.url}>{category.name}</Link></h4>
                                        </div>
                                        <div className="category-image">
                                            <a href="#" onClick={() => { window.location.replace('/' + category.url)}}>
                                                {image ?
                                                    <WebpImage src={image ? image.url : ''}
                                                               alt={image ? image.file_name : ''}
                                                               width="215"
                                                               height="250"
                                                    />
                                                    :
                                                    ''
                                                }
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
                                            <div className="cat-info-row">
                                                <div className="category-image">
                                                    {image ?
                                                        <WebpImage src={image ? image.url : ''}
                                                                   alt={image ? image.file_name : ''}
                                                                   width="69"
                                                                   height="80"
                                                        />
                                                        :
                                                        ''}
                                                </div>
                                                <div className="category-name">
                                                    <h4>{category.name}</h4>
                                                </div>
                                            </div>
                                            <Link to={'/'+category.url}
                                               className={'category-view-btn-mobile' + (this.state.selectedCategory.url === category.url ? ' selected' : '')}>
                                                View
                                            </Link>
                                        </div>

                                    </React.Fragment>
                                }
                            </React.Fragment>
                        );
                    }):
                    ''
                }
            </div>
        )
    }
}

CategoriesModule.serverFetch = [getCatalogCategories, getCalculateCategories];

const mapStateToProps = (state) => ({
    catalogCategories: state.init.catalogCategories,
    calculateCategories: state.init.calculateCategories,
});

export default connect(mapStateToProps)(CategoriesModule)
