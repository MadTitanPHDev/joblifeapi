let pool = require('../database/mysql')

const CategoriaController = {
    async criar(req, res) {
        const {nome_categoria} = req.body;

        let sql = `INSERT INTO Categorias(nome_categoria) VALUES(?)`

        const result = await pool.query(sql, [nome_categoria])
        const insertId = result[0]?.insertId;
        if(!insertId){
            return res.status(401).json({message: 'erro ao criar categoria'})
        }

        const sql_select = `SELECT * FROM Categorias WHERE id_categoria = ?`

        const [rows] = await pool.query(sql_select, [insertId])
        return res.status(201).json(rows[0])

    },

    async listar(req, res) {
        let sql = 'SELECT * FROM Categorias';
        const [rows] = await pool.query(sql);

        return res.status(200).json(rows);
    },

    async listarCategoria(req, res) {
       const paramId = req.params.id;
       const sql_select = `SELECT * FROM Categorias WHERE id_categoria = ?`
       const [rows] = await pool.query(sql_select, [Number(paramId)])
       return res.status(201).json(rows[0])
    },

    async alterar(req, res) {
        const paramId = req.params.id;
        const {nome_categoria} = req.body;

        let sql = `UPDATE Categorias SET nome_categoria = ? WHERE id_categoria = ?`
        const result = await pool.query(sql, [nome_categoria, Number(paramId)])

        const changedRows = result[0]?.changedRows;
        if(!changedRows){
            return res.status(401).json({message: 'erro ao alterar categoria'})
        }
        const sql_select = `SELECT * FROM Categorias WHERE id_categoria = ?`
        const [rows] = await pool.query(sql_select, [paramId])

        return res.status(201).json(rows[0]);
    },

    async deletar(req, res){
       const paramId = req.params.id;

       let sql = `DELETE FROM Categorias WHERE id_categoria = ?`

       const result = await pool.query(sql, [Number(paramId)])
       const affectedRows = result[0]?.affectedRows;
       if(!affectedRows)
       {
        return res.status(401).json({message: 'erro ao deletar categoria'})
       }
       return res.status(200).json({message: 'categoria deletada com sucesso.'})
    }

}

module.exports = CategoriaController;