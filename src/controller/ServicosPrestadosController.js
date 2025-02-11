const pool = require('../database/mysql');

const ServicosPrestadosController = {
    // Criar um novo serviço prestado
    criar: async (req, res) => {
        const { id_servico, id_servico_item, id_usuario, usuario_cliente, descr_servico } = req.body;

        try {
            const sql = `
                INSERT INTO Servicos_prestados 
                (id_servico, id_servico_item, id_usuario, usuario_cliente, descr_servico)
                VALUES (?, ?, ?, ?, ?)
            `;
            const [result] = await pool.query(sql, [
                id_servico,
                id_servico_item,
                id_usuario,
                usuario_cliente,
                descr_servico
            ]);

            if (result.affectedRows === 0) {
                return res.status(400).json({ message: 'Erro ao criar serviço prestado.' });
            }

            const novoServicoPrestadoId = result.insertId;
            const [rows] = await pool.query('SELECT * FROM Servicos_prestados WHERE id_servico_prestado = ?', [novoServicoPrestadoId]);
            return res.status(201).json(rows[0]);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro no servidor.', error });
        }
    },

    // Listar todos os serviços prestados
    listar: async (req, res) => {
        try {
            const sql = 'SELECT * FROM Servicos_prestados';
            const [rows] = await pool.query(sql);

            if (rows.length === 0) {
                return res.status(404).json({ message: 'Nenhum serviço prestado encontrado.' });
            }

            return res.status(200).json(rows);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro no servidor.', error });
        }
    },

    // Listar um serviço prestado específico
    listarServicoPrestado: async (req, res) => {
        const { id_servico_prestado } = req.params;

        try {
            const sql = 'SELECT * FROM Servicos_prestados WHERE id_servico_prestado = ?';
            const [rows] = await pool.query(sql, [id_servico_prestado]);

            if (rows.length === 0) {
                return res.status(404).json({ message: 'Serviço prestado não encontrado.' });
            }

            return res.status(200).json(rows[0]);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro no servidor.', error });
        }
    },

    // Atualizar um serviço prestado
    alterar: async (req, res) => {
        const { id_servico_prestado } = req.params;
        const { id_servico, id_servico_item, id_usuario, usuario_cliente, descr_servico } = req.body;

        try {
            const sql = `
                UPDATE Servicos_prestados 
                SET id_servico = ?, id_servico_item = ?, id_usuario = ?, usuario_cliente = ?, descr_servico = ?
                WHERE id_servico_prestado = ?
            `;
            const [result] = await pool.query(sql, [
                id_servico,
                id_servico_item,
                id_usuario,
                usuario_cliente,
                descr_servico,
                id_servico_prestado
            ]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Serviço prestado não encontrado.' });
            }

            const [rows] = await pool.query('SELECT * FROM Servicos_prestados WHERE id_servico_prestado = ?', [id_servico_prestado]);
            return res.status(200).json(rows[0]);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro no servidor.', error });
        }
    },

    // Deletar um serviço prestado
    deletar: async (req, res) => {
        const { id_servico_prestado } = req.params;

        try {
            const sql = 'DELETE FROM Servicos_prestados WHERE id_servico_prestado = ?';
            const [result] = await pool.query(sql, [id_servico_prestado]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Serviço prestado não encontrado.' });
            }

            return res.status(200).json({ message: 'Serviço prestado deletado com sucesso.' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro no servidor.', error });
        }
    }
};

module.exports = ServicosPrestadosController;