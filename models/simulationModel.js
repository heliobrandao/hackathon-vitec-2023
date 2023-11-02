const databaseService = require('../services/databaseService');

async function consultarInformacoesParametrizadas() {
  try {
    const pool = await databaseService.connect();

    const result = await pool.query`
      SELECT CO_PRODUTO, NO_PRODUTO, PC_TAXA_JUROS, NU_MINIMO_MESES, NU_MAXIMO_MESES, VR_MINIMO, VR_MAXIMO
      FROM dbo.PRODUTO
    `;

    return result.recordset;
  } catch (error) {
    console.error('Erro ao consultar informações parametrizadas:', error);
    throw error;
  }
}

module.exports = {
  consultarInformacoesParametrizadas,
};
