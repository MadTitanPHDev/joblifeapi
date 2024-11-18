const express = require('express');
const multer = require('multer');
const router = express.Router();
const crypto = require('crypto');
const UsuariosController = require('../controller/UsuariosController');
const ProfissionaisController = require('../controller/ProfissionaisController');
const ServicosController = require('../controller/ServicosController');
const CategoriaController = require('../controller/CategoriasController');
const FavoritosController = require('../controller/FavoritosController');



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/')
    },
    filename: (req, file, cb) => {
        const extensaoArquivo = file.originalname.split('.')[1]
        const novoNomeArquivo = crypto.randomBytes(16).toString('hex');
        cb(null, `${novoNomeArquivo}.${extensaoArquivo}`);
    }
})

const upload = multer({storage});

router.get('/users', UsuariosController.listar);


router.post('/profissionais', ProfissionaisController.criar);
router.get('/profissionais', ProfissionaisController.listar);
router.put('/profissionais/:id', ProfissionaisController.alterar);
router.delete('/profissionais/:id', ProfissionaisController.deletar);
router.get('/profissionais/:id', ProfissionaisController.listarProfissional);
=======
router.post('/users', UsuariosController.criar);;
router.put('/users/:id', UsuariosController.alterar);
router.delete('/users/:id', UsuariosController.deletar);
router.get('/users/:id', UsuariosController.listarUsuario)

router.post('/login', UsuariosController.login);

router.get('/categorias', CategoriaController.listar);
router.post('/categorias', CategoriaController.criar);
router.put('/categorias/:id', CategoriaController.alterar);
router.delete('/categorias/:id', CategoriaController.deletar);


router.post('/favoritos', FavoritosController.criar);
router.get('/favoritos', FavoritosController.listar);
router.delete('/favoritos/:id', FavoritosController.deletar);


router.post('/servicos', ServicosController.criar);
router.get('/servicos', ServicosController.listar);
router.put('/servicos/:id', ServicosController.alterar);
router.delete('/servicos/:id', ServicosController.deletar);
router.get('/servicos/:id', ServicosController.listarServicos);

module.exports = router;