const { suppressDeprecationWarnings } = require("moment");
const { ObjectId } = require('mongodb');

function JogoDAO(connection) {
    this._connection = connection;
}

JogoDAO.prototype.gerarParametros = function(usuario){
    return this._connection.then(db => {
        const collection = db.collection('jogo');
        return collection.insertOne({
            usuario: usuario,
            moeda: 15,
            suditos: 10,
            temor: Math.floor(Math.random() * 1000), 
            sabedoria: Math.floor(Math.random() * 1000), 
            comercio: Math.floor(Math.random() * 1000), 
            magia: Math.floor(Math.random() * 1000)
        });
    }).catch(err => {
        console.error("Erro ao conectar ao banco de dados:", err);
        throw err;
    });
}

JogoDAO.prototype.iniciaJogo = function(res, usuario, casa, msg){
    return this._connection.then(db => {
        const collection = db.collection('jogo');
        return collection.find({usuario : usuario}).toArray()
          .then(result => {
            console.log(result);
             res.render('jogo', { img_casa: casa, jogo: result[0], msg: msg});
          })
          .catch(err => {
            console.error("Error connecting to database:", err);
            throw err;
          });
      });
}

JogoDAO.prototype.acao = function(acao){
    return this._connection.then(db => {
        var collection = db.collection('acao');

        var date = new Date();
        var tempo = null;

        switch(acao.acao){
            case '1': tempo = 1 * 60 * 60000; break;
            case '2': tempo = 2 * 60 * 60000; break;
            case '3': tempo = 5 * 60 * 60000; break;
            case '4': tempo = 5 * 60 * 60000; break;
        }

        acao.acao_termina_em = date.getTime() + tempo;

        collection.insertOne(acao).catch(err => {
            console.error("Erro ao inserir documento:", err);
            throw err;
        });

        collection = db.collection('jogo');

        var moedas = null;

        switch(acao.acao){
            case '1': moedas = -2 * acao.quantidade; break;
            case '2': moedas = -3 * acao.quantidade; break;
            case '3': moedas = -1 * acao.quantidade; break;
            case '4': moedas = -1 * acao.quantidade; break;
        }

        collection.updateOne(
                        {usuario: acao.usuario},
                        {$inc: {moeda: moedas}}).catch(err => {console.error("Erro ao atualizar documento:", err);
                        throw err;
                    });

    }).catch(err => {
        console.error("Erro ao conectar ao banco de dados:", err);
        throw err;
    });
}

JogoDAO.prototype.getAcoes = function(usuario, res){
    return this._connection.then(db => {
        
        var date = new Date();
        var momento_atual = date.getTime();

        const collection = db.collection('acao');
        return collection.find({usuario : usuario, acao_termina_em: {$gt : momento_atual}}).toArray()
          .then(result => {
            console.log(result);

            res.render('pergaminhos', {acoes : result});
          })
          .catch(err => {
            console.error("Error connecting to database:", err);
            throw err;
          });
      });
}

JogoDAO.prototype.revogarAcao = function(_id, res) {
    return this._connection.then(db => {
        const collection = db.collection('acao');
        return collection.deleteOne({ _id: new ObjectId(_id) })
        .then(() => {
            res.redirect("jogo?msg=D")
          })
    }).catch(err => {
        console.error("Error connecting to database:", err);
        throw err;
    });
}


module.exports = function() {
    return JogoDAO;
};