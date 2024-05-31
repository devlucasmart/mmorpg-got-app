const { MongoClient } = require('mongodb');

const connMongoDB = async function() {
    console.log('Entrou na função de conexão');
    const client = new MongoClient('mongodb://localhost:27017');

    try {
        await client.connect();
        console.log('Conectado ao MongoDB');
        const db = client.db('got');
        return db;
    } catch (err) {
        console.error('Erro ao conectar ao MongoDB:', err);
        throw err;
    }
};

module.exports = function() {
    return connMongoDB;
};
