import React, { Component } from 'react'
import PokemonCard from './PokemonCard';

export default class PokemonList extends Component {
    state = {
        url: 'https://pokeapi.co/api/v2/pokemon?limit=52&offset=0',
        pokemon: null,
    }
    async componentDidMount() {
        fetch('https://pokeapi.co/api/v2/pokemon?limit=52&offset=0')
            .then(res => res.json())
            .then((data) => {
                this.setState({ pokemon: data['results'] })
            })
            .catch(console.log)

    }


    render() {
        return (
            <React.Fragment>
                {this.state.pokemon ? (
                    <div className="row">
                        {
                            this.state.pokemon.map(pokemon => (
                                <PokemonCard
                                key={pokemon.name} 
                                name={pokemon.name}
                                url={pokemon.url}/>
                            ))
                        }

                    </div>) : (<h1>Loading Pokemon...</h1>)}
            </React.Fragment>
        )
    }
}
