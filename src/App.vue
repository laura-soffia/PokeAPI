<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { getPokemon, getPokemonDebilidades } from "./api/pokeapi";

let loading = ref(true)
let pokemon = ref({})
let brain = ref({})

let randomId = Math.floor(Math.random() * 1025) + 1

const coloresTipos = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
}

const emoticones = {
  normal: "⚪",
  fire: "🔥",
  water: "💧",
  electric: "⚡",
  grass: "🌿",
  ice: "❄️",
  fighting: "🥊",
  poison: "☠️",
  ground: "🌍",
  flying: "🕊️",
  psychic: "🔮",
  bug: "🐛",
  rock: "⛰️",
  ghost: "👻",
  dragon: "🐉",
  dark: "🌑",
  steel: "⚙️",
  fairy: "🧚",
}

onMounted(async () => {
  pokemon.value = await getPokemon(randomId)
  console.log(pokemon.value)
  loading.value = false
})

async function cambiarPokemon() {
  loading.value = true
  randomId = Math.floor(Math.random() * 1025) + 1
  pokemon.value = await getPokemon(randomId)
  loading.value = false
}

const types = computed(() => pokemon.value?.types || [])
const double = computed(() => brain.value?.damage_relations?.double_damage_from || [])
const type = computed(() => types.value?.[0]?.type?.name)

const degradado = computed(() => {
  const color1 = coloresTipos[types.value?.[0]?.type?.name] || "#ccc"
  const color2 = coloresTipos[types.value?.[1]?.type?.name] || color1
  return `linear-gradient(135deg, ${color1}, ${color2})`
})

watch(type, async (tipo1) => {
  if (tipo1) {
    brain.value = await getPokemonDebilidades(tipo1)
  }},
  { immediate: true }
)
</script>

<template>
<div class="contenedor">

  <p v-if="loading" class="cargando">Cargando Datos</p>

  <div v-else class="tarjeta" :style="{ background: degradado }">
    <h2>#{{ pokemon?.id }}</h2>
    <h1>{{ pokemon?.name }}</h1>
    <img class="foto" :src="pokemon?.sprites.other.home.front_default" :alt="pokemon?.name">

    <p>
      Altura: {{ pokemon?.height / 10 }} m <br>
      Peso: {{ pokemon?.weight / 10 }} kg
    </p>

    <div class="caja">
      <h3>Tipo de Pokemon:</h3>
      <span v-for="type in types" :key="type.slot" class="etiqueta" :style="{ background: coloresTipos[type.type.name] }">
        {{ emoticones[type.type.name] }} {{ type.type.name }}
      </span>

      <h3>Debilidades del Pokemon:</h3>
      <span v-for="debilidades in double" :key="debilidades.name" class="etiqueta" :style="{ background: coloresTipos[debilidades.name] }">
        {{ emoticones[debilidades.name] }} {{ debilidades.name }}
      </span>

      <h3>Estadisticas</h3>
      <div v-for="estadistica in pokemon?.stats" :key="estadistica.stat.name" class="stat">
        <small>{{ estadistica.stat.name }}: {{ estadistica.base_stat }}/255</small>
        <div class="barra">
          <div class="progreso" :style="{ width: (estadistica.base_stat / 255) * 100 + '%' }"></div>
        </div>
      </div>
    </div>

    <button @click="cambiarPokemon">Cambiar Pokemon</button>
  </div>

</div>
</template>

<style lang="css">

/* Fondo */
body {
  margin: 0;
  background: white;
  font-family: Arial, sans-serif;
}

.contenedor {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.cargando {
  color: #333;
  font-size: 20px;
}

/* Tarjeta */
.tarjeta {
  width: 100%;
  max-width: 400px;
  padding: 14px;
  box-sizing: border-box;
  border-radius: 24px;
  color: white;
  text-align: center;
  box-shadow: 0 10px 35px rgba(0, 0, 0, 0.6);
  border: 4px solid white;
}

.tarjeta h1 {
  text-transform: capitalize;
  margin: 0;
  font-size: 22px;
}

.tarjeta h2 {
  margin: 0;
  font-size: 16px;
  text-align: left;
}

.tarjeta p {
  margin: 6px;
  font-size: 14px;
}

.foto {
  width: 100%;
  max-width: 190px;
  height: auto;
}

/* Datos */
.caja {
  padding: 10px;
}

.caja h3 {
  margin: 10px;
  font-size: 15px;
}

.etiqueta {
  display: inline-block;
  margin: 3px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
  text-transform: capitalize;
}

/* Estadisticas */
.stat {
  text-align: left;
  margin-bottom: 5px;
}

.stat small {
  text-transform: capitalize;
  font-weight: bold;
  font-size: 12px;
}

.barra {
  background: rgba(255, 255, 255, 0.25);
  border-radius: 10px;
  height: 8px;
  overflow: hidden;
}

.progreso {
  height: 100%;
  border-radius: 10px;
  background: linear-gradient(90deg, #fff, #ffe66d);
}

button {
  margin-top: 12px;
  padding: 9px 20px;
  border: none;
  border-radius: 25px;
  font-size: 15px;
  font-weight: bold;
  cursor: pointer;
  background: white;
}

/* Media querys */
@media (max-width: 400px) {
  .contenedor { padding: 10px; }
  .tarjeta { max-width: 100%; padding: 10px; }
  .foto { max-width: 140px; }
}

@media (min-width: 768px) {
  .tarjeta { max-width: 440px; }
  .foto { max-width: 210px; }
}

@media (min-width: 1200px) {
  .tarjeta { max-width: 480px; }
  .foto { max-width: 230px; }
}
</style>