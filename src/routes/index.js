
const express = require('express');
const multer = require('multer');
const router = express.Router();
const crypto = require('crypto');
const UsuariosController = require('../controller/UsuariosController');
const CategoriaController = require('../controller/CategoriasController');
const FavoritosController = require('../controller/FavoritosController');
const authenticateJWT = require('../middleware/auth');




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

router.get('/users', authenticateJWT, UsuariosController.listar);
router.post('/users', UsuariosController.criar);;
router.put('/users/:id', authenticateJWT,  UsuariosController.alterar);
router.delete('/users/:id', authenticateJWT,  UsuariosController.deletar);
router.get('/users/:id', authenticateJWT,  UsuariosController.listarUsuario)

router.post('/login', UsuariosController.login);

router.get('/categorias', CategoriaController.listar);
router.post('/categorias', authenticateJWT,  CategoriaController.criar);
router.put('/categorias/:id', authenticateJWT,  CategoriaController.alterar);
router.delete('/categorias/:id', authenticateJWT,  CategoriaController.deletar);


router.post('/favoritos', authenticateJWT,  FavoritosController.criar);
router.get('/favoritos', authenticateJWT,  FavoritosController.listar);
router.delete('/favoritos/:id', authenticateJWT,  FavoritosController.deletar);


module.exports = router;
