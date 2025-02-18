const express = require('express');
const multer = require('multer');
const router = express.Router();
const crypto = require('crypto');
const authenticateJWT = require('../middleware/auth');

const UsuariosController = require('../controller/UsuariosController');
const ProfissionaisController = require('../controller/ProfissionaisController');
const ServicosController = require('../controller/ServicosController');
const CategoriaController = require('../controller/CategoriasController');
const FavoritosController = require('../controller/FavoritosController');

// const ServicosPrestadosController = require('../controller/ServicosPrestadosController');
const FeedbacksController = require('../controller/FeedbacksController');
const CatalogoServicosController = require('../controller/CatalogoServicosController')
const CatalogoServicos_ItensController = require('../controller/CatalogoServicos_ItensController');
const ServicosPrestadosController = require('../controller/ServicosPrestadosController');


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

router.post('/users', upload.single('imagem'), UsuariosController.criar);
// router.put('/users/:id', authenticateJWT, upload.single('imagem'), UsuariosController.alterar);
router.put('/users/atualizar-status', authenticateJWT,  UsuariosController.atualizarStatus);
router.delete('/users/:id', authenticateJWT,  UsuariosController.deletar);
router.get('/users/:id', authenticateJWT,  UsuariosController.listarUsuario);

router.post('/login', UsuariosController.login);

router.get('/servicos', authenticateJWT, ServicosPrestadosController.listar);
router.post('/servicos', ServicosPrestadosController.criar);;
router.put('/servicos/:id', authenticateJWT,  ServicosPrestadosController.alterar);
router.delete('/servicos/:id', authenticateJWT,  ServicosPrestadosController.deletar);
router.get('/servicos/:id', authenticateJWT,  ServicosPrestadosController.listarServicoPrestado)

router.get('/feedbacks', authenticateJWT, FeedbacksController.listar);
router.post('/feedbacks', FeedbacksController.criar);;
router.delete('/feedbacks/:id', authenticateJWT,  FeedbacksController.deletar);

router.post('/favoritos', authenticateJWT,  FavoritosController.criar);
router.get('/favoritos', authenticateJWT,  FavoritosController.listar);
router.delete('/favoritos/:id', authenticateJWT,  FavoritosController.deletar);

router.get('/categorias', CategoriaController.listar);
router.post('/categorias',  CategoriaController.criar);
router.put('/categorias/:id', authenticateJWT,  CategoriaController.alterar);
router.delete('/categorias/:id', authenticateJWT,  CategoriaController.deletar);
router.get('/categorias/:id', authenticateJWT,  CategoriaController.listarCategoria);

router.post('/catalogoServicos', upload.single('imagem'), CatalogoServicosController.criar )
// router.get('/catalogoServicos', CatalogoServicosController.listar);
router.get('/catalogoServicos', CatalogoServicosController.listarTodos);
router.delete('/catalogoServicos/:id', authenticateJWT,  CatalogoServicosController.deletar);
router.get('/catalogoServicos/:id', authenticateJWT,  CatalogoServicosController.listarServico)

// Rotas para CatalogoServicos_Itens
router.post('/catalogoServicosItens', upload.single('foto_servico_item'), CatalogoServicos_ItensController.criar);
// router.get('/catalogoServicosItens/:id_servico', CatalogoServicos_ItensController.listar);
// router.get('/catalogoServicosItens/item/:id_servico_item', CatalogoServicos_ItensController.listarItem);
router.put('/catalogoServicosItens/:id_servico_item', upload.single('foto_servico_item'), CatalogoServicos_ItensController.alterar);
router.delete('/catalogoServicosItens/:id_servico_item', CatalogoServicos_ItensController.deletar);

router.get('/catalogoServicosItens/:categoria', CatalogoServicos_ItensController.listarItem2);



// router.post('/servicos', ServicosController.criar);
// router.get('/servicos', ServicosController.listar);
// router.put('/servicos/:id', ServicosController.alterar);
// router.delete('/servicos/:id', ServicosController.deletar);
// router.get('/servicos/:id', ServicosController.listarServicos);

module.exports = router;