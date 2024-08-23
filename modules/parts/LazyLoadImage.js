import React,{PureComponent} from 'react';
import LazyLoad from 'react-lazyload';
import Placeholder from './Placeholder';
import {CSSTransition} from 'react-transition-group';
import WebpImage from "./WebpImage";


class LazyLoadImage extends PureComponent{

    render() {
        return <LazyLoad height={this.props.height} debounce={500} placeholder={<Placeholder height={this.props.height}/>}
                         offset={this.props.offset}
                         overflow={this.props.overflow}
                         once
    >
        <CSSTransition key="1"
                       appear={true}
                       timeout={1}
        >
            {this.props.noWebp ?
                <img className={this.props.classImage} src={this.props.src} alt={this.props.alt} {...this.props}/>
                :
                <WebpImage classImage={this.props.classImage} alt={this.props.alt} src={this.props.src} />

            }
        </CSSTransition>
    </LazyLoad>


    }
}
export default React.memo(LazyLoadImage);
