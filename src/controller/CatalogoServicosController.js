let catalogoServicos = require('../model/CatalogoServicos');
let pool = require('../database/mysql')

const CatalogoServicosController = {

    async listar(req, res) {
        let sql = 'SELECT * FROM CatalogoServicos';
        const [rows] = await pool.query(sql);

        return res.status(200).json(rows);
    },

    async listarCatalogoServicos(req, res) {
       const paramId = req.params.id;
       const sql_select = `SELECT * FROM CatalogoServicos WHERE id_servico = ?`
       const [rows] = await pool.query(sql_select, [Number(paramId)])
       return res.status(201).json(rows[0])
    },

    async deletar(req, res){
       const paramId = req.params.id;

       let sql = `DELETE FROM CatalogoServicos WHERE id_servico = ?`

       const result = await pool.query(sql, [Number(paramId)])
       const affectedRows = result[0]?.affectedRows;
       if(!affectedRows)
       {
        return res.status(401).json({message: 'erro ao deletar catalogo de servicos'})
       }
       return res.status(200).json({message: 'catalogo de servicos deletada com sucesso.'})
    }

}

module.exports = CatalogoServicosController;