import React, { Component } from 'react';
import axios from 'axios';

const Url = process.env.REACT_APP_SERVER_URL || process.env.NEXT_PUBLIC_SERVER_URL;
const ApiServer = process.env.REACT_APP_API_SERVER_URL || process.env.NEXT_PUBLIC_API_SERVER_URL;

class ContactLinks extends Component {
    state = {
        active: false,
        links: null, // Change from false to null to represent loading state
    };

    constructor() {
        super();
        this.getContactLinks();
    }

    getContactLinks() {
        let apiUrl = `${Url + ApiServer}/settings/contact_links`;
        axios
            .get(apiUrl)
            .then((res) => {
                this.setState({ links: res.data });
            })
            .catch((err) => {
                console.log('error');
                console.log(err);
            });
    }

    toggle = () => {
        this.setState({ active: !this.state.active });
    };

    render() {
        const { active, links } = this.state;

        return (
            <div>
                {links && links.length > 0 && (
                    <div className={`widget-contacts-wrap ${active ? 'active' : ''}`}>
                        <div className="widget-contacts">
                            {links.map((link) => {
                                return <a href={link.value}>
                                    <img src={link.system_files && link.system_files.length > 0
                                        ? link.system_files[0].url
                                        : ''
                                    } alt={link.label} />
                                </a>;
                            })}

                        </div>
                        <button
                            id="btnOpenWidgetContacts"
                            className="btn-open-widget-contacts"
                            onClick={this.toggle}
                        ></button>
                    </div>
                )}
            </div>
        );
    }
}

export default ContactLinks;
