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

    ${({ selected }) => selected ? select : null}

    & img{
        background-color: #fff;
        position:relative; 
        z-index:2;
    }
`

const Name = styled.div`
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

const Loading = styled.div`
    position: absolute; 
    top: 0; 
    right: 0;
    left: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;

    & i{
        color: #d8d8d8;
    }
`

const PokemonDetail = (props) => {
    const { pokemon: { name, url, id }, onClick } = props
    return <Container selected={props.selected} key={id} onClick={() => onClick(props.pokemon)}>
        <div style={{ position: "relative", minHeight: 100 }}>
            <Loading className="fa-3x">
                <i className="fas fa-spinner fa-spin"></i>
            </Loading>
            <img src={apiURL.frontSprite(id)} onError={(e) => { e.target.onerror = null; e.target.src = "/static/pokeball.png"; e.target.height = 96 }} alt="" />
        </div>
        <Name>{name}</Name>
        <Id>#{addZeros(id)}</Id>
    </Container>
}

export default PokemonDetail
