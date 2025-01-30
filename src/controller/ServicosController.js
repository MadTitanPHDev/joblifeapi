let Servicos = require('../model/Servicos');
const pool = require('../database/mysql');

const ServicosController = {
    async criar(req, res) {
        try {
            const { id_profissional, nome_servico, descricao_servico, preco_min, preco_max, categoria } = req.body;

            const sql = `INSERT INTO servicos (id_profissional, nome_servico, descricao_servico, preco_min, preco_max, categoria) VALUES (?, ?, ?, ?, ?, ?)`;
            const result = await pool.query(sql, [id_profissional, nome_servico, descricao_servico, preco_min, preco_max, categoria]);

            const insertId = result[0]?.insertId;
            if (!insertId) {
                return res.status(400).json({ message: 'Erro ao criar serviço' });
            }

            const sql_select = `SELECT * FROM servicos WHERE id_servico = ?`;
            const [rows] = await pool.query(sql_select, [insertId]);

            return res.status(201).json(rows[0]);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro interno ao criar serviço' });
        }
    },

    async listar(req, res) {
        try {
            const sql = 'SELECT * FROM servicos';
            const [rows] = await pool.query(sql);

            return res.status(200).json(rows);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro ao listar serviços' });
        }
    },

    async listarServicos(req, res) {
        try {
            const paramId = req.params.id;
            const sql = "SELECT * FROM servicos WHERE id_servico = ?";
            const [rows] = await pool.query(sql, [paramId]);

            if (rows.length === 0) {
                return res.status(404).json({ message: 'Serviço não encontrado' });
            }

            return res.status(200).json(rows[0]);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro ao buscar serviço' });
        }
    },

    async alterar(req, res) {
        try {
            const paramId = req.params.id;
            const { id_profissional, nome_servico, descricao_servico, preco_min, preco_max, categoria } = req.body;

            const sql = "UPDATE servicos SET id_profissional = ?, nome_servico = ?, descricao_servico = ?, preco_min = ?, preco_max = ?, categoria = ? WHERE id_servico = ?";
            const result = await pool.query(sql, [id_profissional, nome_servico, descricao_servico, preco_min, preco_max, categoria, Number(paramId)]);
            const changedRows = result[0]?.affectedRows;

            if (!changedRows) {
                return res.status(404).json({ message: 'Serviço não encontrado para atualização' });
            }

            const sql_select = 'SELECT * FROM servicos WHERE id_servico = ?';
            const [rows] = await pool.query(sql_select, [paramId]);

            return res.status(200).json(rows[0]);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro ao alterar serviço' });
        }
    },

    async deletar(req, res) {
        try {
            const paramId = req.params.id;
            const sql = `DELETE FROM servicos WHERE id_servico = ?`;
            const result = await pool.query(sql, [Number(paramId)]);
            const affectedRows = result[0]?.affectedRows;

            if (!affectedRows) {
                return res.status(404).json({ message: "Serviço não encontrado para exclusão" });
            }
            return res.status(200).json({ message: "Serviço deletado com sucesso." });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro ao deletar serviço' });
        }
    }
};

module.exports = ServicosController;
