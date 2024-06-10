const moment = require('moment');

module.exports.jogo = function(application, req, res){
    const session = req.session;
    
    // Verifica se o usuário está autorizado
    if(!session.autorizado){
        logAcessoNaoAutorizado(req);
        return res.render('nao_autorizado');
    }
    
    var msg = '';
    if(req.query.msg != '') {
        msg = req.query.msg;
    }

    // Obtém informações do usuário e da casa da sessão
    const usuario = session.usuario;
    const casa = session.casa;

    // Inicia o jogo
    const connMongoDB = application.config.dbConnection();
    const JogoDAO = new application.app.models.JogoDAO(connMongoDB);
    JogoDAO.iniciaJogo(res, usuario, casa, msg);
}

function logAcessoNaoAutorizado(req) {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const currentDateTime = moment().format('YYYY-MM-DD HH:mm:ss');
    console.log(`Acesso Não Autorizado - Data/Hora: ${currentDateTime}, IP: ${ip}`);
}

module.exports.sair = function(application, req, res){
    req.session.destroy(function(err){
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const currentDateTime = moment().format('YYYY-MM-DD HH:mm:ss');
        console.log(`Sessão Finalizada - Data/Hora: ${currentDateTime}, IP: ${ip}`);

        res.render('index', {validacao:{}});
    });
}

module.exports.suditos = function(application, req, res){
    const session = req.session;

    if(!session.autorizado){
        logAcessoNaoAutorizado(req);
        return res.render('nao_autorizado');
    }
    res.render('aldeoes', {validacao:{}});
}

module.exports.pergaminhos = function(application, req, res){
    const session = req.session;

    if(!session.autorizado){
        logAcessoNaoAutorizado(req);
        return res.render('nao_autorizado');
    }

    const connMongoDB = application.config.dbConnection();
    const JogoDAO = new application.app.models.JogoDAO(connMongoDB);
    const usuario = session.usuario;

    JogoDAO.getAcoes(usuario, res);
}

module.exports.ordernar_acao_sudito = function(application, req, res){
    const session = req.session;
    
    if(!session.autorizado){
        logAcessoNaoAutorizado(req);
        return res.render('nao_autorizado');
    }

    var dadosForm = req.body;

    req.assert('acao', 'Ação deve ser informada').notEmpty();
    req.assert('quantidade', 'Quantidade deve ser informada').notEmpty();

    var erros = req.validationErrors();

    if(erros){
        res.redirect('jogo?msg=A');
        return;
    }

    const connMongoDB = application.config.dbConnection();
    const JogoDAO = new application.app.models.JogoDAO(connMongoDB);

    dadosForm.usuario = req.session.usuario;
    JogoDAO.acao(dadosForm);

    res.redirect('jogo?msg=B');
}

module.exports.revogar_acao = function(application, req, res){
    var url_query = req.query;

    const connMongoDB = application.config.dbConnection();
    const JogoDAO = new application.app.models.JogoDAO(connMongoDB);

    var _id = url_query.id_acao;

    JogoDAO.revogarAcao(_id, res);
}
