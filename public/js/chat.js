const url = (window.location.hostname.includes('localhost'))
            ? 'http://localhost:8080/api/auth/'
            : 'https://restserver-node-2021.herokuapp.com/api/auth/';

let user = null;
let socket = null;

// HTML References
const txtUid        = document.querySelector('#txtUid');
const txtMessage    = document.querySelector('#txtMessage');
const ulMessages    = document.querySelector('#ulMessages');
const ulUsers       = document.querySelector('#ulUsers');
const btnOut        = document.querySelector('#btnOut');

const validateJwt = async() => {

    const token = localStorage.getItem('token') || '';

    if ( token.length <= 10 ) {
        window.location = 'index.html';

        throw new Error('Token not found');
    }

    try {

        const resp = await fetch( url, {
            headers: { 'Authorization': token }
        });
    
        const { user: userStored, token: tokenStored } = await resp.json();
    
        localStorage.setItem( 'token', tokenStored );
        document.title = userStored.name;

        await socketConnect();

    } catch (error) {
        window.location = 'index.html';
        throw new Error('Auth fail');
    }
};

const socketConnect = async() => {


    socket = io({
        'extraHeaders': {
            'Authorization': localStorage.getItem('token')
        }
    });

    socket.on('disconnect', () => {
        console.log('Socket online');
    });

    socket.on('connect', () => {
        console.log('Socket offline');
    });

    socket.on('receive-messages', displayMessages );

    socket.on('active-users', displayUsers );

    socket.on('receive-private', ( payload ) => {
        console.log('Socket receive-private', payload);
    });

};

const displayUsers = ( users = []) => {
    
    let htmlUsers = '';

    users.forEach( ({ name, uid }) => {

        htmlUsers += `
        <li>
            <p>
                <h5 class="text-success">${ name }</h5>
                <span class="fs-6 text-muted">${ uid }</span>
            </p>
        </li>
        `;
    });

    ulUsers.innerHTML = htmlUsers;


};

const displayMessages = ( messages = []) => {
  
    let htmlMsg = '';

    messages.forEach( ({ name, message }) => {

        htmlMsg += `
        <li>
            <p>
                <span class="text-primary">${ name }</span>
                <span>${ message }</span>
            </p>
        </li>
        `;
    });

    ulMessages.innerHTML = htmlMsg;

};

txtMessage.addEventListener('keyup', ( { keyCode } ) => {

    const message = txtMessage.value.trim();
    const uid = txtUid.value.trim();

    if (keyCode !== 13 || message.length === 0) {
        return;
    }

    socket.emit('send-message', { uid, message });
    txtMessage.value = '';
}) ;

const main = async() => {

    await validateJwt();
};

main();




