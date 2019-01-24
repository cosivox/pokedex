import React from "react"
import api from "../api"
import PokemonPreview from "../components/pokemonPreview"
import PokemonDetail from "../components/pokemonDetail"
import Router from 'next/router'
import styled from 'styled-components'
import { withRouter } from 'next/router'
import _ from 'underscore'
import Modal from '../lib/rodal'

import '../styles/index.css'

const Page = styled.a`
    width: 45px;
    height: 45px;
    display: flex;
    background-color: #fff;
    align-items: center;
    justify-content: center;
    border-color: #f0f0f0;
    border-width: 1px;
    border-style: solid;
    margin-right: -1px;
    margin-bottom: -1px;
    color: ${({ selected }) => selected ? "#fff" : "#273d4d"};

    ${({ selected }) => selected ? `
    /* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#bbf1a6+0,4dc1be+100 */
    background: #bbf1a6; /* Old browsers */
    background: -moz-linear-gradient(-45deg, #bbf1a6 0%, #4dc1be 100%); /* FF3.6-15 */
    background: -webkit-linear-gradient(-45deg, #bbf1a6 0%,#4dc1be 100%); /* Chrome10-25,Safari5.1-6 */
    background: linear-gradient(135deg, #bbf1a6 0%,#4dc1be 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#bbf1a6', endColorstr='#4dc1be',GradientType=1 ); /* IE6-9 fallback on horizontal gradient */
    `: null}
`

const PokemonsContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill,minmax(150px, 1fr));
    margin: 0px auto;
    grid-gap: 20px;
    max-width: 1000px;
    justify-items: center;
`

const SearchContainer = styled.div`
    display: flex;
    justify-content:center;
    max-width: 870px;
    margin: 45px auto;
    position: relative;

    & input{
        flex: 1;
        max-width: 870px;
        padding: 15px 15px 15px 36px;
        box-shadow: inset 0px 1px 5px #cacaca;
        border: none;
        border-radius: 5px;
        width: 100%;
        box-sizing: border-box;
    }

    & .fas{
        position: absolute;
        padding: 10px;
        pointer-events: none;
        color: #979797;
        left: 0px;
        top: 0;
        bottom: 0;
        display: flex;
        align-items: center;
    }
`

const PagesContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    max-width: 870px;
    margin: 45px auto;
    flex-wrap: wrap;
`

const LogoContainer = styled.div`
    margin: 50px auto 0;
    text-align: center;
`

const Line = styled.div`
    margin: 0 -20px 0;
    height:5px;
    /* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#bbf1a6+0,4dc1be+100 */
    background: #bbf1a6; /* Old browsers */
    background: -moz-linear-gradient(left, #bbf1a6 0%, #4dc1be 100%); /* FF3.6-15 */
    background: -webkit-linear-gradient(left, #bbf1a6 0%,#4dc1be 100%); /* Chrome10-25,Safari5.1-6 */
    background: linear-gradient(to right, #bbf1a6 0%,#4dc1be 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#bbf1a6', endColorstr='#4dc1be',GradientType=1 ); /* IE6-9 */
`

const Root = styled.div`
    margin: 0 20px;
`

const Loading = styled.div`
    position: fixed;
    top:0;
    right:0;
    left: 0;
    bottom: 0;
    /* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#bbf1a6+0,4dc1be+100 */
    background: #bbf1a6ad; /* Old browsers */
    background: -moz-linear-gradient(-45deg, #bbf1a6ad 0%, #4dc1bead 100%); /* FF3.6-15 */
    background: -webkit-linear-gradient(-45deg, #bbf1a6ad 0%,#4dc1bead 100%); /* Chrome10-25,Safari5.1-6 */
    background: linear-gradient(135deg, #bbf1a6ad 0%,#4dc1bead 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#bbf1a6', endColorstr='#4dc1be',GradientType=1 ); /* IE6-9 fallback on horizontal gradient */

    display: flex;
    align-items: center;
    justify-content:center;

    & .fas{
        color: #fff;
    }
`

const limit = 18

class Index extends React.Component {

    static async getInitialProps({ query }) {
        const res = await api.get("/pokemon/?limit=949")
        const json = await res.json()

        for (const i in json.results) {
            const pokemon = json.results[i]
            pokemon.id = parseInt(pokemon.url.match(/\/([^\/]+)\/?$/)[1])
        }

        return {
            pokemons: json.results,
            count: json.count,
            offset: query.page ? (query.page - 1) * limit : 0
        }
    }

    constructor(props) {
        super(props)
        this.state = {
            pokemons: props.pokemons,
            offset: props.offset,
            pokemonsFiltered: false
        }
    }

    componentDidUpdate(prevProps) {
        const { pathname, query } = this.props.router
        // verify props have changed to avoid an infinite loop
        if (query.page !== prevProps.router.query.page) {
            this.setState({
                offset: query.page ? (query.page - 1) * limit : 0
            })
        }
    }

    searchPokemon = (event) => {
        const value = event.target.value
        if (value) {
            if (!this.pageBuffer)
                this.pageBuffer = this.props.router.query.page
            const href = '/'
            Router.push(href, href, { shallow: true })

            const regex = new RegExp(value + ".*", "gi");
            const pokemonsFiltered = _.filter(this.state.pokemons, pokemon => {
                return pokemon.name.match(regex) || pokemon.id == value
            })
            this.setState({
                pokemonsFiltered,
            })
        } else {
            this.setState({
                pokemonsFiltered: false
            })
            if (this.pageBuffer) {
                this.changePage(this.pageBuffer)
                this.pageBuffer = null
            }
        }

    }

    changePage = (pageNumber) => {
        const href = '/?page=' + pageNumber
        Router.push(href, href, { shallow: true })
    }

    selectPokemon = async (pokemon) => {
        this.setState({
            loading: true,
            pokemonSelected: pokemon
        })

        let pokemonDetail = await api.get("/pokemon/" + pokemon.id)
        pokemonDetail = await pokemonDetail.json()
        let pokemonSpecies = await fetch(pokemonDetail.species.url)
        pokemonSpecies = await pokemonSpecies.json()

        pokemonDetail.flavor = _.find(pokemonSpecies.flavor_text_entries, flavor => flavor.language.name == "en").flavor_text

        this.setState({
            loading: false,
            pokemonSelected: pokemonDetail
        })
    }

    deselectPokemon = () => {
        this.setState({
            pokemonSelected: null
        })
    }

    render() {
        const { offset, pokemonsFiltered, pokemonSelected } = this.state
        const actualPage = this.props.router.query.page ? parseInt(this.props.router.query.page) : 1
        const pokemons = pokemonsFiltered ? pokemonsFiltered : this.state.pokemons
        const count = pokemons.length

        const pages = []

        const remainder = count % limit == 0 ? 0 : 1
        for (let i = 1; i <= count / limit + remainder; i++)
            pages.push(<Page selected={actualPage == i} key={i} onClick={() => { this.changePage(i) }} >{i}</Page>)

        return <Root>
            <Line />
            <LogoContainer><img src="/static/logo-pokemon.png" alt="" /></LogoContainer>
            <SearchContainer>
                <i className="fas fa-search"></i>
                <input onChange={this.searchPokemon} placeholder="Search by keywords..." type="text" className="form-control" />
            </SearchContainer>
            <PokemonsContainer>
                {pokemons.slice(offset, offset + limit).map((pokemon, index) => <PokemonPreview selected={this.state.pokemonSelected && this.state.pokemonSelected.id == pokemon.id} key={pokemon.id} onClick={this.selectPokemon} pokemon={pokemon} />)}
            </PokemonsContainer>
            {pages.length > 1 && <PagesContainer>
                {pages}
            </PagesContainer>}
            <Modal showCloseButton={!this.state.loading} closeMaskOnClick={!this.state.loading} visible={!!pokemonSelected} onClose={this.deselectPokemon} width={500}>
                <PokemonDetail loading={this.state.loading} pokemon={pokemonSelected} />
            </Modal>
        </Root>
    }
}

export default withRouter(Index)
