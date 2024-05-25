function UsuariosDAO(connection) {
    this._connection = connection;
}

UsuariosDAO.prototype.inserirUsuario = function(usuario) {
    return this._connection.then(db => {
        const collection = db.collection('usuarios');
        return collection.insertOne(usuario)
            .then(result => {
                console.log("Usuário salvo com sucesso:", result);
                return result;
            })
            .catch(err => {
                console.error("Erro ao inserir o usuário:", err);
                throw err;
            });
    }).catch(err => {
        console.error("Erro ao conectar ao banco de dados:", err);
        throw err;
    });
};

module.exports = function() {
    return UsuariosDAO;
};