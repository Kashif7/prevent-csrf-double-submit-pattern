const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    uuid = require('uuid/v1'),
    crypto = require('crypto');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));

const tokenMap = new Map();
let sessionId;
let token;



app.get('/', (request, response) => {
    response.sendFile(`${__dirname}/login.html`);
});

app.get('/home', (request, response) => {
    response.sendFile(`${__dirname}/home.html`);
});

app.post('/login', (request, response) => {
    crypto.randomBytes(48, (err, buffer) => {
        sessionId = uuid();
        token = buffer.toString('hex');
        response.cookie('__user', JSON.stringify({uuid: sessionId, csrf_token: token}));

        response.send({
            'message': 'success'
        });
    });
});

app.post('/postWithCsrf', (request, response) => {
    console.log(JSON.parse(request.cookies.__user).uuid, 'user', JSON.parse(request.cookies.__user).csrf_token);
   if (request.body.csrf_token === JSON.parse(request.cookies.__user).csrf_token) {
    response.send({
        'message': 'success'
    });
   } else {
    response.send({
        'error': 'csrf token does not match'
    });
   }
});

app.get('/csrf', (request, response) => {
    crypto.randomBytes(48, (err, buffer) => {
        token = buffer.toString('hex');
        tokenMap.set(sessionId, token);

        response.send({
            'token': token
        });
    });
});
app.listen(3000, (err) => {
    if (err) {
        console.error('an error occured', err);
        return;
    }

    console.log('the app is running on port 3000');
});

