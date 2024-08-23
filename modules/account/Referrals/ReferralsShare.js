import PropTypes from "prop-types";
import React, {useRef} from "react";
import {
    FacebookShareButton,
    FacebookIcon,
    TwitterShareButton,
    TwitterIcon,
    LinkedinShareButton,
    LinkedinIcon,
    EmailShareButton,
    EmailIcon,
    ViberShareButton,
    ViberIcon,
    TelegramShareButton,
    TelegramIcon,
    WhatsappShareButton,
    WhatsappIcon
} from "react-share";
import {setNotification} from "../../../../../actions/init";
import {store} from "../../../../../store";


const ReferralsShare=({referralLink})=>{

    const inputRef = useRef(null);

    function copyToClipboard(e) {
        inputRef.current.select();
        document.execCommand('copy');
        // This is just personal preference.
        // I prefer to not show the whole text area selected.
        e.target.focus();
    }

    function copySuccess(){

        store.dispatch(setNotification('Copied!', 'success', 3000));
    }

    let fullLink = referralLink ? `${process.env.REACT_APP_SERVER_URL}/?referral=${referralLink}` : '';

    return <div className="layer-white mb30">
        {!!referralLink &&
        <div className="referal-form-wrap">
            <div className="row">
                <div className="col-md-12">
                    <h1>Referral share link</h1>
                </div>
            </div>
            <div className="row">
                <div className="col-md my10">
                    <div className="form-group">
                        <input type="text" className="form-control"
                               onCopy={e=>{
                                   copySuccess()
                               }}
                               value={fullLink}
                               id="input-copy-referal"
                               ref={inputRef}
                               readOnly
                        />
                    </div>
                </div>
                <div className="shrink my10 ml-auto">
                    <button className="btn btn-dark" id="btn-copy-referal" onClick={copyToClipboard}>{"Copy"}</button>
                </div>
            </div>
            <div className="row justify-content-center">
                <FacebookShareButton
                    url={fullLink}
                    className={'ml10 mr10'}
                >
                    <FacebookIcon size={32} round />
                </FacebookShareButton>
                <TwitterShareButton
                    url={fullLink}
                    className={'ml10 mr10'}
                >
                    <TwitterIcon size={32} round />
                </TwitterShareButton>
                <LinkedinShareButton
                    url={fullLink}
                    className={'ml10 mr10'}
                >
                    <LinkedinIcon size={32} round />
                </LinkedinShareButton>
                <ViberShareButton
                    url={fullLink}
                    className={'ml10 mr10'}
                >
                    <ViberIcon size={32} round />
                </ViberShareButton>
                <WhatsappShareButton
                    url={fullLink}
                    className={'ml10 mr10'}
                >
                    <WhatsappIcon size={32} round />
                </WhatsappShareButton>
                <TelegramShareButton
                    url={fullLink}
                    className={'ml10 mr10'}
                >
                    <TelegramIcon size={32} round />
                </TelegramShareButton>
                <EmailShareButton
                    url={fullLink}
                    className={'ml10 mr10'}
                >
                    <EmailIcon size={32} round />
                </EmailShareButton>
            </div>
        </div>
        }
    </div>
};


ReferralsShare.propTypes = {
    referralLink: PropTypes.string,
};


export default ReferralsShare;
