/*======== FUNÇÃO DE FECHAR A PÁGINA DE ENTRADA ================*/
function closeJoinPage() {
    document.querySelector(".join-page").classList.add("hidden");
}

/*======== FUNÇÃO DE ABRIR O MENU =============================*/
function openMenu() {
    document.querySelector(".menu").classList.add("active");
    document.querySelector(".blur").classList.add("show");
}

/*======== FUNÇÃO DE FECHAR O MENU ===========================*/
function closeMenu() {
    document.querySelector(".menu").classList.remove("active");
    document.querySelector(".blur").classList.remove("show");
}

/*======== FUNÇÃO DE SELECIONAR O CONTATO ====================*/
function selectContact(element) {
    let click = element.querySelector(".contact>div>img");
    let was_Clicked = document.querySelector(".contact>div>.checked");
    if (was_Clicked !== null) {
        was_Clicked.classList.remove("checked");
    }
    click.classList.add("checked");
}

/*======== FUNÇÃO DE SELECIONAR A PRIVACIDADE ================*/
function selectPrivacy(element) {
    let click = element.querySelector(".privacy>div>img");
    let was_Clicked = document.querySelector(".privacy>div>.checked");
    if (was_Clicked !== null) {
        was_Clicked.classList.remove("checked");
    }
    click.classList.add("checked");
}

/*======== FUNÇÕES E VARIÁVEIS  ====================*/
let nome;
let nomes;
let messages_On_Screen = document.querySelector(".messages ul");
let user_On_Screen = document.querySelector(".contact");
let message;
let my_message;
let my_message_obj;
let cadastro_Nome = {};
let input_Enter = document.querySelector("footer>input");

/*======== FUNÇÃO DE CADASTRO NO NOME DE ENTRADA =============*/
function joinUser() {
    nome = document.querySelector(".join-page>input").value;
    cadastro_Nome = 
    {
        name: nome
    }

    let promisse = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants ', cadastro_Nome);

    promisse.then(verifyEntrance)
    promisse.catch(verifyError)
    
}

function verifyUser() {
    let promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', cadastro_Nome);
}
setInterval(verifyUser, 5000);

/*======== FUNÇÃO DE VERIFICAR A ENTRADA ================*/
function verifyEntrance() {
    closeJoinPage();
    document.querySelector(".fix").scrollIntoView({block: "end"});
    getUsers();
    getMessages();
}

/*======== FUNÇÃO DE VERIFICAR ERRO ================*/
function verifyError(error) {
    let verify = error.response.status;
    if (verify === 400) {
        alert("Este nome está em uso, scolha outro!");
        document.querySelector(".join-page>input").value = "";
    }
}

/*======== FUNÇÃO DE PEGAR MENSAGENS DO SERVIDOR ============*/
function getMessages() {
    let promisse = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    promisse.then(seeMessages);
}

/*======== FUNÇÃO DE VER AS MENSAGENS DO SERVIDOR ===========*/
function seeMessages(messages) {
    messages_On_Screen.innerHTML="";
    message = messages.data;
    message.forEach(addMessages);
}

/*======== FUNÇÃO DE ADICIONAR AS MENSAGENS AO HTML============*/
function addMessages(msg) {

    if(msg.type === "status") {
        messages_On_Screen.innerHTML += 
        `
        <li class="${msg.type}">
            <p><a> (${msg.time}) </a><strong> ${msg.from} </strong> ${msg.text} </p>
        </li>
        `
    } else if(msg.type === "message") {
        messages_On_Screen.innerHTML +=
        `
        <li class="${msg.type}">
            <p><a> (${msg.time}) </a><strong> ${msg.from} </strong> para <strong> ${msg.to}: </strong> ${msg.text} </p>
        </li>
        `
    } else if(msg.type === "private_message") {
        messages_On_Screen.innerHTML +=
        `
        <li class="${msg.type}">
            <p><a> (${msg.time}) </a><strong> ${msg.from} </strong> reservadamente para <strong> ${msg.to}: </strong> ${msg.text} </p>
        </li>
        `
    }
}
setInterval(getMessages, 3000);

/*======== FUNÇÃO DE PEGAR OS USUÁRIOS ================*/
function getUsers() {
    let promisse = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants");
    promisse.then(seeUsers)
}

/*======== FUNÇÃO DE VER OS USUAÁRIOS ================*/
function seeUsers(answer) {
    user_On_Screen.innerHTML=
    `
    <h1>Escolha um contato para enviar mensagem:</h1>
    <div class="wrap" onclick="selectContact(this)">
        <div>
            <img src="assets/img/people 2.svg" alt="">
            <h3>Todos</h3>
        </div>
        <img class="checked" src="assets/img/check.svg" alt="">
    </div>
    `;
    nomes = answer.data;
    addUserToList();
}

/*======== FUNÇÃO DE ADICIONAR OS USUÁRIOS ================*/
function addUserToList() {
    for(let i = 0; i < nomes.length; i++){
        user_On_Screen.innerHTML += 
        `            <div class="wrap" onclick="selectContact(this)">
                        <div>
                            <img src="assets/img/person-circle 1.svg" alt="">
                            <h3>${nomes[i].name}</h3>
                        </div>
                        <img class="" src="assets/img/check.svg" alt="">
                    </div>`
    }
}
setInterval(getUsers, 10000);

/*======== FUNÇÃO DE ENVIAR MENSAGENS ================*/
function sendMessage() {
    my_message = document.querySelector("footer>input").value;
    my_message_obj = 
    {
        from: nome,
        to: "Todos",
        text: my_message,
        type: "message" // ou "private_message" para o bônus
    }
    let promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', my_message_obj);
    promise.then(messageSent);
    promise.catch(errorMessage);
}

/*===== FUNÇÃO DE VERIFICAR SE A MENSAGEM FOI ENVIADA ========*/
function messageSent() {
    document.querySelector("footer>input").value = "";
    getMessages();
}

function errorMessage() {
    window.location.reload();
}

/*======== BONUS: ENVIAR MENSAGEM COM ENTER ================*/
input_Enter.addEventListener("keyup", event => {
    if(event.keyCode === 13) {
        event.preventDefault();
        document.querySelector("footer>img").click();
    }
});
