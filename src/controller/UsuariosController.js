let Users = require('../model/Usuarios');
const pool = require('../database/mysql');
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// Alterações: Controllers Feedbacks (nomes das colunas), Favoritos (nomes das colunas), CatalogoServicos_Itens (coluna foto_Servico_item estava com s minusculo), 
               // CatalogoServicos (colunas foto_Servico e descricao_Servico estavam com s minusculo).

// Testes no Thunder: no método POST, Usuarios, CatalogoServicos, CatalogoServicos_itens, Servicos_prestados, Feedbacks, Categorias. 

const generateToken = (user) => {
    const payload = {
        id_usuario: user.id_usuario
    };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' })
}

const UsuariosController = {
    async criar(req, res) {
        // console.log(req.file)
        const { nome, email, senha,  telefone, foto_usuario } = req.body;
        const tipo_usuario = 'cliente';
        //verificacao do email se existe
        const sql_Select_existe = `SELECT * FROM Usuarios WHERE email = ?`
        const [result_existe] = await pool.query(sql_Select_existe, [email])
        // console.log([result_existe])
        if (result_existe[0]) {
            return res.status(401).json({ message: 'Erro a criar usuario, email ja cadastrado.' })
        }

       let imgUrl = '';
        if (req.file) {
            console.log(req.file.filename)
             imgUrl = `${req.file.filename}`
        }

        const salt = await bcrypt.genSalt(10);
        const hashSenha = await bcrypt.hash(String(senha), salt)
        console.log(hashSenha)
        let sql = `INSERT INTO Usuarios (nome, email, senha, tipo_usuario, telefone, foto_usuario) VALUES (?, ?, ?, ?, ?, ?)`

        const result = await pool.query(sql, [nome, email, hashSenha, tipo_usuario, telefone, foto_usuario])
        const insertId = result[0]?.insertId;
        if (!insertId) {
            return res.status(401).json({ message: 'Erro ao criar usuario' })
        }
        const sql_select = `SELECT id_usuario, email FROM Usuarios WHERE id_usuario = ?`
        const [rows] = await pool.query(sql_select, [insertId])
        return res.status(201).json(rows[0])

    },

    async listar(req, res) {
        console.log(req.userId)
        let sql = "SELECT * FROM Usuarios WHERE id_usuario = ?";
        const [rows] = await pool.query(sql, [req.userId])

        return res.status(201).json(rows[0]);
    },

    async listarUsuario(req, res) {
        const paramId = req.params.id;
        let sql = "SELECT * FROM Usuarios WHERE id_usuario = ?";
        const [rows] = await pool.query(sql, [paramId])

        return res.status(201).json(rows);
    },

    async alterar(req, res) {
        console.log(req.params)
        const paramId = req.params.id;

        const { nome, email, senha, tipo_usuario, telefone, foto_usuario } = req.body;

        let imgUrl = 'http://localhost:3333/images';
        if (req.file) {
            imgUrl = imgUrl + `${req.file.filename}`
        }


        let sql = "UPDATE Usuarios SET nome = ?, email = ?, senha = ?, tipo_usuario = ?, telefone = ?, foto_usuario = ? WHERE id_usuario = ?"
        const result = await pool.query(sql, [nome, email, senha, tipo_usuario, telefone, foto_usuario, imgUrl, Number(paramId)])

        // let sql = "UPDATE usuarios SET nome = ?, email = ?, senha = ?, tipo_usuario = ?, telefone = ?, foto_usuario = ? WHERE id_usuario = ?"
        // const result = await pool.query(sql, [nome, email, senha, tipo_usuario, telefone, foto_usuario, Number(paramId)])

        console.log(result)
        const changedRows = result[0]?.affectedRows;
        if (!changedRows) {
            return res.status(401).json({ message: 'Erro ao alterar usuario.' })
        }

        const sql_select = 'SELECT * FROM Usuarios WHERE id_usuario = ?'
        const [rows] = await pool.query(sql_select, [paramId])

        return res.status(201).json(rows[0]);
    },

    async atualizarStatus(req, res) {
        console.log('userId',req.userId)
        console.log('reqbody',req.body)
        const {  tipo_usuario,  } = req.body;

        let sql = "UPDATE Usuarios SET  tipo_usuario = ? WHERE id_usuario = ?"
        const result = await pool.query(sql, [ tipo_usuario, Number(req.userId)])

        console.log(result)
        const changedRows = result[0]?.affectedRows;
        if (!changedRows) {
            return res.status(401).json({ message: 'Erro ao alterar usuario.' })
        }

        const sql_select = 'SELECT * FROM Usuarios WHERE id_usuario = ?'
        const [rows] = await pool.query(sql_select, [Number(req.userId)])
        console.log(rows[0])
        return res.status(201).json(rows[0]);
    },

    async deletar(req, res) {
        const paramId = req.params.id;
        let sql = `DELETE FROM Usuarios WHERE id_usuario = ?`
        const result = await pool.query(sql, [Number(paramId)])
        const affectedRows = result[0]?.affectedRows;
        if (!affectedRows) {
            return res.status(401).json({ message: "Erro ao deletar usuario." })
        }
        return res.status(200).json({ message: "Usuario deletado com sucesso." })
    },




    // async login(req, res) {
    //     const { email, senha } = req.body;
    //     const sql_select = `SELECT * FROM Usuarios WHERE email = ?`;
    //     const [rows] = await pool.query(sql_select, [email]);
    //     if (!rows?.length) {
    //       return res.status(401).json({ message: "Email ou senha incorretos!" });
    //     }
    //     const isPasswordValid = await bcrypt.compare(String(senha), String(rows[0]?.senha));
    //     if (!isPasswordValid) {
    //       return res.status(401).json({ message: "Senha incorreta!" });
    //     }
    //     return res.status(200).json({ authenticated: true });
    //   }


    //   alternar para token depois de pronto o login

    async login(req, res) {
        const { email, senha } = req.body;
        console.log(senha)

        const sql_select = `SELECT * FROM Usuarios WHERE email = ?`

        const [rows] = await pool.query(sql_select, [email])
        console.log(rows)

        if (!rows?.length)
            return res.status(401).json({ message: "Email ou senha incorretos!" })


        const isPasswordValid = await bcrypt.compare(String(senha), String(rows[0]?.senha))
        console.log(isPasswordValid)
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Senha incorreta!" })
        }
        delete rows[0]?.senha;
        let user = rows[0]
        console.log(user.id_usuario)
        const token = generateToken(user)
        user = {
            ...user,
            token
        }
        // return res.status(201).json(rows[0])
        return res.status(201).json({ user, message: "Logado com sucesso!" })

    }
}


module.exports = UsuariosController;