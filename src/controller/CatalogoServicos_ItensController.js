const pool = require('../database/mysql');
const multer = require('multer');
const crypto = require('crypto');

// Configuração do Multer para upload de arquivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/');
    },
    filename: (req, file, cb) => {
        const extensaoArquivo = file.originalname.split('.')[1];
        const novoNomeArquivo = crypto.randomBytes(16).toString('hex');
        cb(null, `${novoNomeArquivo}.${extensaoArquivo}`);
    }
});

const upload = multer({ storage });

const CatalogoServicos_ItensController = {
    // Criar um novo item no catálogo de serviços
    criar: async (req, res) => {
        const { id_servico, id_usuario, categoria, descricao_servico_item, area_atuacao, preco_min } = req.body;
        let foto_Servico_item = '';

        if (req.file) {
            foto_Servico_item = req.file.filename;
        }

        try {
            const sql = `
                INSERT INTO CatalogoServicos_Itens 
                (id_servico, id_usuario, categoria, descricao_servico_item, foto_Servico_item, area_atuacao, preco_min)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;
            const [result] = await pool.query(sql, [
                id_servico,
                id_usuario,
                categoria,
                descricao_servico_item,
                foto_Servico_item,
                area_atuacao,
                preco_min
            ]);

            if (result.affectedRows === 0) {
                return res.status(400).json({ message: 'Erro ao criar item no catálogo.' });
            }

            const novoItemId = result.insertId;
            const [rows] = await pool.query('SELECT * FROM CatalogoServicos_Itens WHERE id_servico_item = ?', [novoItemId]);
            return res.status(201).json(rows[0]);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro no servidor.', error });
        }
    },

    // Listar todos os itens de um serviço
    listar: async (req, res) => {
        const { id_servico } = req.params;

        try {
            const sql = 'SELECT * FROM CatalogoServicos_Itens WHERE id_servico = ?';
            const [rows] = await pool.query(sql, [id_servico]);

            if (rows.length === 0) {
                return res.status(404).json({ message: 'Nenhum item encontrado para este serviço.' });
            }

            return res.status(200).json(rows);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro no servidor.', error });
        }
    },

    // Listar um item específico
    listarItem: async (req, res) => {
        const { id_servico_item } = req.params;

        try {
            const sql = 'SELECT * FROM CatalogoServicos_Itens WHERE id_servico_item = ?';
            const [rows] = await pool.query(sql, [id_servico_item]);

            if (rows.length === 0) {
                return res.status(404).json({ message: 'Item não encontrado.' });
            }

            return res.status(200).json(rows[0]);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro no servidor.', error });
        }
    },

    // Atualizar um item
    alterar: async (req, res) => {
        const { id_servico_item } = req.params;
        const { id_servico, id_usuario, categoria, descricao_servico_item, area_atuacao, preco_min } = req.body;
        let foto_Servico_item = '';

        if (req.file) {
            foto_Servico_item = req.file.filename;
        }

        try {
            const sql = `
                UPDATE CatalogoServicos_Itens 
                SET id_servico = ?, id_usuario = ?, categoria = ?, descricao_servico_item = ?, 
                    foto_Servico_item = ?, area_atuacao = ?, preco_min = ?
                WHERE id_servico_item = ?
            `;
            const [result] = await pool.query(sql, [
                id_servico,
                id_usuario,
                categoria,
                descricao_servico_item,
                foto_Servico_item,
                area_atuacao,
                preco_min,
                id_servico_item
            ]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Item não encontrado.' });
            }

            const [rows] = await pool.query('SELECT * FROM CatalogoServicos_Itens WHERE id_servico_item = ?', [id_servico_item]);
            return res.status(200).json(rows[0]);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro no servidor.', error });
        }
    },

    // Deletar um item
    deletar: async (req, res) => {
        const { id_servico_item } = req.params;

        try {
            const sql = 'DELETE FROM CatalogoServicos_Itens WHERE id_servico_item = ?';
            const [result] = await pool.query(sql, [id_servico_item]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Item não encontrado.' });
            }

            return res.status(200).json({ message: 'Item deletado com sucesso.' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro no servidor.', error });
        }
    },

    // listarItem2: async (req, res) => {

    //     try {
    //         const sql = 'Select CatalogoServicos_Itens.*, Usuarios.nome, Usuarios.telefone FROM CatalogoServicos_Itens, Usuarios WHERE CatalogoServicos_Itens.categoria = 1 AND CatalogoServicos_Itens.id_usuario = Usuarios.id_usuario;'
    //         const [result] = await pool.query(sql, [req.params.categoria]);

    //         if (result.length === 0) {
    //             return res.status(404).json({ message: 'Item não encontrado.' });
    //             const [rows] = await pool.query(sql, [categoria]);
         
    //         }
    //         return res.status(200).json(rows[0]);
    //     } catch (error) {
    //         console.error(error);
    //         return res.status(500).json({ message: 'Erro no servidor.', error });
    //     }
    // },

    listarItem2: async (req, res) => {
        const { categoria } = req.params; // Extrai o parâmetro da rota

        try {
            const sql = `
                SELECT CatalogoServicos_Itens.*, Usuarios.nome, Usuarios.telefone 
                FROM CatalogoServicos_Itens
                INNER JOIN Usuarios ON CatalogoServicos_Itens.id_usuario = Usuarios.id_usuario
                WHERE CatalogoServicos_Itens.categoria = ?;
            `;
            const [rows] = await pool.query(sql, [categoria]);

            if (rows.length === 0) {
                return res.status(404).json({ message: 'Nenhum item encontrado para esta categoria.' });
            }

            return res.status(200).json(rows); // Retorna todos os itens encontrados
        } catch (error) {
            console.error('Erro no servidor:', error);
            return res.status(500).json({ message: 'Erro no servidor.', error });
        }
    },

};

module.exports = CatalogoServicos_ItensController;