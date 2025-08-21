const BASE_URL = 'https://pokeapi.co/api/v2/pokemon/'

const pokeImg = document.querySelector('.pokemon-image')
const pokeBack = document.querySelector('.pokemon-container')
const btnLeft = document.querySelector('#btn-left')
const btnRight = document.querySelector('#btn-right')
const btnSound = document.querySelector('#btn-sound')
const HP_bar = document.querySelector('#HP-bar')
const ATK_bar = document.querySelector('#ATK-bar')
const DEF_bar = document.querySelector('#DEF-bar')
const SP_ATK_bar = document.querySelector('#SP_ATK-bar')
const SP_DEF_bar = document.querySelector('#SP_DEF-bar')
const SPD_bar = document.querySelector('#SPD-bar')
const HP_value = document.querySelector('#HP-value')
const ATK_value = document.querySelector('#ATK-value')
const DEF_value = document.querySelector('#DEF-value')
const SP_ATK_value = document.querySelector('#SP_ATK-value')
const SP_DEF_value = document.querySelector('#SP_DEF-value')
const SPD_value = document.querySelector('#SPD-value')
const entry = document.querySelector('.entry')
const form = document.querySelector('form');
const pokeName = document.querySelector('.poke-name');
const typesPainel = document.querySelector('.types-painel')
const typesRow = document.querySelector('.types-row')
const Weight = document.querySelector('.poke-weight')
const Height = document.querySelector('.poke-height')
const Desc = document.querySelector('.poke-desc')
const body = document.querySelector('body')

let pokemon = 1
let last_pokemon = 1

const statusBars = [HP_bar, ATK_bar, DEF_bar, SP_ATK_bar, SP_DEF_bar, SPD_bar]
const statusValues = [HP_value, ATK_value, DEF_value, SP_ATK_value, SP_DEF_value, SPD_value]

const backs = {water: 'FundoAgua.png', grass: 'FundoPadrao.png', fire: 'FundoFogo.png', ice: 'FundoGelo.png', dark: 'FundoNoite.png',
    flying: 'FundoVoador.png', ghost: 'FundoNoite.png', ground: 'FundoTerra.png', rock: 'FundoTerra.png', dragon: 'FundoDragão.png',
    fairy: 'FundoFada.png', electric: 'FundoEletrico.png', steel: 'FundoMetal.png', psychic: 'FundoPsiquico.png', fighting: 'FundoLutador.png',
    bug: 'FundoInseto.png', poison: 'FundoVeneno.png', normal: 'FundoPadrao.png'
}

const typeGradients = {
    normal: 'radial-gradient(circle at center, #DDC988, #8B7A4C)',
    fire: 'radial-gradient(circle at center,rgb(255, 153, 80),rgb(194, 65, 0))',
    water: 'radial-gradient(circle at center,rgb(118, 175, 250),rgb(23, 83, 156))',
    electric: 'radial-gradient(circle at center,rgb(248, 232, 107),rgb(185, 155, 5))',
    grass: 'radial-gradient(circle at center, #86E64B, #4C6F2A)',
    ice: 'radial-gradient(circle at center, #C6EBF4, #61A4B0)',
    fighting: 'radial-gradient(circle at center,rgb(245, 149, 125),rgb(155, 37, 47))',
    poison: 'radial-gradient(circle at center, #A155A2, #4C264D)',
    ground: 'radial-gradient(circle at center,rgb(230, 181, 108),rgb(180, 116, 31))',
    flying: 'radial-gradient(circle at center, #A98FF3, #72A5D8)',
    psychic: 'radial-gradient(circle at center,rgb(252, 183, 162),rgb(255, 96, 75))',
    bug: 'radial-gradient(circle at center, #B9C63A,rgb(81, 88, 42))',
    rock: 'radial-gradient(circle at center,rgb(248, 226, 155),rgb(148, 138, 104))',
    ghost: 'radial-gradient(circle at center, #7A589F, #362E4A)',
    dragon: 'radial-gradient(circle at center,rgb(101, 122, 154),rgb(35, 36, 105))',
    dark: 'radial-gradient(circle at center, #705746, #4C3C30)',
    steel: 'radial-gradient(circle at center, #8A8B9D, #202020)',
    fairy: 'radial-gradient(circle at center,rgb(241, 171, 213),rgb(170, 62, 127))',
};

async function fecthPokemons(pokemon){
    const response = await fetch(`${BASE_URL}${pokemon}`)
    let data = ""
    if(response.status == 200){
        data = await response.json()
    }
    else{
        data = null
    }
    return data
}

async function fecthPokemonSpecie(url){
    const response = await fetch(url)
    let data = ""
    if(response.status == 200){
        data = await response.json()
    }
    else{
        data = null
    }
    return data
}

async function renderPokemon(pokemon){
    const data = await fecthPokemons(pokemon);
        
    if (!data){
    alert("Pokemon não encontrado... Tente novamente")
    }
    else{
        const tipos = data.types.map(type => type.type)
    const tipoEncontrado = tipos.find(({name}) => name in backs)
    const status = data.stats.map(stat => stat.base_stat)

    if(tipoEncontrado){
        pokeBack.style.backgroundImage = `url('./images/${backs[tipoEncontrado.name]}')`
        body.style.background = typeGradients[tipoEncontrado.name];
    }else{
        pokeBack.style.backgroundImage = "url('./images/FundoPadrao.png')";
        body.style.background = 'radial-gradient(circle at center, #6d6e70, #202020)';
    }

    const tiposData = await Promise.all(
        tipos.map(tipo => fetchTypeData(tipo))
    )

    let typesHTML = ''
    tiposData.forEach((typeData, index) => {
        if (typeData){
            const typeUrl = typeData.sprites['generation-viii']['sword-shield'].name_icon
            typesHTML += `<img class='type-img' src='${typeUrl}' alt='${tipos[index].name}'>`
        }
    })
    
    typesRow.innerHTML = typesHTML

    const name = data.name
    const nomeCorreto = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
    pokeName.innerHTML = `${data.id} - ${nomeCorreto}`

    Weight.innerHTML = `${(data.weight / 10)} kg`
    Height.innerHTML = `${(data.height / 10)} m`

    const specie_data = await fecthPokemonSpecie(data.species.url)
    if (!specie_data){
        Desc.textContent = 'Descrição não disponível'
    } else{
        Desc.textContent = `"${chooseText(specie_data.flavor_text_entries).flavor_text}"`
    }
    
    status.forEach((stat, index )=> {
        statusValues[index].innerHTML = stat;
        statusBars[index].style.width = `${(stat/2)}%`
    });

    HP_value.innerHTML = status[0]
    HP_bar.style.width = `${(status[0]/2)}%`
    
    pokeImg.src = data.sprites.front_default;
    pokeImg.style.animation = 'none';
    void pokeImg.offsetWidth; // Força reflow
    pokeImg.style.animation = 'mover 1s ease-in-out 0s, piscar 0.22s step-end 3';

    last_pokemon = data.id

    return data.id
    }
}

async function getSound(url){
    try {
        // Criar um elemento de áudio
        const audio = new Audio(url);
        
        // Reproduzir o som
        await audio.play();
        
    } catch (error) {
        console.error('Erro ao reproduzir som:', error);
    }
}

async function fetchTypeData(tipo) {
    const response = await fetch(tipo.url)
    const typeData = await response.json()
    return typeData
}

function chooseText(entries, MAX_LEN = 110){
	const englishEntry = entries.find(e => e.language?.name === 'en') ?? entries[0]

	if (!englishEntry) return { flavor_text: 'Descrição não disponível' };

	// Normalizar texto: remover \f e quebras, colapsar espaços
	const normalized = (englishEntry.flavor_text || '')
		.replace(/\f/g, ' ')
		.trim();

	if (normalized.length <= MAX_LEN) {
		return { flavor_text: normalized };
	}

	const slice = normalized.slice(0, MAX_LEN + 1);
	let cut = slice.lastIndexOf('.');
	if (cut === -1) {
		cut = slice.lastIndexOf(' ');
        if (cut > (MAX_LEN - 3)){
            const text = normalized.slice(0, MAX_LEN - 2).trim();
            cut = text.lastIndexOf(' ');
            const finalText = `${text.slice(0, cut)}...`
            return { flavor_text: finalText };
        }
        const finalText = `${normalized.slice(0, cut)}...`
        return { flavor_text: finalText };
	}
	const finalText = normalized.slice(0, cut + 1).trim();
	return { flavor_text: finalText };
} 

async function translate(texto){
    const response = await fetch(`https://api.mymemory.translated.net/get?q=${texto}&langpair=en|pt`)
    if (response.status == 200){
        const data = await response.json()
        console.log(data)
        return data.responseData.translatedText
    } else{
        console.warn('Erro na tradução, retornando texto original');
        return texto;
    }
}

btnLeft.addEventListener('click', async () => {
    if(pokemon > 1){
        pokemon -= 1
        pokemon = await renderPokemon(pokemon)
    }
})

btnRight.addEventListener('click', async () => {
    pokemon += 1
    pokemon = await renderPokemon(pokemon)
})

btnSound.addEventListener('click', async () => {
    const data = await fecthPokemons(pokemon)
    getSound(data.cries.latest)
})

// Event listeners para as teclas de seta do teclado
document.addEventListener('keydown', async (event) => {
    if (event.key === 'ArrowLeft') {
        if(pokemon > 1){
            pokemon -= 1
            pokemon = await renderPokemon(pokemon)
        }
    }
    if (event.key === 'ArrowRight'){
        pokemon += 1
        pokemon = await renderPokemon(pokemon)
    }

    // switch(event.key) {
    //     case 'ArrowLeft':
    //         if(pokemon > 1){
    //             pokemon -= 1
    //             pokemon = await renderPokemon(pokemon)
    //         }
    //         break;
    //     case 'ArrowRight':
    //         pokemon += 1
    //         pokemon = await renderPokemon(pokemon)
    //         break;
    // }
})

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    pokemon = entry.value;
    entry.value = ""
    pokemon = await renderPokemon(pokemon)
});

renderPokemon(pokemon)