const PATH_URL = '/dist/financial-control';
const express = require('express');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.static(__dirname + '/dist/financial-control'));

app.get('/*', (req, res) => {
    res.sendFile(__dirname + '/dist/financial-control/index.html')  
});

app.listen(PORT, () => {
    console.log('Servidor iniciado na porta:', PORT);
});