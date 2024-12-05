let catalogoServicos_Itens = require('../model/CatalogoServicos_Itens');
let pool = require('../database/mysql')

const CatalogoServicos_ItensController = {

    async listar(req, res) {
        let sql = 'SELECT * FROM CatalogoServicos_Itens';
        const [rows] = await pool.query(sql);

        return res.status(200).json(rows);
    },

    async listarCatalogoServicos(req, res) {
       const paramId = req.params.id;
       const sql_select = `SELECT * FROM CatalogoServicos_Itens WHERE id_servico_item = ?`
       const [rows] = await pool.query(sql_select, [Number(paramId)])
       return res.status(201).json(rows[0])
    },

    async deletar(req, res){
       const paramId = req.params.id;

       let sql = `DELETE FROM CatalogoServicos_Itens WHERE id_servico_item = ?`

       const result = await pool.query(sql, [Number(paramId)])
       const affectedRows = result[0]?.affectedRows;
       if(!affectedRows)
       {
        return res.status(401).json({message: 'erro ao deletar catalogo de servicos itens'})
       }
       return res.status(200).json({message: 'catalogo de servicos itens deletada com sucesso.'})
    }

}

module.exports = CatalogoServicos_ItensController;