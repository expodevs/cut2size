import LazyLoad from "react-lazyload";
import loadable from '@loadable/component'
import Placeholder from "./parts/Placeholder";
import React from "react";
import {groupBy} from "../../../functions/main";
import {connect} from "react-redux";
const MapContainer = loadable(() => import('./MapContainer'));

const Contacts=(props)=>{


    let contacts  =  (props.contacts && props.contacts.length>0) ? groupBy(props.contacts,'type') : false;


    return contacts ?
            <section className="no-padding">
                <div id="contact" className="footer-information">
                    <div className="container-fluid">
                        <div className="row no-padding">
                            <div className="contact-information col-xl-4 col-lg-4 col-md-12 col-sm-12">
                                {!!(props.social) &&
                                <div className="information social">
                                    <p className="information-title">CONNECT WITH US:</p>
                                    <div className="information-text">
                                        {props.social.map(item=>{
                                            return <a key={item.value} target={"_blank"} rel={"noindex nofollow"} href={item.value}><img src={item?.system_files[0]?.disk_name} alt={item.name} width="26" height="26" /></a>
                                        })}
                                    </div>
                                </div>
                                }


                                {
                                    Object.keys(contacts).map((contact_type,index)=>{
                                        switch (contact_type) {
                                            case 'address':
                                                return (
                                                    <div key={index} className="information address">
                                                        {contacts[contact_type].map((contact,index_contact)=>{
                                                            return (<div key={contact.id}>
                                                                <p className="information-title">{contact.label}</p>
                                                                <div className="information-text" dangerouslySetInnerHTML={{__html:contact.value}}/>
                                                            </div>);
                                                        })}

                                                    </div>
                                                );
                                            case 'tel':
                                                return (
                                                    <div key={index} className="information phones">

                                                        <p className="information-title">Call us:</p>

                                                        <div className="information-text">
                                                            {contacts[contact_type].map((contact,index_contact)=>{
                                                                return (
                                                                    <p key={contact.id}>{contact.label}<a href={"tel:"+contact.value}>{contact.value}</a></p>);
                                                            })}
                                                        </div>
                                                    </div>
                                                );

                                            case 'email':
                                                return (
                                                    <div key={index} className="information email">
                                                        {contacts[contact_type].map((contact,index_contact)=>{
                                                            return (<div key={contact.id}>
                                                                <p className="information-title">{contact.label}</p>
                                                                <p className="information-text"><a href={"mailto:"+contact.value}>{contact.value}</a></p>
                                                            </div>);
                                                        })}

                                                    </div>
                                                );

                                        }
                                    })
                                }
                            </div>
                            <div className="contact-map col-xl-8 col-lg-8 col-md-12 col-sm-12">
                                <LazyLoad height={200} debounce={500} placeholder={<Placeholder />}>
                                    <MapContainer location={contacts['location']} address={contacts['address']}/>
                                </LazyLoad>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            : ''
};


const mapStateToProps = (state) => ({
    contacts: state.init.contacts,
    social: state.init.social,
});
export default connect(mapStateToProps)(Contacts);

