import React, { Component } from 'react';
import {connect} from "react-redux";
import {store} from "../../../../store";
import {getHomeGalleries} from "../../../../actions/init";
import ModalGallery from './ModalGallery';
import SliderGallery from "./SliderGallery";
import CarouselGallery from "./CarouselGallery";
import CabinetsGallery from "./CabinetsGallery";


class HomeGalleries extends Component {


    componentDidMount() {
        if(!this.props.galleries){
            store.dispatch(getHomeGalleries());
        }

    }
    componentWillUpdate(nextProps){
        if(!nextProps.galleries ){
            store.dispatch(getHomeGalleries());
        }
    }

    renderGallery(gallery){
        switch(gallery.type){
            case 'carousel':
                return <CarouselGallery gallery = {gallery }/>;
            case 'calc_options':
                return <CabinetsGallery gallery = {gallery }/>;
            case 'modal':
                return <ModalGallery gallery = {gallery }/>;
            case 'slider':
                return <SliderGallery gallery = {gallery }/>;
            default:
                return '';

        }
    }


    render() {
        let galleries = this.props.galleries ? this.props.galleries : false;
        // galleries = galleries.rows ? groupBy(galleries.rows, 'type') : galleries;
        galleries = galleries.rows ? galleries.rows: galleries;

        return (

            <div id={'gallery'}>

                {
                    galleries &&  galleries.map((gallery,index)=>
                        <section key={index} className="with-full-title">
                            <div className={"container home-galleries" + (gallery.type==='calc_options' ? " options" :  (gallery.type==='slider' ? '-fluid':''))}>
                                <div className="row no-padding-top">
                                    {gallery.type==='slider' ?
                                        <div className="slider">
                                            <div className="full-width-title text-align-center"><h2 className="title">{gallery.name}</h2></div>
                                            {this.renderGallery(gallery)}
                                        </div>
                                        :
                                        <React.Fragment>
                                            <div className="full-width-title text-align-center"><h2 className="title">{gallery.name}</h2></div>
                                            {this.renderGallery(gallery)}
                                        </React.Fragment>
                                    }

                                </div>
                            </div>
                        </section>
                    )
                }
            </div>
        )
    }
}



const mapStateToProps = (state) => ({
    galleries: state.init.galleries,
});
export default connect(mapStateToProps)(HomeGalleries);

