let feedbacks = require('../model/Feedbacks');
const pool = require('../database/mysql');
const { json } = require('express');

const FeedbacksController = {
    async criar(req, res) {
        const { id_servico_prestado, id_servico, id_servico_item, id_usuario, usuario_cliente, avaliacao, comentario, data_feedback } = req.body;

        let sql = `INSERT INTO feedbacks (id_servico_prestado, id_servico, id_servico_item, id_usuario, usuario_cliente, avaliacao, comentario, data_feedback) VALUES (?,?, ?,?, ?, ?, ?)`
        const result = await pool.query(sql, [id_servico_prestado, id_servico, id_servico_item, id_usuario, usuario_cliente, avaliacao, comentario, data_feedback])
        const insertId = result[0]?.insertId;
        if (!insertId) {
            return res.status(401).json({message: 'error ao criar feedback'})
        }

        const sql_select = `SELECT * FROM feedbacks WHERE id_feedback = ?`
        const [rows] = await pool.query(sql_select, [insertId])
        return res.status(201).json(rows[0])
    },

    async listar(req, res) {
        let sql = `SELECT * FROM feedbacks`;
        const [rows] = await pool.query(sql);

        return res.status(200).json(rows);
    },

    async deletar(req, res) {
        const paramId = req.params.id;
        let sql = `DELETE FROM feedbacks WHERE id_feedback = ?`
        const result = await pool.query(sql, [Number(paramId)])
        const affectedRows = result[0]?.affectedRows;
        if(!affectedRows)
        {
            return res.status(401).json({message: 'erro ao deletar feedback'})
        }
        return res.status(200).json({message: 'feedback deletado com sucesso'})
    }
}

module.exports = FeedbacksController;