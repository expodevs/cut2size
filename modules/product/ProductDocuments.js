

import React, { Component } from 'react';
import {groupBy} from "../../../../functions/main";
import WebpImage from "../parts/WebpImage";

class ProductDocuments extends Component {



    render() {
        return (
            this.props.documents?
                    <div className="tab-content related-documents">
                        <ul className="documents-list row">
                            {this.props.documents.map((document,index)=>{
                                let images = groupBy(document.system_files, 'field');
                                return ( <li key={index} className="documents-item col-xl-2 col-lg-3 col-md-3 col-sm-3">
                                    {/* eslint-disable-next-line react/jsx-no-target-blank */}
                                        <a className="document-link" href={images.main[0].disk_name} rel="nofollow" target="_blank">
                                            <span className="document-name">{document.caption||images.main[0].file_name}</span>
                                        </a>
                                </li>);
                            })}
                         </ul>
                    </div>
                : ''

        );
    }
}

export default ProductDocuments;
