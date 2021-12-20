const express = require('express');
const path = require('path');
const mariadb = require('mariadb');
const ejs = require('ejs');
var app = express();
var randomColor = require('./randomColor.js');
const {
    arp_poisoning_query,
    c2_server_query,
    dns_query_distribution_query,
    ip_address_distribution_query
} = require('./db/db.js');

app.set('view engine', 'ejs');

app.get('/arp_poisoning', async (req, res) => {
    mariadb_res = await arp_poisoning_query();

    if (mariadb_res.length > 0) {
        output = "ARP Poisoning Detected from " + toString(mariadb_res[0]['sender_mac'])
    } else {
        output = "No ARP Poisoning Detected"
    }

	res.render(path.join(__dirname, '/html/arp_poisoning.ejs'),
        {
            output: output  
        }
    );
});

app.get('/dns_queries', async (req, res) => {
    mariadb_res = await dns_query_distribution_query();

	res.render(path.join(__dirname, '/html/dns_query_distribution.ejs'), {
        output: mariadb_res,
        randomColor: randomColor
    });
});

app.get('/c2_server', async (req, res) => {
    mariadb_res = await c2_server_query();

    if (mariadb_res.length > 0) {
        output = "Outgoing connection to C2 Server detected: " + toString(mariadb_res[0]['ip_address']);
    } else {
        output = "No communication with C2 Server detected";
    }

    res.render(path.join(__dirname, '/html/c2_server.ejs'), {
        output: output
    });
});

app.get('/ip_address_distribution', async (req, res) => {
    mariadb_res = await ip_address_distribution_query();

	res.render(path.join(__dirname, '/html/ip_address_distribution.ejs'), {
        output: mariadb_res,
        randomColor: randomColor
    });
});

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '/html/index.html'));
});

app.listen(3000);
