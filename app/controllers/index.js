const moment = require('moment');

module.exports.index = function(application, req, res){
    res.render('index', { validacao: {} });
}

module.exports.cadastro = function(application, req, res){
    res.render('cadastro', { validacao: {} });
}

module.exports.autenticar = function(application, req, res){
    var dadosForm = req.body;

    req.assert('usuario', 'Usuário não deve ser vazio').notEmpty();
    req.assert('senha', 'Senha não deve ser vazia').notEmpty();

    var erros = req.validationErrors();

    if(erros){
        res.render("index", {validacao:erros});
        return;
    }

    const connMongoDB = application.config.dbConnection();
    const UsuariosDAO = new application.app.models.UsuariosDAO(connMongoDB);

    UsuariosDAO.autenticar(dadosForm, req)
        .then(() => {
            const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            const currentDateTime = moment().format('YYYY-MM-DD HH:mm:ss');
            console.log(`Sessão Iniciada - Data/Hora: ${currentDateTime}, IP: ${ip}`);

            res.redirect('/jogo');
        })
        .catch((err) => {
            console.error("Erro ao autenticar usuário:", err);
            res.render("index", {validacao: {}});
        });
}