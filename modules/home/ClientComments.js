import React, {PureComponent} from "react";
import {userDevice} from "../../../../functions/frontend";
import LazyLoadImage from "../parts/LazyLoadImage";
import Slider from "react-slick";
import {connect} from "react-redux";
import ReadMoreReact from "../widgets/ReadMore";
import Rating from "react-rating";


class ClientComments extends PureComponent {

    render() {
        let device = userDevice();
        let itemCount;
        let isNav;
        switch (device){
            case 'mobile':
            case 'tablet':
                itemCount = 1;
                isNav = true;
                break;
            default:
                itemCount = 2;
                break;
        }
        if (this.props.googleReviews?.reviews?.length > itemCount)
            isNav = true;



        const settings = {
            dots: false,
            infinite: false,
            speed: 500,
            slidesToShow: 2,
            slidesToScroll: 2,
            isNav: isNav,
            responsive: [
                {
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 2,
                        infinite: true,
                        dots: true
                    }
                },
                {
                    breakpoint: 600,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 2,
                        initialSlide: 2
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }
            ]
        };


        if(!this.props.googleReviews || !this.props.googleReviews.reviews)
            return null;




        return <div className="wrapper">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="title-reviews-con">WHAT OUR CLIENTS SAY</div>
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="row">
                    <div className="col-lg-3">
                        <div className="google-info-wrap">
                            <div className="row align-items-center">
                                <div className="shrink">
                                    <div className="logo"><img src="/images/google-logo.png" alt=""/></div>
                                </div>
                                <div className="col">
                                        <Rating
                                            className={"rating-row"}
                                            initialRating={this.props.googleReviews.rating}
                                            readonly
                                            emptySymbol={<img src="/images/icon-star-empty.svg" className="icon" />}
                                            fullSymbol={<img src="/images/icon-star-full.svg" className="icon" />}
                                        />
                                    <div className="info-rating">{this.props.googleReviews.rating.toFixed(1)} rating out of 5</div>
                                    <div className="link-all-reviews"><a  href={this.props.googleReviews.url} target="_blank">Read {this.props.googleReviews.user_ratings_total} Client Reviews</a></div>
                                </div>
                                <div class="shrink"><div class="rating-total">{this.props.googleReviews.rating.toFixed(1)}</div></div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-9">
                        <Slider {...settings}>
                            {this.props.googleReviews.reviews.map((item, index) => {
                                return  <ReviewItem item={item} key={index}/>
                            })}
                        </Slider>
                    </div>

                </div>
            </div>
        </div>;
    }
}



const ReviewItem=({item})=>{


    return <div >
                <div className="item-slide-wrap">
                    <div className="user-avatar">
                        <LazyLoadImage referrerPolicy="no-referrer" src={item.profile_photo_url} noWebp={true}/>
                    </div>
                    <div className="content-review">
                        <div className="head-review">
                            <span className="user-name">{item.author_name}</span>
                            <span className="date-published">{item.relative_time_description}</span>
                        </div>
                        <div className="text-review">
                            <ReadMoreReact
                                text={item.text}
                                max={200}
                                ideal={200}
                            />
                        </div>
                    </div>
                </div>
            </div>
};


const mapStateToProps = (state) => ({
    googleReviews: state.init.googleReviews,
});
export default connect(mapStateToProps)(ClientComments);
