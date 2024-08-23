import React, {PureComponent} from "react";
import ModalGallery from "../galleries/ModalGallery";
class Portfolio extends PureComponent {

    componentDidMount() {


    }

    render() {
        let gallery = this.props.gallery;
        return <div id="portfolio">
            <div className="full-width-title text-align-center"><h2 className={"title"}>Latest projects</h2></div>
            <ModalGallery gallery = {gallery }/>
        </div>;
    }
}

export default Portfolio;
