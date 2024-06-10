module.exports.cadastro = function(application, req, res) {
    res.render('cadastro', { validacao: {}, dadosForm: {} });
};

module.exports.cadastrar = function(application, req, res) {
    const dadosForm = req.body;
    console.log(dadosForm);

    req.assert('nome', 'Nome não pode ser vazio').notEmpty();
    req.assert('usuario', 'Usuário não pode ser vazio').notEmpty();
    req.assert('senha', 'Senha não pode ser vazia').notEmpty();
    req.assert('casa', 'Casa não pode ser vazia').notEmpty();

    const erros = req.validationErrors();

    if (erros) {
        res.render('cadastro', { validacao: erros, dadosForm: dadosForm });
        return;
    }

    const connMongoDB = application.config.dbConnection();
    const UsuariosDAO = new application.app.models.UsuariosDAO(connMongoDB);
    const JogoDAO = new application.app.models.JogoDAO(connMongoDB);

    UsuariosDAO.inserirUsuario(dadosForm)
        .then(() => {
            //geração dos parametros
            res.send('Cadastro realizado com sucesso');
        })
        .catch((err) => {
            console.error("Erro ao cadastrar usuário:", err);
            res.status(500).send('Erro ao cadastrar usuário');
        });
    JogoDAO.gerarParametros(dadosForm.usuario);
};
