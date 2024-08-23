import React, {Component} from "react";
import axios from "axios/index";
import InstagramGallery from "../galleries/InstagramGallery";

const accessToken = 'IGQVJWeEVqWFVhYXo0akxDRVpiOTdpNlZAGNjl3NXJ0aVNRWkx4VlJjMGFNRl9pSm5ENVlFX2NVUjZAucWkyaWVNUDJra2dWVXJ1bjdXVHdVNldkOTg2R1AzRlY3NzZATM2x1aTdXRDNabF9vcEo1cm8zTAZDZD';
const instagramLink = 'https://graph.instagram.com/me/media';
const instagramQuery = '?fields=id,media_type,media_url,caption,permalink&access_token=';
const instagramApiLink = instagramLink + instagramQuery + accessToken;
class Instagram extends Component {
    state = {
        media: false
    }

    componentDidMount() {
        this.getInstagramPosts();
    }

    getInstagramPosts() {
        if (!this.state.media) {
            axios.get(instagramApiLink)
                .then(res => {
                    let media = res.data.data;
                    this.setState({media: media});
                })
                .catch(err => {
                    console.error(err);
                })
        }
    }

    render() {

        return <>{this.state.media &&
            <section className={"with-full-title background-grey"}>
                <div id="portfolio">
                    <div className="full-width-title text-align-center">
                        <div className="title-insta-wrapper">
                        <span className="fa fa-instagram">
                            <svg data-name="Layer 1" id="Layer_1" viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg"><path
                                fill="#062b31"
                                d="M83,23a22,22,0,0,1,22,22V83a22,22,0,0,1-22,22H45A22,22,0,0,1,23,83V45A22,22,0,0,1,45,23H83m0-8H45A30.09,30.09,0,0,0,15,45V83a30.09,30.09,0,0,0,30,30H83a30.09,30.09,0,0,0,30-30V45A30.09,30.09,0,0,0,83,15Z"/><path
                                class="cls-1" d="M90.14,32a5.73,5.73,0,1,0,5.73,5.73A5.73,5.73,0,0,0,90.14,32Z"/><path
                                class="cls-1"
                                d="M64.27,46.47A17.68,17.68,0,1,1,46.6,64.14,17.7,17.7,0,0,1,64.27,46.47m0-8A25.68,25.68,0,1,0,90,64.14,25.68,25.68,0,0,0,64.27,38.47Z"/></svg>
                        </span>
                            <h2 className={"title"}>Instagram</h2>
                        </div>
                    </div>
                    <InstagramGallery gallery={this.state.media}/>
                </div>
            </section>
        }</>;
    }
}

export default Instagram;
