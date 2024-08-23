import React, {useState} from "react";
import Rating from "react-rating";
import ReCAPTCHA from "react-google-recaptcha";
import {confirmAlert} from "react-confirm-alert";
import {store} from "../../../../store";
import {sendPost} from "../../../../actions/admin";
import {withRouter} from "react-router-dom";
import moment from "moment";
import {connect} from "react-redux";




const Reviews = (props) => {

    return(
        props.reviews ?
            <div className={'reviews-wrapper'}>
                <div className={'title'}>Reviews</div>
                {
                    props.reviews.map((item, index) => {
                        return <div className={'review-item'} key={index}>
                            <div className={'review-item-left'}>
                                <div className={'client-name'}>{item.customer ? item.customer.name : ''}</div>
                                <div className={'review-info'}>
                                    <div className={'review-date'}>{moment(item.createdAt).format('l')}</div>
                                    <div className={'review-rating'}>
                                        <Rating initialRating={item.rating}
                                                readonly
                                                emptySymbol={<img src="/images/icon-star-empty.svg" className="icon" alt="star" />}
                                                fullSymbol={<img src="/images/icon-star-full.svg" className="icon" alt="star" />}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className={'review-item-right'}>{item.text}</div>
                        </div>
                    })
                }
                <ReviewForm
                    productId={props.productId}
                    history={props.history}
                    isCustomerAuthenticated={props.isCustomerAuthenticated}
                />
            </div>
            : ''
    );
};

const ReviewForm=({productId,history,isCustomerAuthenticated})=>{

    const [ captchaKey,setCaptchaKey] = useState(null);
    const [ rating,setRating] = useState(null);
    const [ text,setText] = useState(null);





    function onSubmit(e) {
        if(!captchaKey || !rating || !isCustomerAuthenticated){
            let message = null;
            if(!captchaKey){
                message = 'Please check captcha'
            }
            if(!rating){
                message = 'Please check rating'
            }
            if(!isCustomerAuthenticated){
                message = 'Please log in to leave review!'
            }


            return confirmAlert({
                message: message,
                buttons: [

                    {
                        label: 'Close',
                    }
                ]
            });
        }
        e.target.disabled=true;

        store.dispatch(sendPost(`${process.env.REACT_APP_API_SERVER_URL}/product-reviews/customer-review/${productId}`,{
            rating:rating,
            recaptcha:captchaKey,
            text:text,
        },"PUT")).then(result=>{
            e.target.disabled=false;
            console.log('result',result);
            if(result.data && result.data.success){
                return confirmAlert({
                    title: 'Success',
                    message: 'You review successfully saved!',
                    afterClose: () => {
                        history.go(0);
                    },
                    buttons: [

                        {
                            label: 'Close',
                        }
                    ]
                });
            }
            if(result.data && result.data.errors){
                return confirmAlert({
                    title: 'Error',
                    message: result.data.errors,
                    buttons: [

                        {
                            label: 'Close',
                        }
                    ]
                });
            }
        })



    }
    return <div className={'bottom'}>
                <div className={'rating-wrapper'}>
                    <div className={'text'}>Rate:</div>
                    <Rating
                        emptySymbol={<img src="/images/icon-star-empty.svg" alt="star" className="icon" width="22" height="22" />}
                        fullSymbol={<img src="/images/icon-star-full.svg" alt="star" className="icon" width="22" height="22" />}
                        onChange={setRating}
                        initialRating={rating}
                        required={true}
                    />
                </div>
                <div className="form-group">
                    <textarea required={true} onChange={e=>setText(e.target.value)}  className={'form-control'} name="text" id="" cols="10" rows="5"/>
                </div>
                <ReCAPTCHA
                    className={'recaptcha-block'}
                    sitekey={process.env.REACT_APP_RECAPTCHA_PUBLIC_KEY}
                    onChange={setCaptchaKey}
                />
                <button aria-label="Button leave review" className={'leave-review-btn'} onClick={onSubmit}>Leave Review</button>
            </div>
};

const mapStateToProps = (state) => ({
    isCustomerAuthenticated:state.auth.isCustomerAuthenticated,
});

export default connect(mapStateToProps)(withRouter(Reviews));
