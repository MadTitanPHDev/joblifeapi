
const express = require('express');
const multer = require('multer');
const router = express.Router();
const crypto = require('crypto');
const UsuariosController = require('../controller/UsuariosController');
const CategoriaController = require('../controller/CategoriasController');




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
router.post('/users', UsuariosController.criar);;
router.put('/users/:id', UsuariosController.alterar);
router.delete('/users/:id', UsuariosController.deletar);
router.get('/users/:id', UsuariosController.listarUsuario)

router.post('/login', UsuariosController.login);

router.get('/categorias', CategoriaController.listar);
router.post('/categorias', CategoriaController.criar);
router.put('/categorias/:id', CategoriaController.alterar);
router.delete('/categorias/:id', CategoriaController.deletar);



module.exports = router;
