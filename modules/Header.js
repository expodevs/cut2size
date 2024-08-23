import React, { PureComponent } from 'react';
import {
    Link, withRouter
} from 'react-router-dom';
import {connect} from "react-redux";
import {getMenu, getStoreData} from "../../../actions/init";
import {store} from "../../../store";
import {getCookie} from "../../../functions/cookie";
import {isMobile, userDevice} from "../../../functions/frontend";
import WebpImage from "./parts/WebpImage";
import ModalCallback from './ModalCallback';
import MiniCart from './cart/MiniCart';
import Head from './parts/Head';
import LoginModal from './account/LoginModal';
import QuickSearch from './search/QuickSearch';
import ModalSamples from "./ModalSamples";
import CurrencySelector from "./parts/CurrencySelector";
import loadable from "@loadable/component";
import {Menu, MenuItem} from "./Menu";
import {getAccountInfo} from "../../../actions/authentication";
import CountryFlag from "./parts/CountryFlag";
const HeaderPromo = loadable(() => import("./HeaderPromo"));
const Notification = loadable(() => import("./Notification"));


class Header extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            toggleMenu: false,
        };
    }

    componentDidMount() {
        this.setReferral();
        if(!this.props.menu && !this.props.staticMenu){
            store.dispatch(getMenu());
        }
        if(!this.props.storeData && !this.props.storeData){
            store.dispatch(getStoreData());
        }
        let self = this;
        if(typeof document !=='undefined' && typeof window !=='undefined'){
            window.onscroll = function() {
                let header = document.getElementsByClassName("header")[0];
                let sticky = header ?  header.offsetTop : false;
                if (sticky && window.pageYOffset > sticky) {
                    self.setState({fixed:true});
                } else {
                    self.setState({fixed:false});
                }
            };

            if(!document.documentElement.classList.contains('touchevents') && isMobile()){
                document.documentElement.classList.add("touchevents");
            }
        }
        if (userDevice() !== 'desktop' && getCookie('isRedirected') == undefined) {
            // this.props.history.push('/calc-categories');
            // setCookie('isRedirected', 1);
        }

        //add click outside mobile menu listener
        if (typeof document !== 'undefined') {
            document.addEventListener('click', this.hideMobileMenu.bind(this),{passive: true});
        }


        if((!this.props.account||!this.props.account.id) && this.props.customer &&  this.props.customer.id){
            store.dispatch(getAccountInfo({customer:this.props.customer,history:this.props.history}))
        }


        if(typeof document !=='undefined'){
            let path = (window.location.pathname==='/') ? 'home' : window.location.pathname.replace('/','');
            if(path && path.length>0){
                document.body.className= path;
            }
            this.unlisten = this.props.history.listen((location, action) => {
                let path = (location.pathname==='/') ? 'home' : location.pathname.replace('/','');
                if(path && path.length>0){
                    document.body.className= path;
                    // window.scrollTo(0, 0);
                }
            });


        }

    }

    setReferral=()=>{
        const params = new URLSearchParams(this.props.location.search);



        if(params && params.get('referral')){
            localStorage.setItem(
                "referral",
                params.get('referral')
            );
        }
    };

    toggleMobileMenu() {
        this.setState({toggleMenu: !this.state.toggleMenu});
    }

    hideMobileMenu(e){
        if(this.node && !this.node.contains(e.target)){
            if(!e.target.classList.contains('nav')){
                this.setState({toggleMenu: false});
            }
        }
    }



    menu=()=>{


        return  (this.props.menu && this.props.menu.rows) ?  this.props.menu.rows.filter((item)=>{
            return !item.position || item.position==='header';
        }) :  ((this.props.staticMenu && this.props.staticMenu.rows) ?  this.props.staticMenu.rows.filter((item)=>{
            return !item.position || item.position==='header';
        }):false);
    };

    render() {

        const menu = this.menu();
        return (
            <React.Fragment>
                <Head staticPage={this.props.staticPage}/>
                <header className={"header"+(this.state.fixed?' fixed':'')+(this.props.promoCode?' with-promo-code':'')}  >
                    <div className="container-fluid">
                        {!!(this.props.promoCode && this.props.promoCode.promo_text) &&
                        <HeaderPromo promoCode={this.props.promoCode}/>
                        }

                        {this.props.adminSavedCardCreate &&
                            <div className={'row bg-danger'} style={{
                                justifyContent: "center"
                            }}>
                                <p className={'text-center'}>Creating saved cart by admin</p>
                            </div>
                        }
                        <div className="row justify-content-start no-padding">
                            <div className="logo col-xl-1 col-lg-1 col-md-1 col-sm-2">
                                <a
                                    href={(typeof window!=='undefined' && window.location?.href==='/' )? "/#top" :"/"}
                                    hash={(typeof window!=='undefined' && window.location?.href==='/' ) ? "/#top" :"/"}
                                    aria-label="Link to homepage"
                                >
                                    <WebpImage src="/uploads/Logo.svg" alt="logo" width="93" height="36"/>
                                    <div className="maple-leaf-img"><img src="/images/maple_leaf1.svg" alt="maple leaf" width="30" height="30" /></div>
                                </a>
                            </div>
                            <div className="shrink">
                                <div className="header-slogan">
                                    <div className="slogan">Get the size you need!</div>
                                    {/*<div className="slogan"><WebpImage src="/images/logo_canada.png" alt=""/></div>*/}
                                </div>
                            </div>
                            <div className="shrink head-contact-info-wrap">
                                <div className="head-contact-info">
                                    <div className="phone-wrap">
                                        <span className="ico">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                                <path fill="none" d="M0 0h24v24H0V0z"/>
                                                <path fill="#ffffff" d="M19.23 15.26l-2.54-.29c-.61-.07-1.21.14-1.64.57l-1.84 1.84c-2.83-1.44-5.15-3.75-6.59-6.59l1.85-1.85c.43-.43.64-1.03.57-1.64l-.29-2.52c-.12-1.01-.97-1.77-1.99-1.77H5.03c-1.13 0-2.07.94-2 2.07.53 8.54 7.36 15.36 15.89 15.89 1.13.07 2.07-.87 2.07-2v-1.73c.01-1.01-.75-1.86-1.76-1.98z"/>
                                            </svg>
                                        </span>
                                        <a href={'tel:'+ this.props.phone} className="value" aria-label="Phone number">Call us {this.props.phone}</a>
                                    </div>
                                    <div className="work-wrap">
                                        <span className="ico">
                                            <svg xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 24 24">
                                                <path fill="#ffffff" d="M15,11H13V7a1,1,0,0,0-2,0v5a1,1,0,0,0,1,1h3a1,1,0,0,0,0-2ZM12,2A10,10,0,1,0,22,12,10.01114,10.01114,0,0,0,12,2Zm0,18a8,8,0,1,1,8-8A8.00917,8.00917,0,0,1,12,20Z"/>
                                            </svg>
                                        </span>
                                        <span className="value">{this.props.workHours}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="main-navigation ml-auto col-xl-8 col-lg-7 col-md-8 col-sm-7">
                                <div className="active-country-wrapper">
                                    <CountryFlag/>
                                   {/* <CurrencySelector/>*/}
                                </div>


                                <Menu toggleMobileMenu={this.toggleMobileMenu.bind(this)} menu={menu} account={this.props.account}/>
                                        <QuickSearch />
                                        <ModalCallback />
                                    <LoginModal
                                            history={this.props.history}
                                            location={this.props.location}
                                        />
                                        <MiniCart
                                            history={this.props.history}
                                        />
                                {userDevice() !== 'desktop' &&
                                <nav ref={node=>this.node=node} className={'mobile'}>
                                    <button className="mobile-button" onClick={this.toggleMobileMenu.bind(this)} aria-label="Toggle menu">
                                        <svg className="menu-icon" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 396.7 396.7" style={{enableBackground: "new 0 0 396.7 396.7"}} xmlSpace="preserve"><g><g><path d="M17,87.8h362.7c9.4,0,17-7.7,17-17s-7.6-17-17-17H17c-9.4,0-17,7.7-17,17S7.7,87.8,17,87.8z"/><path d="M17,215.3h362.7c9.4,0,17-7.6,17-17s-7.6-17-17-17H17c-9.4,0-17,7.6-17,17S7.7,215.3,17,215.3z"/><path d="M17,342.8h362.7c9.4,0,17-7.6,17-17s-7.6-17-17-17H17c-9.4,0-17,7.6-17,17S7.7,342.8,17,342.8z"/></g></g></svg>
                                    </button>
                                    {this.state.toggleMenu &&
                                    <ul className={"nav "}>
                                        <li className="menu-item">
                                            <div className="active-country-wrapper">
                                                <CountryFlag/>
                                                {/*<CurrencySelector/>*/}
                                            </div>
                                        </li>
                                        {(this.props.customer && this.props.customer.id) ?
                                            <li className="menu-item"><a className={"menu-link"}
                                                                         href={'/account-information'}
                                                                         onClick={this.toggleMobileMenu.bind(this)}
                                                                         hash={'/account-information'}
                                                                         aria-label="Account link"
                                            >My Account</a>
                                            </li> : ''
                                        }

                                        {(menu ) && menu.map((item, index) => {
                                                return <MenuItem item={item} toggleMobileMenu={this.toggleMobileMenu.bind(this)} />
                                            }
                                        )}

                                        <li className="menu-item flex">
                                            <QuickSearch />
                                            <ModalCallback />
                                        </li>
                                    </ul>
                                    }
                                </nav>
                                }
                            </div>
                        </div>
                        <ModalSamples />
                    </div>
                    {this.props.notification ?
                      <Notification
                        type={this.props.notification.type}
                        message={this.props.notification.message}
                        timeout={this.props.notification.timeout}
                      /> : ''
                    }
                </header>
            </React.Fragment>
        )
    }
}



const mapStateToProps = (state) => ({
    menu: state.init.menu,
    adminSavedCardCreate: state.cart.adminSavedCardCreate,
    notification: state.errors.notification,
    customer: state.auth.customer,
    account: state.auth.account,
    promoCode: state.init.promoCode,
    phone: state.init.storeData[0] ? state.init.storeData[0].value : '',
    workHours: state.init.storeData[0] ? state.init.storeData[1].value : '',
});

export default connect(mapStateToProps)(withRouter(Header));
