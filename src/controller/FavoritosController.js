let favoritos = require('../model/Favoritos');
const pool = require('../database/mysql');
const { json } = require('express');

const FavoritosController = {
    async criar(req, res) {
        const { id_usuario } = req.body;

        let sql = `INSERT INTO Favoritos (id_usuario) VALUES (?)`
        const result = await pool.query(sql, [id_cliente, id_profissional])
        const insertId = result[0]?.insertId;
        if (!insertId) {
            return res.status(401).json({message: 'error ao criar favorito'})
        }

        const sql_select = `SELECT * FROM Favoritos WHERE id_favorito = ?`
        const [rows] = await pool.query(sql_select, [insertId])
        return res.status(201).json(rows[0])
    },

    async listar(req, res) {
        let sql = `SELECT * FROM Favoritos`;
        const [rows] = await pool.query(sql);

        return res.status(200).json(rows);
    },

    async listarFavorito(req, res) {

    },

    async alterar(req, res) {

    },

    async deletar(req, res) {
        const paramId = req.params.id;
        let sql = `DELETE FROM Favoritos WHERE id_favorito = ?`
        const result = await pool.query(sql, [Number(paramId)])
        const affectedRows = result[0]?.affectedRows;
        if(!affectedRows)
        {
            return res.status(401).json({message: 'erro ao deletar favorito'})
        }
        return res.status(200).json({message: 'favorito deletado com sucesso'})
    }
}

module.exports = FavoritosController;