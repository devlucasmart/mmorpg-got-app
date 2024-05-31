const moment = require('moment');

module.exports.jogo = function(application, req, res){
    if(req.session.autorizado){
        res.render('jogo');
    } else {
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        const currentDateTime = moment().format('YYYY-MM-DD HH:mm:ss');
        console.log(`Acesso Não Autorizado - Data/Hora: ${currentDateTime}, IP: ${ip}`);
        
        res.render('nao_autorizado');
    }
}

module.exports.sair = function(application, req, res){
    req.session.destroy(function(err){
        res.render('index', {validacao:{}});
    });
}
