
// =====================================
// CONFIGURAÇÕES INICIAIS
// =====================================

const API_URL = "https://pokeapi.co/api/v2/pokemon";

const listaPokemons = document.getElementById("listaPokemons");
const mensagem = document.getElementById("mensagem");
const campoPesquisa = document.getElementById("campoPesquisa");
const botaoMais = document.getElementById("botaoMais");

let offset = 0;
const limite = 12;

let todosPokemons = [];
let carregando = false;


// =====================================
// BUSCAR OS POKÉMON NA API
// =====================================

async function buscarPokemons() {

    if (carregando) return;

    carregando = true;

    botaoMais.disabled = true;
    mensagem.textContent = "Carregando Pokémon...";

    try {

        // PRIMEIRO FETCH: BUSCA A LISTA DE POKÉMON

        const resposta = await fetch(
            `${API_URL}?limit=${limite}&offset=${offset}`
        );

        if (!resposta.ok) {
            throw new Error("Não foi possível acessar a API.");
        }

        const dados = await resposta.json();

        // SEGUNDO FETCH: BUSCA OS DETALHES DE CADA POKÉMON

        const detalhes = await Promise.all(

            dados.results.map(async (pokemon) => {

                const respostaDetalhes = await fetch(pokemon.url);

                if (!respostaDetalhes.ok) {
                    throw new Error("Erro ao buscar um Pokémon.");
                }

                return await respostaDetalhes.json();

            })

        );

        // GUARDA OS DADOS RECEBIDOS

        todosPokemons.push(...detalhes);

        // EXIBE OS CARDS

        exibirPokemons(todosPokemons);

        offset += limite;

        mensagem.textContent =
            `Exibindo ${todosPokemons.length} Pokémon.`;

    } catch (erro) {

        console.error("Erro:", erro);

        mensagem.textContent =
            "Não foi possível carregar os Pokémon. Tente novamente.";

    } finally {

        carregando = false;
        botaoMais.disabled = false;

    }

}


// =====================================
// CRIAR OS CARDS DINAMICAMENTE
// =====================================

function criarCard(pokemon) {

    // CRIA O CARD PRINCIPAL

    const card = document.createElement("article");

    card.classList.add("card");


    // CRIA O NÚMERO DO POKÉMON

    const numero = document.createElement("span");

    numero.classList.add("numero");

    numero.textContent =
        `Nº ${String(pokemon.id).padStart(3, "0")}`;


    // CRIA A IMAGEM

    const imagem = document.createElement("img");

    imagem.src =
        pokemon.sprites.other["official-artwork"].front_default
        || pokemon.sprites.front_default;

    imagem.alt = pokemon.name;


    // CRIA O NOME

    const nome = document.createElement("h3");

    nome.textContent = pokemon.name;


    // CRIA A ÁREA DOS TIPOS

    const tipos = document.createElement("div");

    tipos.classList.add("tipos");

    pokemon.types.forEach((item) => {

        const tipo = document.createElement("span");

        tipo.classList.add("tipo");

        tipo.textContent = item.type.name;

        tipos.appendChild(tipo);

    });


    // CRIA AS INFORMAÇÕES ADICIONAIS

    const informacoes = document.createElement("div");

    informacoes.classList.add("informacoes");

    informacoes.textContent =
        `Altura: ${(pokemon.height / 10).toFixed(1)} m | ` +
        `Peso: ${(pokemon.weight / 10).toFixed(1)} kg`;


    // ADICIONA TODOS OS ELEMENTOS AO CARD

    card.appendChild(numero);
    card.appendChild(imagem);
    card.appendChild(nome);
    card.appendChild(tipos);
    card.appendChild(informacoes);


    // RETORNA O CARD COMPLETO

    return card;

}


// =====================================
// EXIBIR OS POKÉMON NA PÁGINA
// =====================================

function exibirPokemons(pokemons) {

    listaPokemons.innerHTML = "";

    pokemons.forEach((pokemon) => {

        const card = criarCard(pokemon);

        listaPokemons.appendChild(card);

    });

}


// =====================================
// PESQUISAR POKÉMON
// =====================================

campoPesquisa.addEventListener("input", () => {

    const pesquisa = campoPesquisa.value.toLowerCase();

    const resultado = todosPokemons.filter((pokemon) => {

        return pokemon.name.includes(pesquisa);

    });

    exibirPokemons(resultado);

    if (resultado.length === 0) {

        mensagem.textContent = "Nenhum Pokémon encontrado.";

    } else {

        mensagem.textContent =
            `${resultado.length} Pokémon encontrado(s).`;

    }

});


// =====================================
// CARREGAR MAIS POKÉMON
// =====================================

botaoMais.addEventListener("click", () => {

    buscarPokemons();

});


// =====================================
// INICIALIZAR A APLICAÇÃO
// =====================================

buscarPokemons();
