import React from "react";
import Countdown  from 'react-countdown';


const HeaderPromo=({promoCode})=>{

    return <div className={'row promo-top justify-space-between align-items-center'} style={{backgroundColor : promoCode.color || '#7b1b5b'}}>
        <div className={'text-center'}  dangerouslySetInnerHTML={{__html:promoCode.promo_text}}/>
        <div style={{marginLeft:"1rem"}}>
            <Countdown
                date={promoCode.expire_date}
                renderer={(props) => <CountdownRenderer {...props}/>}
                intervalDelay={0}
                precision={3}
                zeroPadTime={2}
            />
        </div>
    </div>
};
export default HeaderPromo;
// Renderer callback with condition
const CountdownRenderer = ({ days, hours, minutes, seconds, completed }) => {

    // Render a countdown
    return (
            <div id="countdown">
                <ul>
                  <li><span id="days">{days}</span>Days</li>
                  <li><span id="hours">{hours}</span>Hours</li>
                  <li><span id="minutes">{minutes}</span>Minutes</li>
                  <li><span id="seconds">{seconds}</span>Seconds</li>
                </ul>
              </div>
    );
};