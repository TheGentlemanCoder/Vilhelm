const express = require('express');
const path = require('path');
var app = express();

app.get('/arp_poisoning', (req, res) => {
	res.sendFile(path.join(__dirname, '/html/arp_poisoning.html'));
});

app.get('/dns_poisoning', (req, res) => {
	res.sendFile(path.join(__dirname, '/html/dns_poisoning.html'));
});

app.get('/c2_server', (req, res) => {
	res.sendFile(path.join(__dirname, '/html/c2_server.html'));
});

app.get('/weak_tls', (req, res) => {
	res.sendFile(path.join(__dirname, '/html/weak_tls.html'));
});

app.get('/heat_map', (req, res) => {
	res.sendFile(path.join(__dirname, '/html/heat_map.html'));
});

app.get('/', (req, res) => {
	res.send("Hello world!");
});

app.listen(3000);
