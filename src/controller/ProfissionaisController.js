let Profissionais = require('../model/Profissionais');
const pool = require('../database/mysql');
const bcrypt = require('bcrypt');

const ProfissionaisController = {
    async criar(req, res) {
        const { id_usuario, descricao, localizacao, preco, areas_atuacao} = req.body;
        const data_criacao = new Date(); // Definindo a data de criação no servidor

        // URL da imagem como um array JSON
        let imgUrl = 'http://localhost:3333/images/';
        if (req.file) {
            imgUrl += req.file.filename;
        }
        const fotos = JSON.stringify([imgUrl]); // Array JSON de URLs para coluna fotos

        const sql = `INSERT INTO profissionais (id_usuario, descricao, fotos, localizacao, preco, areas_atuacao, data_criacao) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const [result] = await pool.query(sql, [id_usuario, descricao, fotos, localizacao, preco, areas_atuacao, data_criacao]);

        const insertId = result.insertId;
        if (!insertId) {
            return res.status(401).json({ message: 'Erro ao criar profissional' });
        }

        const sql_select = 'SELECT * FROM profissionais WHERE id_profissional = ?';
        const [rows] = await pool.query(sql_select, [insertId]);

        return res.status(201).json(rows[0]);
    },

    async listar(req, res) {
        let sql = 'SELECT * FROM profissionais';
        const [rows] = await pool.query(sql);

        return res.status(200).json(rows);
    },

    async listarProfissional(req, res) {
        const paramId = req.params.id;
        let sql = "SELECT * FROM profissionais WHERE id_profissional = ?";
        const [rows] = await pool.query(sql, [paramId])

        return res.status(201).json(rows);
    },

    async alterar(req, res) {
        console.log(req.params)
        const paramId = req.params.id;

        const { descricao, localizacao, preco, areas_atuacao, id_usuario } = req.body;
        const data_criacao = new Date(); // Definindo a data de criação no servidor

        // URL da imagem como um array JSON
        let imgUrl = 'http://localhost:3333/images/';
        if (req.file) {
            imgUrl += req.file.filename;
        }
        const fotos = JSON.stringify([imgUrl]); // Array JSON de URLs para coluna fotos

        let sql = "UPDATE profissionais SET descricao = ?, fotos = ?, localizacao = ?, preco = ?, areas_atuacao = ?, data_criacao = ?, id_usuario = ? WHERE id_profissional = ?"
        const result = await pool.query(sql, [descricao, fotos, localizacao, preco, areas_atuacao, data_criacao, id_usuario, Number(paramId)])
       
        console.log(result)
        const changedRows = result[0]?.affectedRows;
        if(!changedRows){
            return res.status(401).json({message: 'Erro ao alterar profissional.'})
        }

        const sql_select = 'SELECT * FROM profissionais WHERE id_profissional = ?'
        const [rows] = await pool.query(sql_select, [paramId])

        return res.status(201).json(rows[0]);
    },

    async deletar(req, res){
        const paramId = req.params.id;
        let sql = `DELETE FROM profissionais WHERE id_profissional = ?`
        const result = await pool.query(sql, [Number(paramId)])
        const affectedRows = result[0]?.affectedRows;
        if(!affectedRows)
        {
            return res.status(401).json({message: "Erro ao deletar profissional."})
        }
        return res.status(200).json({message: "Profissional deletado com sucesso."})
    },
};

module.exports = ProfissionaisController;
