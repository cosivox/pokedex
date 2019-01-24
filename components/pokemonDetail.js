import React from "react"
import { apiURL } from "../api"
import styled from "styled-components"
import _ from 'underscore'
import Chart from 'chart.js'
import addZeros from "../lib/addZeros"

const Container = styled.div`
    padding: 30px;
    @media only screen and (max-width: 400px){
        padding: 10px 0;
    }
`

const Description = styled.div`
    display: flex;
    flex-direction: row;
    position: relative;
    min-height:115px;
    align-items:center;


    &:after{
        content: "";
        background: url("/static/pokeball.png");
        background-repeat: no-repeat;
        background-position: center;
        opacity: 0.2;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        position: absolute;
        z-index: -1;   
    }
`

const Name = styled.div`
    color: #273d4d;
    font-weight: 500;
    font-size: 20px;
    text-transform: capitalize;
    margin: 0 0 5px;
`

const Id = styled.div`
    color: #9d9d9d;
    font-size: 13px;
`

const Bold = styled.span`
    font-weight:500;
`

const Flavor = styled.div`
    font-size: 14px;
    color: #555555;
    margin: 20px 0;
    word-spacing: 3px;
`

const StatsTitle = styled.div`
    text-align:center;
    position:relative;
    color: #4b4b4b;
    font-size: 13px;
    margin-bottom: 20px;

    & span{
        background-color:#fff;
        padding: 0 15px;
    }

    &:after{
        content:"";
        height:1px;
        background-color:#ebebeb;
        position:absolute;
        top:50%;
        right: 0;
        left: 0;
        z-index:-1;
    }
`

const RowStat = styled.div`
    display: flex;
    flex-direction: row;
    margin-bottom:10px;
`

const Label = styled.div`
    width: 80px;
    color: #929292;
`

const Bar = styled.div`
    flex:1;
    display: flex;
    flex-direction: row;
    align-items: center;
`

const ProgressContainer = styled.div`
    width: ${({ value }) => value + "%"};
    display: flex;
    flex-direction:row;
    align-items:center;
`

const Progress = styled.div`
    flex: 1;
    /* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#217bd3+0,2baae3+100 */
    background: #217bd3; /* Old browsers */
    background: -moz-linear-gradient(-45deg, #217bd3 0%, #2baae3 100%); /* FF3.6-15 */
    background: -webkit-linear-gradient(-45deg, #217bd3 0%,#2baae3 100%); /* Chrome10-25,Safari5.1-6 */
    background: linear-gradient(135deg, #217bd3 0%,#2baae3 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#217bd3', endColorstr='#2baae3',GradientType=1 ); /* IE6-9 fallback on horizontal gradient */
    height: 13px;
    border-radius: 5px 0 0 5px;
`

const ProgressLeft = styled.div`
    flex: 1;
    background-color: #d8d8d8;
    height: 13px;
    border-radius: 0 5px 5px 0;
`

const Value = styled.div`
    color: #273d4d;
    background-color: #fff;
    border: 1px solid #ebebeb;
    padding: 3px 14px;
    border-radius: 4px;
`

const SwitchContainer = styled.div`
    margin-top: 30px;
    color: #494949;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size:14px;

    & .switch{
        margin-left:10px;
    }
`

const Type = styled.div`
    text-transform: uppercase;
    font-size: 13px;
    background-color: #74a02f;
    display: inline-block;
    padding: 2px 8px;
    color: #fff;
    border-radius: 5px;
    margin-bottom: 5px;
`

const TypesContainer = styled.div`
    display:flex;
    flex-direction: column;
    align-items: flex-start;
`

const Loading = styled.div`
    display: flex;
    align-items: center;
    justify-content:center;

    & .fas{
        color: #d8d8d8;
    }
`


class PokemonDetail extends React.Component {
    state = {
        chart: false,
        statsDefinition: [
            {
                name: "hp",
                display: "HP"
            },
            {
                name: "attack",
                display: "Attack"
            },
            {
                name: "defense",
                display: "Defense"
            },
            {
                name: "speed",
                display: "Speed"
            },
            {
                name: "special-attack",
                display: "Sp Atk"
            },
            {
                name: "special-defense",
                display: "Sp Def"
            },
        ]
    }

    loadPokemon = (pokemon)=>{
        const newStats = []
        for (const i in this.state.statsDefinition) {
            const statDef = this.state.statsDefinition[i]
            newStats.push({
                ...statDef,
                value: _.find(pokemon.stats, stat => stat.stat.name == statDef.name).base_stat
            })
        }
        this.setState({
            statsDefinition: newStats
        })
        var ctx = document.getElementById('pokemonChart').getContext('2d');
        var chart = new Chart(ctx, {
            // The type of chart we want to create
            type: 'radar',

            // The data for our dataset
            data: {
                labels: newStats.map(stat => stat.display),
                datasets: [{
                    backgroundColor: 'rgba(62, 164, 236, 0.17)',
                    borderColor: '#3ea4ec',
                    data: newStats.map(stat => stat.value),
                }]
            },

            // Configuration options go here
            options: {
                scale: {
                    ticks: {
                        min: 0,
                        stepSize: 10
                    }
                }
            }
        });
        chart.options.legend.display = false;
    }

    componentDidUpdate(prevProps) {
        // verify props have changed to avoid an infinite loop
        if (!prevProps.pokemon.stats && this.props.pokemon.stats) {
            this.loadPokemon(this.props.pokemon)
        }
    }

    chartSwitch = event => {
        this.setState({
            chart: event.target.checked
        })
    }

    render() {
        if(this.props.pokemon)
            this.pokemon = this.props.pokemon
        const pokemon  = this.pokemon
        return <Container>
            {!this.props.loading && pokemon && <><Description>
                <div style={{ marginRight: 20 }} ><img src={pokemon.sprites.front_default} alt="" /></div>
                <div style={{ flex: 1, display: "flex", flexDirection: "row" }}>
                    <div style={{ flex: 1 }} >
                        <Id>#{addZeros(pokemon.id)}</Id>
                        <Name>{pokemon.name}</Name>
                        <TypesContainer>{pokemon.types.map(type => <Type key={type.type.name}>{type.type.name}</Type>)}</TypesContainer>
                    </div>
                    <div style={{ fontSize: 15, color: "#4a4a4a" }}>
                        <div><Bold>Height:</Bold> {pokemon.height}m</div>
                        <div><Bold>Weight:</Bold> {pokemon.weight}kg</div>
                    </div>
                </div>
            </Description>
            <Flavor>
                {pokemon.flavor}
            </Flavor>
            <StatsTitle><span>STATISTICS</span></StatsTitle>
            <div style={{ ...this.state.chart ? { position: "relative", visibility: "visible" } : { position: "absolute", visibility: "hidden" } }}><canvas height={250} id="pokemonChart"></canvas></div>
            {!this.state.chart && <div>{this.state.statsDefinition.map((stat, i) => <RowStat key={i}>
                <Label>{stat.display}</Label>
                <Bar>
                    <ProgressContainer value={(stat.value * 100) / 150}>
                        <Progress /><Value>{stat.value}</Value>
                    </ProgressContainer>
                    <ProgressLeft />
                </Bar>
            </RowStat>)}</div>}
            <SwitchContainer>
                Chart View
            <label className="switch">
                    <input onChange={this.chartSwitch} type="checkbox" />
                    <span className="slider round"></span>
                </label>
            </SwitchContainer></> || <Loading>
                <div className="fa-3x">
                    <i className="fas fa-spinner fa-spin"></i>
                </div>
            </Loading>}
        </Container>
    }
}

export default PokemonDetail
