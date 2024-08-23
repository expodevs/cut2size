import React, { Component } from 'react';
import axios from "axios";

const Url = process.env.REACT_APP_SERVER_URL;
const ApiUrl = process.env.REACT_APP_API_SERVER_URL;

class ProductLineList extends Component {
    state = {
        active: true,
        lines: [],
    }

    componentDidMount() {
        this.loadLines();
    }

    handleClick = () => {
        this.setState(prevState => ({
            active: !prevState.active
        }));
    };

    loadLines = () => {
        axios.get(Url + ApiUrl + '/product-lines')
            .then((resp) => {
                this.setState({
                    lines: resp.data.rows,
                });
            })
            .catch((error) => {
                console.error("Error loading faqs:", error);
            });
    };

    render() {
        return (this.state.lines.length > 0 &&
            <div className="filters">
                <div className="filters-list">
                    <div className="filter">
                        <p className={this.state.active ? 'filter-title active' : 'filter-title'}
                           onClick={this.handleClick}>Lines:</p>
                        <ul className={this.state.active ? 'filter-list active' : 'filter-list'}>
                            {this.state.lines.map((line, index) => (
                                <div className={'filter-item'} key={index}>
                                    <label>
                    <span className="filter-name"><a
                        href={`?line=${line.slug}`}>{line.name}</a></span>
                                    </label>
                                </div>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}

export default ProductLineList
