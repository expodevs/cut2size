import React from "react";

const ArticleNav=({article})=>{


    return <div className="row mt5">
        <div className="col-md-12 d-flex justify-content-around">
            {!!article.prev  &&
                    <a  href={`${article.prev?.slug}`}>{article.prev?.name}</a>
            }

            {!!article.next  &&
                    <a href={`${article.next?.slug}`}>{article.next?.name}</a>
            }
        </div>

    </div>
}
export default ArticleNav;