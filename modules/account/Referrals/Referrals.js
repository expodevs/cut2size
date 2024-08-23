import React from "react";
import PropTypes from "prop-types";
import ReferralsShare from "./ReferralsShare";
const Referrals=({account,customer})=>{




    return <React.Fragment>
        <div className="col-xl-8 col-lg-6 mt20">
            <div className="main-content-wrap">
                <ReferralsShare referralLink={account.referral_link} />
            </div>
        </div>
        <div className="col-lg-3 mt20">
            <div className="right-sidebar">
            </div>
        </div>
    </React.Fragment>
};




Referrals.propTypes = {
    customer:PropTypes.object.isRequired
};


export default Referrals;
