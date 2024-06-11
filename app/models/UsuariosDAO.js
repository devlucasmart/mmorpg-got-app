const crypto = require('crypto');
function UsuariosDAO(connection) {
    this._connection = connection;
}

UsuariosDAO.prototype.inserirUsuario = function(usuario) {
    return this._connection.then(db => {
        const collection = db.collection('usuarios');

        const hashedPassword = crypto.createHash('md5').update(usuario.senha).digest('hex');
        // Substituir a senha original pela senha criptografada
        usuario.senha = hashedPassword;

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

UsuariosDAO.prototype.autenticar = function(usuario, req) {
  return this._connection.then(db => {
    const collection = db.collection('usuarios');

    const hashedPassword = crypto.createHash('md5').update(usuario.senha).digest('hex');
        // Substituir a senha original pela senha criptografada
    usuario.senha = hashedPassword;
        
    return collection.find(usuario).toArray()
      .then(result => {
        
        if (result.length === 0) {
          console.log(result);
          throw new Error("Usuário não encontrado");
        } else if(result[0] != undefined){
          req.session.autorizado = true;
          req.session.usuario = result[0].usuario;
          req.session.casa = result[0].casa;
        }
        console.log(result);
        return result;
      })
      .catch(err => {
        console.error("Error connecting to database:", err);
        throw err;
      });
  });
}


module.exports = function() {
    return UsuariosDAO;
};