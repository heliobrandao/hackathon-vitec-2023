const sql = require('mssql');

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: 'dbhackathon.database.windows.net',
    database: 'hack',
    port: 1433,
    options: {
        encrypt: true,
        rowCollectionOnDone: true,
        rowCollectionOnRequestCompletion: true,
    },
};

async function connect() {
    try {
        await sql.connect(config);
        return sql;
    } catch (error) {
        console.error('Erro ao conectar ao banco de dados:', error);
        throw error;
    }
}

module.exports = {
    connect,
};
