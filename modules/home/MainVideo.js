

import React, { Component } from 'react';
import {connect} from "react-redux";
import {getHomePage, setPage} from "../../../../actions/init";
import {store} from "../../../../store";
import {groupBy} from "../../../../functions/main";

class MainVideo extends Component {


    componentDidMount(){
        if(!this.props.page ){
            store.dispatch(getHomePage());
        }
    }

    componentWillUpdate(nextProps){
        if(!nextProps.page ){
            store.dispatch(getHomePage());
        }
    }

    componentWillUnmount(){
        store.dispatch(setPage(false));
    }

    render() {
        let page = this.props.page;
        let image = false;
        let video = false;
        if(page && page.id){
            let files = groupBy(page.system_files, 'content_type');
            let imageKey = Object.keys(files).filter(function (key,index) {
                if(key.indexOf('image')!==-1){
                    return key
                }
            });
            let videoKey = Object.keys(files).filter(function (key,index) {
                if(key.indexOf('video')!==-1){
                    return key
                }
            });
            image = (imageKey[0] && files[imageKey[0]]&&  files[imageKey[0]][0]) ? files[imageKey[0]][0] : files[imageKey[0]];
            video = (videoKey[0] && files[videoKey[0]]&&  files[videoKey[0]][0]) ? files[videoKey[0]][0] : files[videoKey[0]];
        }

        return (
            (page &&  video)?
                <div className="container-fluid">
                    <div className="row no-padding">
                        <div className="main-video col-12">
                            <video poster={image ? image.disk_name: ''} preload="metadata" playsInline="" loop="loop"
                                   autoPlay="autoplay" muted="muted">
                                <source type="video/mp4" src={video.disk_name}/>
                            </video>
                        </div>
                    </div>
                </div>
                : ''

        );
    }
}

const mapStateToProps = (state) => ({
    page: state.init.staticPage,
});
export default connect(mapStateToProps)(MainVideo);
