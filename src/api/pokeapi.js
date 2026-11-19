export async function getPokemon(name) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    const data = await response.json();
    return data;
}

export async function getPokemonDebilidades(double_damage_from) {
    const response = await fetch(`https://pokeapi.co/api/v2/type/${double_damage_from}`);
    const data = await response.json();
    return data;
}