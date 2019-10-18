import React, { Component } from 'react'
import {Link} from 'react-router-dom';
import styled from 'styled-components';

const Sprite = styled.img`
    width: 5em;
    height:5em;
    display:none;
`;

const Card = styled.div`
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    &:hover {
        box-shadow: 0 14px 24px rgba(0,0,0,0.12), 0 10px 10px rgba(0,0,0,0.24);

    }
    user-select:none;
    o-user-select:none;
    -moz-user-select: none;
    -webkit-user-select:none;

`;
const StyledLink = styled(Link)`
    text-decoration:none;
    color:#000;
    &:focus,
    &:hover,
    &:visited,
    &:link,
    &:active{
        text-decoration:none;
        color:#000;

    }

`;

export default class PokemonCard extends Component {
    state = {
        name: '',
        imageUrl: '',
        pokemonIndex: '',
        imageLoading: true,
        tooManyRequests: false
    }
    componentDidMount() {
        const { name, url } = this.props;
        const pokemonIndex = url.split('/')[url.split('/').length - 2];
        const imageUrl = `https://github.com/PokeAPI/sprites/blob/master/sprites/pokemon/${pokemonIndex}.png?raw=true`;
        this.setState(
            {
                name,
                pokemonIndex,
                imageUrl
            }
        )
    }

    render() {

        return (
            <div className="col-md-3 col-sm-6 mb-5">
                <StyledLink to={`pokemon/${this.state.pokemonIndex}`}>
                <Card className="card">
                    <h5 className="card-header">{this.state.pokemonIndex}</h5>
                    {this.state.imageLoading ? (<div className="spinner-border text-danger mx-auto  mt-2" role="status">
                        <span className="sr-only">Loading...</span>
                    </div>) : null}

                    <Sprite className="card-img-top rounded mx-auto mt-2"
                        onLoad={() => this.setState({ imageLoading: false })}
                        onError={() => this.setState({ tooManyRequests: true })}
                        src={this.state.imageUrl}
                        style={
                            this.state.tooManyRequests ? { display: "none" } :
                                this.state.imageLoading ? null : { display: "block" }
                        } />
                    {this.state.tooManyRequests ? (<h6 className="mx-auto"><span className="badge badge-danger mt-2">Too Many Requests</span></h6>) : null}
                    <div className="card-body mx-auto">
                        <h6 className="card-title">{this.state.name.toLowerCase().split(" ").map(letter => letter.charAt(0).toUpperCase() + letter.substring(1)).join(' ')}</h6>
                        {/* <img src={this.state.imageUrl} className="card-img-top" alt={this.state.name}/> */}

                        {/* <h4>{this.state.pokemonIndex}</h4> */}
                        <a href="{this.state.url}">{this.state.url}</a>
                    </div>
                </Card>
                </StyledLink>
            </div>
        )
    }
}
