const express = require('express');
const dotenv = require('dotenv');
const rotas = require('./routes');
const path = require('path');
const cors = require('cors');

dotenv.config();

const server = express();
server.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'UPDATE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
server.use(express.static(path.join(__dirname, '../public')))
server.use(express.urlencoded({extended: true}));
server.use(express.json());

server.use(rotas);

server.use((req, res) => {
    res.send('Rota não encontrada')
})

server.listen(process.env.PORT || 3333)

// const express = require('express');
// const dotenv = require('dotenv');
// const rotas = require('./routes');
// const path = require('path');
// const cors = require('cors');
// const multer = require('multer');

// dotenv.config();

// const server = express();

// // 📌 Configuração do CORS (permite todas as origens, pode ser ajustado conforme necessário)
// server.use(cors({
//     origin: '*',  // Alterar para um domínio específico em produção
//     methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
//     allowedHeaders: ['Content-Type', 'Authorization']
// }));

// // 📌 Middleware para servir arquivos estáticos
// server.use(express.static(path.join(__dirname, '../public')));

// // 📌 Middleware para processar JSON e dados de formulários
// server.use(express.json());  // Processa JSON corretamente
// server.use(express.urlencoded({ extended: true }));  // Suporte a dados codificados em URL

// // 📌 Middleware para uploads (caso precise armazenar arquivos)
// const upload = multer({ dest: 'public/images/' });
// // server.use(upload.single('imagem')); // Middleware para processar uploads de imagens

// // 📌 Importa e usa as rotas
// server.use(rotas);

// // 📌 Middleware de erro 404 para rotas não encontradas
// server.use((req, res) => {
//     res.status(404).json({ error: 'Rota não encontrada' });
// });

// // 📌 Middleware para capturar erros gerais
// server.use((err, req, res, next) => {
//     console.error('Erro no servidor:', err);
//     res.status(500).json({ error: 'Erro interno do servidor' });
// });

// // 📌 Inicializa o servidor na porta especificada no .env ou na 3333
// const PORT = process.env.PORT || 3333;
// server.listen(PORT, () => {
//     console.log(`🔥 Servidor rodando na porta ${PORT}`);
// });
