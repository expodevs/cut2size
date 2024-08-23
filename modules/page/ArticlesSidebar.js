import React, {useState} from "react";
import PropTypes from "prop-types";
import ContactUs from "../home/ContactUs";

const ArticlesSidebar=({articles,article})=>{

    const [articlesList, setArticles] = useState(articles.slice(0, 5));
    const [stateButton, setStateButton] = useState(true);

    const showAllItems = () => {
        setArticles(articles);
        setStateButton(false);
    };

    return <div className="sidebar-wrapper-job d-block">
                <div className="menu-sidebar-wrap layer-white">
                    {(!!articlesList?.length) && articlesList.map(item=>
                        <SidebarItem item={item} article={article} key={item.id}/>
                    )}
                </div>
                    {(articles.length > 5) && stateButton ?
                        <div className="btn-all-articles-wrap">
                            <button className="btn-all-articles" onClick={showAllItems}>Show More</button>
                        </div>
                        : ''
                    }
                <ContactUs/>
            </div>
};

const SidebarItem=({item,article})=>{

    let initialState = (article===item.id );

    const [active]=useState(initialState);

    return <div className={"checkbox-group-wrap "+(active?" active":"")}>

                    <div className="title-group" >
                            <a href={""+item.slug}>
                                <span>{item.name}</span>
                            </a>
                    </div>

            </div>
};


ArticlesSidebar.propTypes = {
    articles: PropTypes.array.isRequired,
    article: PropTypes.object.isRequired,
};
export default ArticlesSidebar;
