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

let pokemon = 1
let last_pokemon = 1

const statusBars = [HP_bar, ATK_bar, DEF_bar, SP_ATK_bar, SP_DEF_bar, SPD_bar]
const statusValues = [HP_value, ATK_value, DEF_value, SP_ATK_value, SP_DEF_value, SPD_value]

const backs = {water: 'FundoAgua.png', grass: 'FundoPadrao.png', fire: 'FundoFogo.png', ice: 'FundoGelo.png', dark: 'FundoNoite.png',
    flying: 'FundoVoador.png', ghost: 'FundoNoite.png', ground: 'FundoTerra.png', rock: 'FundoTerra.png', dragon: 'FundoDragão.png',
    fairy: 'FundoFada.png', electric: 'FundoEletrico.png', steel: 'FundoMetal.png', psychic: 'FundoPsiquico.png', fighting: 'FundoLutador.png',
    bug: 'FundoInseto.png', poison: 'FundoVeneno.png'
}

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
    const [data, specie_data] = await Promise.all([
        fecthPokemons(pokemon),
        fecthPokemonSpecie(`${BASE_URL.replace('pokemon/', 'pokemon-species/')}${pokemon}/`)
    ]);
    if (!data || !specie_data){
    alert("Pokemon não encontrado... Tente novamente")
    }

    const tipos = data.types.map(type => type.type)
    const tipoEncontrado = tipos.find(({name}) => name in backs)
    const status = data.stats.map(stat => stat.base_stat)

    if(tipoEncontrado){
        pokeBack.style.backgroundImage = `url('./images/${backs[tipoEncontrado.name]}')`;
    }else{
        pokeBack.style.backgroundImage = "url('./images/FundoPadrao.png')";
    }

    async function fetchTypeData(tipo) {
        const response = await fetch(tipo.url)
        const typeData = await response.json()
        return typeData
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

    Desc.textContent = `"${chooseText(specie_data.flavor_text_entries).flavor_text}"`

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

function chooseText(entries, MAX_LEN = 110){
	// Encontrar a primeira entrada em inglês
	const englishEntry = entries.find(e => e.language?.name === 'en') ?? entries[0]

	if (!englishEntry) return { flavor_text: 'Descrição não disponível' };

	// Normalizar texto: remover \f e quebras, colapsar espaços
	const normalized = (englishEntry.flavor_text || '')
		.replace(/\f/g, ' ')
		.replace(/\s+/g, ' ')
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

// async function translate(texto){
//     const response = await fetch(`https://api.mymemory.translated.net/get?q=${texto}&langpair=en|pt`)
//     if (response.status == 200){
//         const data = await response.json()
//         console.log(data)
//         return data.responseData.translatedText
//     } else{
//         console.warn('Erro na tradução, retornando texto original');
//         return texto;
//     }
// }

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