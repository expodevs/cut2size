import React, {Component} from "react";
import WebpImage from "../parts/WebpImage";

class FAQsItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            toggleQuestion: false,
        };
    }
    toggleQuestion() {
        this.setState({toggleQuestion: !this.state.toggleQuestion});
    }

    render() {
        let item = this.props.item;

        return <div key={item.id} className='faq-container' itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
            <button
                className={"faq-question" + (this.state.toggleQuestion ? " active" : "")} onClick={this.toggleQuestion.bind(this)}
                data-toggle="collapse"
                data-target={'#collapse'+item.id}
                aria-expanded={this.state.toggleQuestion}
                aria-controls={'#collapse'+item.id}
                aria-label="FAQ toggle"
            >
                <span itemProp="name">{item.faq ? item.faq.question : item.question}</span>
                <span className="faq-arrow">
                            <WebpImage src="/uploads/arrow_icon_down.svg" alt="faq arrow" width="15" height="8"/>
                        </span>
            </button>
            <div className={"faq-answer collapse" + (this.state.toggleQuestion ? " show" : "")} id={"collapse"+item.id}
                 itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer"
            ><div itemProp="text">{item.faq ? item.faq.answer : item.answer}</div></div>
        </div>
    }
}

export default FAQsItem;
