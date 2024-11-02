let Users = require('../model/Usuarios');
const pool = require('../database/mysql');
const bcrypt = require('bcrypt');


const UsuariosController = {
    async criar(req, res) {
        const { nome, email, senha, tipo_usuario, telefone } = req.body;

        //verificacao do email se existe
        const sql_Select_existe = `SELECT * FROM usuarios WHERE email = ?`
        const [result_existe] = await pool.query(sql_Select_existe, [email])
        console.log([result_existe])
        if (result_existe[0]) {
            return res.status(401).json({ message: 'Erro a criar usuario, email ja cadastrado.' })
        }

        const salt = await bcrypt.genSalt(10);
        const hashSenha = await bcrypt.hash(String(senha), salt)
        console.log(hashSenha)
        let sql = `INSERT INTO usuarios (nome, email, senha, tipo_usuario, telefone) VALUES (?, ?, ?, ?, ?)`

        const result = await pool.query(sql, [nome, email, hashSenha, tipo_usuario, telefone])
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

    async listarUsuario(req, res) {
        const paramId = req.params.id;
        let sql = "SELECT * FROM usuarios WHERE id_usuario = ?";
        const [rows] = await pool.query(sql, [paramId])

        return res.status(201).json(rows);
    },

    async alterar(req, res) {
        console.log(req.params)
        const paramId = req.params.id;

        const {nome, senha, tipo_usuario, telefone} = req.body;


        let sql = "UPDATE usuarios SET nome = ?, senha = ?, tipo_usuario = ?, telefone = ? WHERE id_usuario = ?"
        const result = await pool.query(sql, [nome, senha, tipo_usuario, telefone, Number(paramId)])
        console.log(result)
        const changedRows = result[0]?.affectedRows;
        if(!changedRows){
            return res.status(401).json({message: 'Erro ao alterar usuario.'})
        }

        const sql_select = 'SELECT * FROM usuarios WHERE id_usuario = ?'
        const [rows] = await pool.query(sql_select, [paramId])

        return res.status(201).json(rows[0]);
    },

    async deletar(req, res){
        const paramId = req.params.id;
        let sql = `DELETE FROM usuarios WHERE id_usuario = ?`
        const result = await pool.query(sql, [Number(paramId)])
        const affectedRows = result[0]?.affectedRows;
        if(!affectedRows)
        {
            return res.status(401).json({message: "Erro ao deletar usuario."})
        }
        return res.status(200).json({message: "Usuario deletado com sucesso."})
    },

    async login(req, res) {
        const {email, senha} = req.body;
        console.log(senha)

        const sql_select = `SELECT * FROM usuarios WHERE email = ?`

        const [rows] = await pool.query(sql_select, [email])
        console.log(rows)

        if(!rows?.length)
            return res.status(401).json({message: "Email ou senha incorretos!"})

        console.log(rows[0?.senha])

        const isPasswordValid = await bcrypt.compare(String(senha), String(rows[0]?.senha))
        console.log(isPasswordValid)
        if(!isPasswordValid)
        {
            return res.status(401).json({message: "Senha incorreta!"})
        } 

       
        delete rows[0]?.senha;

        return res.status(201).json(rows[0])
    }
}


module.exports = UsuariosController;