import React, { PureComponent } from 'react';

import {connect} from "react-redux";
import {store} from "../../../../store";
import {getAboutPage} from "../../../../actions/init";
import {groupBy} from "../../../../functions/main";
import {getWebpImage} from "../parts/webpImageSource";
import LazyLoad from "react-lazyload";
import Placeholder from "../parts/Placeholder";
import {isMobile} from "../../../../functions/frontend";


class AboutUs extends PureComponent {

    state={
        videoPlay:false,
        readMoreClick: false,
    };

    componentDidMount() {
        if(!this.props.about){
            store.dispatch(getAboutPage());
        }

        if(typeof window !=='undefined'){
            // window.addEventListener('scroll', this.handleScroll.bind(this));
        }

    }

    componentWillUnmount() {
        if(typeof window !=='undefined'){
            // window.removeEventListener('scroll', this.handleScroll.bind(this));
        }
    }

    handleScroll(event) {

        if (this.refs.videoRef) {
                const self = this;
                let target = document.getElementById('aboutVideo');
                let targetPosition = {
                    top: window.pageYOffset + target.getBoundingClientRect().top,
                    left: window.pageXOffset + target.getBoundingClientRect().left,
                    right: window.pageXOffset + target.getBoundingClientRect().right,
                    bottom: window.pageYOffset + target.getBoundingClientRect().bottom
                },
                windowPosition = {
                    top: window.pageYOffset,
                    left: window.pageXOffset,
                    right: window.pageXOffset + document.documentElement.clientWidth,
                    bottom: window.pageYOffset + document.documentElement.clientHeight
                };

                if (targetPosition.bottom > windowPosition.top &&
                    targetPosition.top < windowPosition.bottom &&
                    targetPosition.right > windowPosition.left &&
                    targetPosition.left < windowPosition.right) {
                    self.play();
                } else {

                    self.pause();
                }
        }

    }

    playVideo() {
        if(!this.state.videoPlay){
            this.play();
        }else{
            this.pause();
        }
    }

    play() {
        this.refs.videoRef.play() ;
        this.setState({videoPlay:true})
    }

    pause() {
        this.refs.videoRef.pause() ;
        this.setState({videoPlay:false})
    }

    readMore() {
        this.setState({readMoreClick: !this.state.readMoreClick});
    }

    render() {
        let page = (this.props.about && this.props.about.rows) ? this.props.about.rows : this.props.about;
        let image = false;
        let video = false;
        let descriptionPart = false;
        let description = false;

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
        if (page && page.description) {
            description = page.description;
            descriptionPart = (!this.state.readMoreClick) ? page.description.substr(0, 148) + '...</p>' : page.description;
        }
        return ( (video)?
                 <div className="container-fluid">
                     <div className="full-width-title text-align-center"><h2 className={"title"}>{page.name}</h2></div>
                    <div className={"our-mission row align-items-center no-padding-bottom"}>
                        <div className="about-text col-xl-5 col-12 order-xl-0 order-1">
                            <div className={'about-text-mobile'} dangerouslySetInnerHTML={{__html:descriptionPart}} />
                            <div className={'about-text-desktop'} dangerouslySetInnerHTML={{__html:description}} />
                                <div className={'read-more-wrapper'}>
                                <span className={'read-more'}
                                      onClick={this.readMore.bind(this)}>{!this.state.readMoreClick ? 'Read more' : 'Read less'}</span>
                                </div>
                        </div>
                        <div className="about-video col-xl-7 col-12">
                            <LazyLoad height={400} debounce={500} placeholder={<Placeholder />}>

                            <button onClick={this.playVideo.bind(this)} id="videoPlay" className=
                                    {(this.state.videoPlay ? ' play ' :'') +"video-play"}
                                ><svg className="play-icon" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 512 512" style={{enableBackground: "new 0 0 512 512"}} xmlSpace="ppageerve"><path d="M256,0C114.6,0,0,114.6,0,256s114.6,256,256,256s256-114.6,256-256S397.4,0,256,0z M344.5,269.6l-128,80c-2.6,1.6-5.5,2.4-8.5,2.4c-2.7,0-5.3-0.7-7.8-2c-5.1-2.8-8.2-8.2-8.2-14V176c0-5.8,3.2-11.2,8.2-14c5.1-2.8,11.3-2.7,16.2,0.4l128,80c4.7,2.9,7.5,8.1,7.5,13.6S349.2,266.6,344.5,269.6z"/></svg><svg className="pause-icon" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 448 448" style={{enableBackground: "new 0 0 448 448"}} xmlSpace="ppageerve"><path d="M224,0C100.3,0,0,100.3,0,224s100.3,224,224,224s224-100.3,224-224C447.9,100.3,347.7,0.1,224,0z M192,320c0,8.8-7.2,16-16,16s-16-7.2-16-16V128c0-8.8,7.2-16,16-16s16,7.2,16,16V320zM288,320c0,8.8-7.2,16-16,16s-16-7.2-16-16V128c0-8.8,7.2-16,16-16s16,7.2,16,16V320z"/></svg></button>

                            <video preload="none" ref="videoRef"  id="aboutVideo" width="100%" height="auto" poster={image ? getWebpImage(image.disk_name) : ''}>
                                <source src={video.disk_name} type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"' />
                            </video>
                            </LazyLoad>
                        </div>
                    </div>
                </div>

                    :''

                )
    }
}

const mapStateToProps = (state) => ({
    about: state.init.about,
});
export default connect(mapStateToProps)(AboutUs);
