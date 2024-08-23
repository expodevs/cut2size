import React, { Component } from 'react';

import {connect} from "react-redux";
import {groupBy} from "../../../functions/main";
import FAQs from "./home/FAQs";
import ContactUs from "./home/ContactUs";
import {Link} from "react-router-dom";
import {userDevice} from "../../../functions/frontend";
import {isMobile} from "../../../functions/frontend";
import Contacts from "./Contacts";
import PropTypes from "prop-types";
import ContactLinks from "../ContactLinks";
import OurProducts from "../OurProducts";



class Footer extends Component {

    state={
        toggleMenu:true
    };

    componentDidMount() {
        if(!this.props.contacts){
            // store.dispatch(getContacts());
        }
        if(!this.props.social){
            // store.dispatch(getSocial());
        }
        if(typeof document !=='undefined'){
            let backToTopBtn = document.getElementById('back-to-top');

            window.addEventListener('scroll', function (e) {
                if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
                    backToTopBtn.style.display = "block";
                } else {
                    backToTopBtn.style.display = "none";
                }
            });
        }

    }

    toggleMobileMenu() {
        this.setState({toggleMenu: !this.state.toggleMenu});
    }

    getFaqsType(page) {

        if (page && (page.hasOwnProperty('parent_id') || page.hasOwnProperty('category_id')))
            return 'catalog';

        const isCatalog = this.props.init.staticPage && this.props.init.staticPage.slug === '/catalog';
        if (isCatalog)
            return 'catalog';

        return 'home';
    }

    render() {
        let contacts  =  (this.props.contacts && this.props.contacts.length>0) ? groupBy(this.props.contacts,'type') : false;
        const menu =(this.props.menu && this.props.menu.rows) ?  this.props.menu.rows.filter((item)=>{
            return item.position==='footer';
        }) : false;


        const page = this.props.staticPage || this.props.page;

        return (<footer className="footer">

                {page && page.is_article && <OurProducts/>}

                <ContactLinks/>
                
                <button id="backToTop" className="back-to-top fadeOutRight "><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 451.8 451.8" xmlSpace="preserve"><g><path d="M248.3,106.4l194.3,194.3c12.4,12.4,12.4,32.4,0,44.7c-12.4,12.4-32.4,12.4-44.7,0L225.9,173.5L54,345.4c-12.4,12.4-32.4,12.4-44.7,0c-12.4-12.4-12.4-32.4,0-44.8l194.3-194.3c6.2-6.2,14.3-9.3,22.4-9.3C234,97.1,242.1,100.2,248.3,106.4z"></path></g></svg></button>
                {!!this.props.faq && page && page.is_article !== 1 &&
                    <section id="faqs-contacts" className={"no-padding row background-grey"}>
                        <FAQs faq_items={(page && page.faq_items) || false} type={this.getFaqsType(page)}/>
                        <ContactUs/>
                    </section>
                }

                <Contacts/>
                <div className="footer-bottom">
                    <div className="container">
                        <div className="row">
                            <div className="footer-bottom-information col-12">
                                {(this.state.toggleMenu || userDevice() === 'desktop') &&

                                <ul className={"nav "}>
                                    <li className="menu-item">
                                        <p>© {new Date().getFullYear()} {(contacts['copyright'] ? contacts['copyright'][0].value : '')}</p>
                                    </li>
                                    {(menu) && menu.map((item, index) => {
                                            let url = item.slug ? item.slug : (item.page ? item.page.slug : '');
                                            return <li className="menu-item" key={index}><Link
                                                className={"menu-link" + (url === '/calc-categories' ? ' order-now-link' : '')}
                                                to={url}
                                                onClick={this.toggleMobileMenu.bind(this)}
                                                hash={url}>{item.text}</Link>
                                            </li>
                                        }
                                    )}
                                </ul>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div id={'back-to-top'} className={(isMobile() ? ' mobile' : '')} onClick={() => {window.scrollTo(0, 0)}}/>
            </footer>
        )
    }
}

Footer.defaultProps={
    faq:true,
    init: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    contacts: state.init.contacts,
    social: state.init.social,
    menu: state.init.menu,
    page: state.init.page ? state.init.page.result :{},
    init: state.init,
});
export default connect(mapStateToProps)(Footer);

