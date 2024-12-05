let servicosPrestados = require('../model/ServicosPrestados');
let pool = require('../database/mysql')

const ServicosPrestadosController = {
    async criar(req, res) {
        const {id_servico, id_servico_item, id_usuario, usuario_cliente, descr_servico} = req.body;

        let sql = `INSERT INTO Servicos_prestados (id_servico, id_servico_item, id_usuario, usuario_cliente, descr_servico) VALUES(?, ?, ?, ?, ?)`

        const result = await pool.query(sql, [id_servico, id_servico_item, id_usuario, usuario_cliente, descr_servico])
        const insertId = result[0]?.insertId;
        if(!insertId){
            return res.status(401).json({message: 'erro ao criar servico prestado'})
        }

        const sql_select = `SELECT * FROM Servicos_prestados WHERE id_servico_pretado = ?`

        const [rows] = await pool.query(sql_select, [insertId])
        return res.status(201).json(rows[0])

    },

    async listar(req, res) {
        let sql = 'SELECT * FROM Servicos_prestados';
        const [rows] = await pool.query(sql);

        return res.status(200).json(rows);
    },

    async listarServicoPrestado(req, res) {
       const paramId = req.params.id;
       const sql_select = `SELECT * FROM Servicos_prestados WHERE id_servico_pretado = ?`
       const [rows] = await pool.query(sql_select, [Number(paramId)])
       return res.status(201).json(rows[0])
    },

    async alterar(req, res) {
        const paramId = req.params.id;
        const {id_servico, id_servico_item, id_usuario, usuario_cliente, descr_servico} = req.body;

        let sql = `UPDATE Servicos_prestados SET id_servico = ?, id_servico_item = ?, id_usuario = ?, usuario_cliente = ?, descr_servico = ? WHERE id_servico_pretado = ?`
        const result = await pool.query(sql, [id_servico, id_servico_item, id_usuario, usuario_cliente, descr_servico, Number(paramId)])

        const changedRows = result[0]?.changedRows;
        if(!changedRows){
            return res.status(401).json({message: 'erro ao alterar servico prestado'})
        }
        const sql_select = `SELECT * FROM Servicos_prestados WHERE id_servico_pretado = ?`
        const [rows] = await pool.query(sql_select, [paramId])

        return res.status(201).json(rows[0]);
    },

    async deletar(req, res){
       const paramId = req.params.id;

       let sql = `DELETE FROM Servicos_prestados WHERE id_servico_pretado = ?`

       const result = await pool.query(sql, [Number(paramId)])
       const affectedRows = result[0]?.affectedRows;
       if(!affectedRows)
       {
        return res.status(401).json({message: 'erro ao deletar servico prestado'})
       }
       return res.status(200).json({message: 'servico prestado deletada com sucesso.'})
    }

}

module.exports = ServicosPrestadosController;