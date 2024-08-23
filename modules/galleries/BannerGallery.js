import React, { Component } from 'react';

import {groupArrayBy, keyLengthExists} from "../../../../functions/main";

import {Link} from "react-router-dom";
import LazyLoadImage from "../parts/LazyLoadImage";

class BannerGallery extends Component {



    getClassname(item){
        switch(item.content_type){
            case 'application/pdf':
                return 'pdf';
            case 'link':
                if(item.disk_name.indexOf('youtu')!==-1){
                    return 'youtube fancybox.iframe';
                }
            default:
                return '';
        }
    }
    render() {
        let gallery = this.props.gallery;

        let gallery_images =gallery  ?  keyLengthExists(gallery.gallery_images,'system_files'): false;

        let images = gallery_images ? groupArrayBy(gallery_images, 'field', 'system_files') : false;
        return (

            gallery_images ?


                <div className="module row">
                    <div className="module-title col-12">
                        <h3>Actual today</h3>
                    </div>
                    <div className="banner-list col-12">
                        <div className="row align-items-center no-padding">
                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                                {(images && images[0]  )?
                                <div className="banner ">
                                    <div className="banner-image">
                                            <Link to={(images[0].main && images[0].main[0]) ? images[0].main[0].disk_name: ''}><LazyLoadImage src={(images[0].small && images[0].small[0]) ? images[0].small[0].disk_name: ''} alt={(images[0].small && images[0].small[0]) ? images[0].small[0].disk_name: ''} /></Link>
                                    </div>
                                    <div className="banner-title">

                                        <h5><Link to={(images[0].main && images[0].main[0]) ? images[0].main[0].disk_name: ''}>{(images[0].main && images[0].main[0]) ? images[0].main[0].file_name: ''}</Link></h5>

                                    </div>
                                </div>
                                            :''}
                            </div>
                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                                {(images && images[1]  )?
                                <div className="banner ">
                                    <div className="banner-image">
                                        <Link to={(images[1].main && images[1].main[0]) ? images[1].main[0].disk_name: ''}><LazyLoadImage src={(images[1].small && images[1].small[0]) ? images[1].small[0].disk_name: ''} alt={(images[1].small && images[1].small[0]) ? images[1].small[0].disk_name: ''} /></Link>
                                    </div>
                                    <div className="banner-title">
                                        <h5><Link to={(images[1].main && images[1].main[0]) ? images[1].main[0].disk_name: ''}>{(images[1].main && images[1].main[0]) ? images[1].main[0].file_name: ''}</Link></h5>
                                    </div>
                                </div>
                                    :''}
                                <div className="banners row no-padding">
                                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6">
                                        {(images && images[2]  )?
                                        <div className="banner ">
                                            <div className="banner-image">
                                                <Link to={(images[2].main && images[2].main[0]) ? images[2].main[0].disk_name: ''}><LazyLoadImage src={(images[2].small && images[2].small[0]) ? images[2].small[0].disk_name: ''} alt={(images[2].small && images[2].small[0]) ? images[2].small[0].disk_name: ''} /></Link>
                                            </div>
                                            <div className="banner-title">
                                                <h5><Link to={(images[2].main && images[2].main[0]) ? images[2].main[0].disk_name: ''}>{(images[2].main && images[2].main[0]) ? images[2].main[0].file_name: ''}</Link></h5>
                                            </div>
                                        </div>
                                            :''}
                                    </div>
                                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6">
                                        {(images && images[3]  )?
                                        <div className="banner ">
                                            <div className="banner-image">
                                                <Link to={(images[3].main && images[3].main[0]) ? images[3].main[0].disk_name: ''}><LazyLoadImage src={(images[3].small && images[3].small[0]) ? images[3].small[0].disk_name: ''} alt={(images[3].small && images[3].small[0]) ? images[3].small[0].disk_name: ''} /></Link>
                                            </div>
                                            <div className="banner-title">
                                                <h5><Link to={(images[3].main && images[3].main[0]) ? images[3].main[0].disk_name: ''}>{(images[3].main && images[3].main[0]) ? images[3].main[0].file_name: ''}</Link></h5>
                                            </div>
                                        </div>
                                            :''}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                :''

        )
    }
}



export default BannerGallery;

