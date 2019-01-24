import fetch from 'isomorphic-unfetch'

export const apiURL= {
    base:"https://pokeapi.co/api/v2",
    frontSprite: (number)=>"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/"+number+".png"
}

const api = {
    fetch: (url, props = {}) => fetch(apiURL.base + url, props),
    get: (url, props = {}) => {
        props.method = "get"
        return api.fetch(url, props)
    }
}

export default api