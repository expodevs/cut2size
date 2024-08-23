import React, { Component } from 'react';
import {
    Link,
}from 'react-router-dom';


import Breadcrumbs from "./modules/breadcrumbs";

class Page404 extends Component {



    render() {

        return (
            <main>
                <section className="no-padding-bottom">
                    <Breadcrumbs
                        list={
                            [
                                {
                                    name: '404',
                                }
                            ]
                        }
                    />
                </section>
                <section className="no-padding-top">
                    <div className="container">
                        <div className="row no-padding-top">
                            <div className="col-12">
                                <div className="content-404">
                                    <h1>404</h1>
                                    <h3>Page not found</h3>
                                    <p>Sorry, the page you have requested has either been moved, or does not exist.</p>
                                    <p><Link className="link" to="/">Go to Homepage</Link></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        )
    }
}

export default Page404;