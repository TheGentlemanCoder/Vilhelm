const mariadb = require('mariadb');

const pool = mariadb.createPool({
    host: 'localhost',
    database: 'final_project_mariadb',
    user: 'root',
    password: 'password',
    connectionLimit: 5
});

async function arp_poisoning_query() {
    query = "SELECT DISTINCT ah1.sender_mac " + 
            "FROM ARPHeader ah1 JOIN ARPHeader ah2 ON (ah1.sender_mac = ah2.sender_mac) " +
            "WHERE ah1.target_ip != ah2.target_ip AND " +
            "ah1.sender_ip != ah2.sender_ip " +
            "AND ah1.opcode = 2 " +
            "AND ah2.opcode = 2;"

    return pool.getConnection()
        .then(async (conn) => {
            return await conn.query(query)
                .then((rows) => {
                    conn.end();
                    return rows;
                })
                .catch(err => {
                    console.log(err);
                    conn.end();
                })
        })
        .catch(err => {
            console.log("Error: Not connected to the database");
    });
}

async function c2_server_query() {
    query = "SELECT DISTINCT ip_address " +
            "FROM IPAddress ip JOIN C2Server c2 USING (ip_address);"

    return pool.getConnection()
        .then(async (conn) => {
            return await conn.query(query)
                .then((rows) => {
                    conn.end();
                    return rows;
                })
                .catch(err => {
                    console.log(err);
                    conn.end();
                })
        })
        .catch(err => {
            console.log("Error: Not connected to the database");
    });
}

async function dns_query_distribution_query() {
    query = "SELECT dns.hostname_tld, (100 * COUNT(*) / sq.total_tlds) as percentage " +
            "FROM DNSHeader dns, (SELECT COUNT( * ) as total_tlds FROM DNSHeader) as sq " +
            "GROUP BY dns.hostname_tld " +
            "ORDER BY percentage DESC;"

    return pool.getConnection()
        .then(async (conn) => {
            return await conn.query(query)
                .then((rows) => {
                    conn.end();
                    return rows;
                })
                .catch(err => {
                    console.log(err);
                    conn.end();
                })
        })
        .catch(err => {
            console.log("Error: Not connected to the database");
    });
}

async function ip_address_distribution_query() {
    query = "SELECT c.country_name, (100 * COUNT(*) / sq.total_traffic) as percentage " +
            "FROM IPv4Header ipv4 JOIN IPAddress ip ON (ip.ip_address = ipv4.source_ip) JOIN Country c USING (country), " +
            "(SELECT COUNT( * ) as total_traffic" +
            " FROM IPv4Header) as sq " +
            "GROUP BY ip.country " +
            "ORDER BY percentage DESC;"
    
    return pool.getConnection()
        .then(async (conn) => {
            return await conn.query(query)
                .then((rows) => {
                    conn.end();
                    return rows;
                })
                .catch(err => {
                    console.log(err);
                    conn.end();
                })
        })
        .catch(err => {
            console.log("Error: Not connected to the database");
    });
}

module.exports = {
    arp_poisoning_query: arp_poisoning_query,
    c2_server_query: c2_server_query,
    dns_query_distribution_query: dns_query_distribution_query,
    ip_address_distribution_query: ip_address_distribution_query
}