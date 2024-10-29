let Users = require('../model/Usuarios');
const pool = require('../database/mysql');
const bcrypt = require('bcrypt');


const UsuariosController = {
    async criar(req, res) {
        const { nome, email, senha, tipo_uuario, telefone } = req.body;

        //verificacao do email se existe
        // const sql_Select_existe = `SELECT * FROM usuarios WHERE email = ?`
        // const [result_existe] = await pool.query(sql_select_existe, [email])
        // console.log([result_existe])
        // if (result_existe[0]) {
        //     return res.status(401).json({ message: 'Erro a criar usuario, email ja cadastrado.' })
        // }

        // const salt = await bcrypt.genSalt(10);
        // const hashSenha = await bcrypt.hash(String(senha), salt)
        let sql = `INSERT INTO usuarios (nome, email, senha, tipo_usuario, telefone) values (?, ?, ?, ?, ?)`

        const result = await pool.query(slq, [nome, email, senha, tipo_uuario, telefone])
        const insertId = result[0]?.insertId;
        if (!insertId) {
            return res.status(401).json({ message: 'Erro ao criar usuario' })
        }
        const sql_select = `SELECT id_usuario, email FROM usuarios WHERE id_usuario = ?`
        const [rows] = await pool.query(sql_select, [insertId])
        return res.status(201).json(rows[0])

    },

    async listar(req, res) {
        let sql = 'SELECT * FROM usuarios';
        const [rows] = await pool.query(sql);

        return res.status(200).json(rows);
    },
}


module.exports = UsuariosController;