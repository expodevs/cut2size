import PagesKit from "./PagesKit";
import LazyLoadImage from "../parts/LazyLoadImage";
import React from "react";
import ArticleNav from "./ArticleNav";
import ArticlesSidebar from "./ArticlesSidebar";
import FAQs from "../home/FAQs";
import moment from 'moment';


const PageModule=({page,kitInsert})=>{

    const getDescription = ()=>{
        let description = page ? page.description : '';
        if(description && description.indexOf('[[kits]]')!==-1){
            description = description.replace('[[kits]]','<div id="pagesKit"></div>')
        }

        return description || null
    };


    return (
        <main>
            <section className="page-section animated  ">
                <div className="container">
                    <div className="row">
                        <div className={(page && page.is_article ) ? "col-lg-9" :  "col-lg-12"}>

                    <div className="first text-align-center"><h1 className="title">{page ?  page.name : ''}</h1></div>
                            <div className="date-published">
                                <span>{ moment(page.createdAt).format('MMMM DD, YYYY') }</span> | Updated on: <span>{ moment(page.updatedAt).format('MMMM DD, YYYY') }</span>
                            </div>
                    <div className={'page-seo-block'} dangerouslySetInnerHTML={{__html:getDescription()}} />
                    {!kitInsert &&
                    <PagesKit pages_kit={(page && page.pages_kit) ? page.pages_kit:[]}/>
                    }

                    <div className="faq-blog-section">
                        <FAQs faq_items={(page && page.faq_items) || false} type={'home'} disableForm={true}/>
                    </div>

                    {!!(page && page.is_article )&&
                        <>
                            <ArticleNav article={page}/>
                    <div className="article-block row">
                        <div className="col-lg-2 mb-2 mt-2  text-center">
                            <LazyLoadImage noWebp={true} src={'/images/article_author.png'} alt=""/>
                        </div>
                        <div className="col-lg-2 mb-2 mt-2 text-center">
                            <h3>Article by:</h3>
                            <p>Valentina Melnikova - Lead Designer at Cut2Size</p>
                            <a href="mailto:valentina@cut2size.ca">valentina@cut2size.ca</a>
                            <p>Office 403.366.7411</p>
                            <div className={"social"}>
                                <a target={"_blank"} rel={"noindex nofollow"} href="https://www.facebook.com/valentina.bogomolova.5/">
                                    <img src="/images/social/facebook.svg" alt="facebook"/>
                                </a>
                                <a target={"_blank"} rel={"noindex nofollow"} href="https://www.linkedin.com/in/valentina-melnikova-908b56181/">
                                    <img src="/images/social/linkedin.svg" alt="linkedin"/>
                                </a>
                                <a target={"_blank"} rel={"noindex nofollow"} href="https://www.instagram.com/valentinka_calgary/">
                                    <img src="/images/social/instagram.svg" alt="instagram"/>
                                </a>
                            </div>
                        </div>
                        <div className="col-lg-8 mb-2 mt-2">
                            <p>
                                Hi there! I’m a millwork designer and an owner of a kitchen cabinet manufacturing company. With a team of professionals, I work on designing and manufacturing high-end millwork. Combining professional designing and manufacturing skills is what allows us to develop and translate our plans into a reality through our uniqueness and exclusive ideas. Our employees are highly skilled and creative thinkers that also utilize their professionalism and experience to take millwork to the next level. I’m very familiar with the industry and I take on each project from the design to the final product. With that said, if you’re looking for design advice or technician help, you’re in the right place.
                            </p>
                        </div>
                    </div>
                        </>
                    }

                        </div>
                        {!!(page && page.is_article) &&
                            <div className="col-lg-3">
                                <div className="articles-sidebar">

                                    <div className="sidebar-job-head layer-white ">
                                        <div>
                                            <span className="title-head-sidebar d-block">Other texts in Articles {page?.categoryName ? ` > ${page?.categoryName}` : ''}</span>
                                        </div>
                                    </div>

                                    <ArticlesSidebar article={page} articles={page.articles}/>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </section>
        </main>
    )

};


export default PageModule
