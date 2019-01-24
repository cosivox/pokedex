import { apiURL } from "../api"
import styled from "styled-components"
import addZeros from "../lib/addZeros"

const select = `
    border-color:#7ad4c3;
        box-shadow: 2px 2px 10px rgba(195, 195, 195, 0.8);
`

const Container = styled.a`
    cursor: pointer;
    text-align: center;
    background-color: #fff;
    width:100%;
    padding: 20px 0 15px;
    border: 1px solid #f0f0f0;
    border-radius: 9px 0;

    &:hover{
        ${select}
    }

    ${({selected})=>selected?select:null}
`

const Name= styled.div`
    color: #273d4d;
    font-weight: 500;
    font-size: 18px;
    text-transform: capitalize;
    margin-top: 10px;
`

const Id = styled.div`
    color: #9d9d9d;
    font-size: 13px;
    margin-top: 5px;
`

const PokemonDetail = (props) => {
    const { pokemon: { name, url, id }, onClick } = props
    return <Container selected={props.selected} key={id} onClick={()=>onClick(props.pokemon)}>
        <div><img src={apiURL.frontSprite(id)} alt="" /></div>
        <Name>{name}</Name>
        <Id>#{addZeros(id)}</Id>
    </Container>
}

export default PokemonDetail