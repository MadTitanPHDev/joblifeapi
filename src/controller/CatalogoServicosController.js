const pool = require('../database/mysql');

const CatalogoServicosController = {
    async criar(req, res) {
        const { id_usuario, nome_servico, descricao_servico } = req.body;

        let imgUrl = '';
        if (req.file) {
            imgUrl = `${req.file.filename}`;
        }

        let sql = `INSERT INTO CatalogoServicos (id_usuario, nome_servico, descricao_servico, foto_servico) VALUES (?, ?, ?, ?)`;

        const result = await pool.query(sql, [id_usuario, nome_servico, descricao_servico, imgUrl]);
        const insertId = result[0]?.insertId;
        if (!insertId) {
            return res.status(401).json({ message: 'Erro ao criar serviço.' });
        }

        const sql_select = `SELECT id_servico, nome_servico, descricao_servico, foto_servico FROM CatalogoServicos WHERE id_servico = ?`;
        const [rows] = await pool.query(sql_select, [insertId]);
        return res.status(201).json(rows[0]);
    },

    async listar(req, res) {
        let sql = "SELECT * FROM CatalogoServicos WHERE id_usuario = ?";
        const [rows] = await pool.query(sql, [req.userId]);

        return res.status(201).json(rows);
    },

    async listarServico(req, res) {
        const paramId = req.params.id;
        let sql = "SELECT * FROM CatalogoServicos WHERE id_servico = ?";
        const [rows] = await pool.query(sql, [paramId]);

        return res.status(201).json(rows);
    },

    async alterar(req, res) {
        const paramId = req.params.id;
        const { nome_servico, descricao_servico } = req.body;

        let imgUrl = 'http://localhost:3333/images';
        if (req.file) {
            imgUrl = imgUrl + `${req.file.filename}`;
        }

        let sql = "UPDATE CatalogoServicos SET nome_servico = ?, descricao_servico = ?, foto_servico = ? WHERE id_servico = ?";
        const result = await pool.query(sql, [nome_servico, descricao_servico, imgUrl, Number(paramId)]);

        const changedRows = result[0]?.affectedRows;
        if (!changedRows) {
            return res.status(401).json({ message: 'Erro ao alterar serviço.' });
        }

        const sql_select = 'SELECT * FROM CatalogoServicos WHERE id_servico = ?';
        const [rows] = await pool.query(sql_select, [paramId]);

        return res.status(201).json(rows[0]);
    },

    async deletar(req, res) {
        const paramId = req.params.id;
        let sql = `DELETE FROM CatalogoServicos WHERE id_servico = ?`;
        const result = await pool.query(sql, [Number(paramId)]);
        const affectedRows = result[0]?.affectedRows;
        if (!affectedRows) {
            return res.status(401).json({ message: "Erro ao deletar serviço." });
        }
        return res.status(200).json({ message: "Serviço deletado com sucesso." });
    }
};

module.exports = CatalogoServicosController;