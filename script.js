
// namespace
const pokemonInfoApp = {};

// method that displays the next or previous pokemon
pokemonInfoApp.togglePokemon = (pokemon) => {
    
    let newPokemon;
    
    // event listner for left arrow
    $('.left').off().on('click', () => {
        
        $('.displayPokemon').empty();

        if (pokemon.id === 1) {
            newPokemon = 898;
        } else {
            newPokemon = pokemon.id - 1;
        }
        pokemonInfoApp.displayThatPokemon(newPokemon);
    });

    // event listener for the right arrow
    $('.right').off().on('click', () => {
        $('.displayPokemon').empty();
        if (pokemon.id === 898) {
            newPokemon = 1;
        } else {
            newPokemon = pokemon.id + 1;
        }
        pokemonInfoApp.displayThatPokemon(newPokemon);
    });
};

// method to display dreamworld artwork
pokemonInfoApp.displayDreamworld = (pokemon) => {
    
    let dreamWorld = false;

    $('.displayPokemon').on('click', '.officialArt', () => {

        console.log({dreamWorld});
        console.log({pokemon});
        if (dreamWorld == false){
            const dreamworldPokemon = `
                <img src=${pokemon.sprites.other["dream_world"].front_default} alt=${pokemon.name}/>
            `;
            $('.officialArt').html(dreamworldPokemon);
            dreamWorld = true;
        } else {
            const dreamworldPokemon = `
                <img src=${pokemon.sprites.other["official-artwork"].front_default} alt=${pokemon.name}/>
            `;
            $('.officialArt').html(dreamworldPokemon);
            dreamWorld = false;
        }
    });
};

// method to display shiny pokemon sprite
pokemonInfoApp.displayShiny = (pokemon) => {
    
    let isShiny = false;

    $('.displayPokemon').on('click', '.pokemonImages', () => {

        if (isShiny == false){
            const pokemonSprite = `
                <img class="sprite" src=${pokemon.sprites.front_shiny} alt="Shiny ${pokemon.name}"/>
                <img class="sprite" src=${pokemon.sprites.back_shiny} alt="Shiny ${pokemon.name}"/>
            `;
            $('.pokemonImages').html(pokemonSprite);
            isShiny = true;
        } else {
            const pokemonSprite = `
                <img class="sprite" src=${pokemon.sprites.front_default} alt="${pokemon.name} sprite front"/>
                <img class="sprite" src=${pokemon.sprites.back_default} alt="${pokemon.name} sprite back"/>
            `;
            $('.pokemonImages').html(pokemonSprite);
            isShiny = false;
        }
    });
};

// method that displays information about the user's search query
pokemonInfoApp.displayThatPokemon = (thePokemon) => {
    
    const pokedexInfo = pokemonInfoApp.pokedex(thePokemon);

    pokedexInfo.done(pokemon => {
        console.log(pokemon.name);
        const pokemonImg = pokemon.sprites.other["official-artwork"].front_default;
        const number = pokemon.id;

        // the second API only accepts id numbers, thus, send the id found from the first call to the second
        const pokemonDescription = pokemonInfoApp.getPokemonDescription(number);
        pokemonDescription.done(idInfo => {
            
            // for loop to check if the description is in english
            let description;
            let x = idInfo["flavor_text_entries"].length;
            for(n = 0; n < x; n++) {
                if (idInfo.flavor_text_entries[n]["language"]["name"] == "en") {
                    description = idInfo.flavor_text_entries[n].flavor_text;
                    break;
                }
            }
            
            const pokemonHTML = `
                <div class="pokemonInfo">
                    <h2><span>${pokemon.name}</span> #${pokemon.id}</h2>
                    <p>${description}</p>
                    <div class="officialArt">
                        <img src=${pokemonImg} alt=${pokemon.name}/>
                    </div>
                    <div class="pokemonImages">
                        <img class="sprite" src=${pokemon.sprites.front_default} alt="${pokemon.name}"/>
                        <img class="sprite" src=${pokemon.sprites.back_default} alt="${pokemon.name}"/>
                    </div>
                    <ul class="pokemonTypeDisplay">
                        
                    </ul>
                    <div class="pokemonStats">
                        <ul>
                            <li>Base HP: <span>${pokemon.stats[0].base_stat}</span></li>
                            <li>Base Speed: <span>${pokemon.stats[5].base_stat}</span></li>
                            <li>Base Attack: <span>${pokemon.stats[1].base_stat}</span></li>
                            <li>Base Defense: <span>${pokemon.stats[2].base_stat}</span></li>
                        </ul>
                    </div>
                </div>
                `;

            // display the pokemonHTML
            $('.displayPokemon').html(pokemonHTML);
            $('.left').addClass("fas fa-arrow-left");
            $('.right').addClass("fas fa-arrow-right");
            
            const pokeApiTypesArray = pokemon.types;
            
            // find and display what type of pokemon it is
            pokeApiTypesArray.forEach((pokeApiType) => {
                const typesDisplay = `
                    <li class="${pokeApiType.type.name}">${pokeApiType.type.name}</li>
                `;

                $('.pokemonTypeDisplay').html(typesDisplay);
            });
        });

        // only call display shiny if the pokemon has a shiny
        if (pokemon.sprites.front_shiny !== null) {
            pokemonInfoApp.displayShiny(pokemon);
        }

        // only call display shiny if the pokemon has a dreamworld art
        if (pokemon.sprites.other["dream_world"]["front_default"] !== null) {
            pokemonInfoApp.displayDreamworld(pokemon);
        }

        // make the arrows interactable
        pokemonInfoApp.togglePokemon(pokemon);
    });
};

// Method that finds information from pokeAPI
pokemonInfoApp.pokedex = (whichPokemon) => {

    // make AJAX request to pokeAPI
    const getPokedexInfo = $.ajax({
        url: `https://pokeapi.co/api/v2/pokemon/${whichPokemon}`,
        method: 'GET',
        dataType: 'json',
        error: function(xhr, status, error) {

            const pokemonError = `
                <div class="error">
                    <h3>Pokemon not in the system. Please see if the spelling is correct. You can also search by id number</h3>
                    <img src="./assets/error.png"/>
                </div>
            `;

            $('.displayPokemon').append(pokemonError);
        }
    });

        return getPokedexInfo;

};

// method to use the id number to find pokemon descriptions
pokemonInfoApp.getPokemonDescription = (id) => {

    const getDescription = $.ajax({
        url: `https://pokeapi.co/api/v2/pokemon-species/${id}/`,
        method: 'GET',
        dataType: 'json',
        error: function(xhr, status, error) {
            console.log("error");
            const pokemonError = `
                <div class="error">
                    <h3>Pokemon not in the system. Please see if the spelling is correct. You can also search using id number.</h3>
                    <img src="./assets/error.png"/>
                </div>
            `;
            
            $('.displayPokemon').append(pokemonError);
        }
    });
    return getDescription;
};

// method to generate a random number 
pokemonInfoApp.randomElement = () => {
    // random number between 1 - 298 (# of pokemon found in the pokemon-species API)
    const index = Math.floor(Math.random() * 898) + 1;
    console.log(index);
    // return array[index];
    pokemonInfoApp.displayThatPokemon(index);
}

// method that determines which search option is used
pokemonInfoApp.whoIsThatPokemon = () => {

    // user used search bar to find pokemon
    $('#textSearch').on('submit', () => {

        event.preventDefault();

        $('.displayPokemon').empty();

        // store the value of the searched pokemon
        const pokemonFinder = $('#pokemonFinder').val();
        $('#pokemonFinder').val('');
        
        // change all the characters to lowercase to avoid error in api search
        pokemonInfoApp.displayThatPokemon(pokemonFinder.toLowerCase());
    });

    // user clicked the random pokemon button to show a random button
    $('#randomBtn').on('click', () => {
        event.preventDefault();
        $('.displayPokemon').empty();

        // find a random number
        pokemonInfoApp.randomElement();
    });

};

// Create an initialization method
pokemonInfoApp.init = () => {
    pokemonInfoApp.whoIsThatPokemon();

};

// start app after DOM is loaded
$(() => {
    // call the initialization method
    pokemonInfoApp.init();
});