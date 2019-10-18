import React, { Component } from 'react'

const TYPE_COLORS = {
    bug: 'b1c12e',
    dark: '4f3a2d',
    dragon: '755edf',
    electric: 'FCBC17',
    fairy: 'f4b1f4',
    fighting: '823331',
    fire: 'e73b0c',
    flying: 'a3b3f7',
    ghost: ' 6060B2',
    grass:'74c236',
    ground: 'D3B357',
    ice: 'A3e7fd',
    normal: 'c8c4bc',
    poison: '934594',
    psychic: 'ed4882',
    rock: 'b9a156',
    steel: 'b5b5c3',
    water: '3295f6'

}

export default class Pokemon extends Component {
    state = {
        name: '',
        imageUrl: '',
        pokemonIndex: '',
        types: [],
        description: '',
        stats: {
            hp: '',
            attack: '',
            defense: '',
            speed: '',
            specialAttack: '',
            specialDefense: '',
        },
        height: '',
        weight: '',
        eggGroup: '',
        abilities: '',
        genderRatioMale: '',
        genderRatioFemale: '',
        evs: '',
        hatchSteps: '',


    };
    async componentDidMount() {
        const { pokemonIndex } = this.props.match.params;

        //urls for pokemon info
        const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonIndex}/`;
        const pokemonSpeciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${pokemonIndex}/`;

        //get pokemon info
        fetch(pokemonUrl)
            .then(res => res.json())
            .then((data) => {
                const name = data.name;
                const imageUrl = data.sprites.front_default;
                const stats = data.stats;

                console.log(stats)

                let { hp, attack, defense, speed, specialAttack, specialDefense } = '';
                stats.map(stat => {
                    switch (stat.stat.name) {
                        case 'hp':
                            hp = stat['base_stat'];
                            break;
                        case 'attack':
                            attack = stat['base_stat'];
                            break;
                        case 'defense':
                            defense = stat['base_stat'];
                            break;
                        case 'speed':
                            speed = stat['base_stat'];
                            break;
                        case 'special-attack':
                            specialAttack = stat['base_stat'];
                            break;
                        case 'special-defense':
                            specialDefense = stat['base_stat'];
                            break;
                        default:
                            return false;
                            
                            

                    }
                    return true;
                });
                // convert decimeters to feet .. The + 0.0001 * 100 / 100 is for rounding to 2 decimals 
                const height = Math.round((data.height * 0.328084 + 0.0001) * 100) / 100;

                //convert to pounds
                const weight = Math.round((data.weight * 0.220462 + 0.0001) * 100) / 100;

                const types = data.types.map(type => type.type.name);
                const abilities = data.abilities.map(ability => {
                    return ability.ability.name
                    .toLowerCase().split('-').map(
                        s => s.charAt(0).toUpperCase() + s.substring(1)
                    ).join(' ')
                })

                const evs = data.stats.filter(stat => {
                    if(stat.effort > 0 ){
                        return true;
                    }
                    return false;
                    
                }

                ).map(stat =>{
                    return `${stat.effort} ${stat.stat.name
                    .toLowerCase()
                    .split('-')
                    .map(s => s.charAt(0).toUpperCase() + s.substring(1))
                .join(' ')
                
                }`}).join(', ');

                this.setState({
                    name, 
                    imageUrl,
                    pokemonIndex,
                    types,
                    stats: {
                        hp, 
                        attack,
                        defense,
                        speed,
                        specialAttack,
                        specialDefense,
                    },
                    height,
                    weight,
                    evs,
                    abilities
                })
            })
            .catch(console.log);

            await fetch(pokemonSpeciesUrl)
            .then(res => res.json())
            .then((data) => {
                console.log(data)
                let description = '';

                data.flavor_text_entries.some(
                    flavor => {
                       if (flavor.language.name === 'en') {
                           description = flavor.flavor_text;
                           return;
                       }
                    }
                )
               
                const femaleRate = data['gender_rate'];
                const genderRatioFemale = 12.5 * femaleRate;
                const genderRatioMale= 12.5 * (8-femaleRate);
                const catchRate = Math.round((100/255) * data['capture_rate']);
                const eggGroups = data['egg_groups'].map( group =>{
                    return group.name.toLowerCase().split('-').map(
                        s => s.charAt(0).toUpperCase() + s.substring(1)
                    ).join(' ')
                }
                ).join(', ');

                const hatchSteps = 255 * (data['hatch_counter'] + 1);

                this.setState({
                    description,
                    genderRatioFemale,
                    genderRatioMale,
                    catchRate,
                    eggGroups,
                    hatchSteps
                })
            })
            .catch(console.log);

    }
    render() {
        return (
            <div className="col">
                <div className="card">
                    <div className="card-header">
                        <div className="row">
                            <div className="col-5">
                                <h5>{this.state.pokemonIndex}</h5>
                            </div>
                            <div className="col-7">
                                <div className="float-right">
                                    {this.state.types.map(type => (
                                        <span key={type} className="badge badge-primary badge-pill mr-1"
                                        style={{backgroundColor:`#${TYPE_COLORS[type]}`}}>
                                            {type.toLowerCase().split('-').map(
                        s => s.charAt(0).toUpperCase() + s.substring(1)
                    ).join(' ')}
                                        </span>
                                    )
                                    
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="row align-items-center">
                            <div className="col-md-3">
                                <img src={this.state.imageUrl} 
                                alt={this.state.name}
                                className="card-img-top rounded mx-auto mt-2"/>
                            </div>
                            <div className="col-md-9">
                                <h4 className="mx-auto">{this.state.name.toLowerCase().split('-').map(
                        s => s.charAt(0).toUpperCase() + s.substring(1)
                    ).join(' ')}</h4>
                    <div className="row align-items-center">
                        <div className="col-12 col-md-3">
                            HP
                        </div>
                        <div className="col-12 col-md-9">
                            <div className="progress">
                                <div className="progress-bar"
                                role="progressBar"
                                style={{width: `${this.state.stats.hp}%`}}
                                aria-valuenow={this.state.stats.hp}
                                aria-valuemin="0"
                                aria-valuemax="100">
                                <small>{this.state.stats.hp}</small>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row align-items-center">
                        <div className="col-12 col-md-3">
                            ATTACK
                        </div>
                        <div className="col-12 col-md-9">
                            <div className="progress">
                                <div className="progress-bar"
                                role="progressBar"
                                style={{width: `${this.state.stats.attack}%`}}
                                aria-valuenow={this.state.stats.attack}
                                aria-valuemin="0"
                                aria-valuemax="100">
                                <small>{this.state.stats.attack}</small>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row align-items-center">
                        <div className="col-12 col-md-3">
                            DEFENSE
                        </div>
                        <div className="col-12 col-md-9">
                            <div className="progress">
                                <div className="progress-bar"
                                role="progressBar"
                                style={{width: `${this.state.stats.defense}%`}}
                                aria-valuenow={this.state.stats.defense}
                                aria-valuemin="0"
                                aria-valuemax="100">
                                <small>{this.state.stats.defense}</small>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row align-items-center">
                        <div className="col-12 col-md-3">
                            SPEED
                        </div>
                        <div className="col-12 col-md-9">
                            <div className="progress">
                                <div className="progress-bar"
                                role="progressBar"
                                style={{width: `${this.state.stats.speed}%`}}
                                aria-valuenow={this.state.stats.speed}
                                aria-valuemin="0"
                                aria-valuemax="100">
                                <small>{this.state.stats.speed}</small>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row align-items-center">
                        <div className="col-12 col-md-3">
                            SPECIAL ATTACK
                        </div>
                        <div className="col-12 col-md-9">
                            <div className="progress">
                                <div className="progress-bar"
                                role="progressBar"
                                style={{width: `${this.state.stats.specialAttack}%`}}
                                aria-valuenow={this.state.stats.specialAttack}
                                aria-valuemin="0"
                                aria-valuemax="100">
                                <small>{this.state.stats.specialAttack}</small>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row align-items-center">
                        <div className="col-12 col-md-3">
                            SPECIAL DEFENSE
                        </div>
                        <div className="col-12 col-md-9">
                            <div className="progress">
                                <div className="progress-bar"
                                role="progressBar"
                                style={{width: `${this.state.stats.specialDefense}%`}}
                                aria-valuenow={this.state.stats.specialDefense}
                                aria-valuemin="0"
                                aria-valuemax="100">
                                <small>{this.state.stats.specialDefense}</small>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                            </div>

                         
                           
                        </div>
                        <div className="row mt-1">
                                <div className="col  text-center">
                                    <p className="p-2">{this.state.description}</p>
                                </div>
                            </div>
                    </div>
                    <hr className="ml-4 mr-4"/>
                    <div className="card-body">
                        <h5 className="card-title text-center">Profile</h5>
                        <div className="row">
                            <div className="col col-md-6">
                                <div className="row">
                                    <div className="col-md-6">
                                    <h6 className="float-right">Height:</h6>
                                    </div>
                                    <div className="col-md-6"><h6 className="float-left">
                                        {this.state.height} ft.</h6></div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                    <h6 className="float-right">Weight:</h6>
                                    </div>
                                    <div className="col-md-6"><h6 className="float-left">
                                        {this.state.weight} lbs.</h6></div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                    <h6 className="float-right">Catch Rate:</h6>
                                    </div>
                                    <div className="col-md-6"><h6 className="float-left">
                                        {this.state.catchRate}%</h6></div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                    <h6 className="float-right">Gender Ratio:</h6>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="progress">
                                            <div className="progress-bar"
                                            role="progressbar"
                                            style={{width: `${this.state.genderRatioFemale}%`, backgroundColor: '#C2185B'}}
                                            aria-valuenow={this.state.genderRatioFemale}
                                            aria-valuemin="0"
                                            aria-valuemax="100">
                                                <small>{this.state.genderRatioFemale}</small>
                                            </div>
                                            <div className="progress-bar"
                                            role="progressbar"
                                            style={{width: `${this.state.genderRatioMale}%`, backgroundColor: '#1976D2'}}
                                            aria-valuenow={this.state.genderRatioMale}
                                            aria-valuemin="0"
                                            aria-valuemax="100">
                                                <small>{this.state.genderRatioMale}</small>
                                            </div>
                                        </div>
                                        </div>
                                </div>
                            </div>
                        

                       
                            <div className="col-md-6">
                                <div className="row">
                                    <div className="col-md-6">
                                        <h6 className="float-right">
                                            Egg Groups:
                                        </h6>
                                    </div>
                                    <div className="col-med-6">
                                        <h6 className="float-left">{this.state.eggGroups}</h6>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        <h6 className="float-right">
                                            Hatch Steps:
                                        </h6>
                                    </div>
                                    <div className="col-med-6">
                                        <h6 className="float-left">{this.state.hatchSteps}</h6>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        <h6 className="float-right">
                                            Abilities:
                                        </h6>
                                    </div>
                                    <div className="col-med-6">
                                        <h6 className="float-left">{this.state.abilities}</h6>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        <h6 className="float-right">
                                            EVs:
                                        </h6>
                                    </div>
                                    <div className="col-med-6">
                                        <h6 className="float-left">{this.state.evs}</h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-footer text-muted mt-2">
                            Data from{' '}<a href="https://pokeapi.co/" target="_blank" className="card-link">PokeAPI.co</a></div>
                    </div>
                </div>
            </div>
        )
    }
}
