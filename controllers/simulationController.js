const simulationModel = require('../models/simulationModel');
const EventHubService = require('../services/eventhubService');

const eventHubConfig = {
  endpoint: process.env.EVENTHUB_ENDPOINT,
  sharedAccessKeyName: "hack",
  sharedAccessKey: process.env.EVENTHUB_KEY,
  entityPath: "simulacoes"
};

async function processarSimulacao(req, res) {

  const eventHubService = new EventHubService(
    eventHubConfig.endpoint,
    eventHubConfig.sharedAccessKeyName,
    eventHubConfig.sharedAccessKey,
    eventHubConfig.entityPath
  );
  // JSON com solicitação de simulação de empréstimo
  const { valorDesejado, prazo } = req.body;

  // Consultar informações parametrizadas
  const informacoesParametrizadas = await simulationModel.consultarInformacoesParametrizadas();

  // Valida qual produto se adequa aos parâmetros de entrada
  const produtoAdequado = informacoesParametrizadas.find(
    (produto) =>
      valorDesejado >= produto.VR_MINIMO &&
      (valorDesejado <= produto.VR_MAXIMO || produto.VR_MAXIMO === null) &&
      prazo >= produto.NU_MINIMO_MESES &&
      (prazo <= produto.NU_MAXIMO_MESES || produto.NU_MAXIMO_MESES === null)
  );

  if (!produtoAdequado) {
    // Fechar conexão com o Event Hub
    eventHubService.fecharConexao();

    return res.status(404).json({ message: 'Nenhum produto adequado encontrado.' });
  }

  const simulacaoSAC = calcularSimulacaoSAC(valorDesejado, prazo, produtoAdequado.PC_TAXA_JUROS);
  const simulacaoPrice = calcularSimulacaoPrice(valorDesejado, prazo, produtoAdequado.PC_TAXA_JUROS);

  // JSON com o resultado da simulação
  const envelopeJSON = {
    produto: produtoAdequado.NO_PRODUTO,
    simulacaoSAC,
    simulacaoPrice,
  };

  // Envia para o Event Hub
  eventHubService.enviarEvento(envelopeJSON);


  // resposta da API
  res.json(envelopeJSON);

  // Fechar conexão com o Event Hub após a resposta da API
  eventHubService.fecharConexao();
}

//metodo para calculo SAC
function calcularSimulacaoSAC(valorDesejado, prazo, taxaJuros) {
  const saldoDevedorInicial = valorDesejado;
  const amortizacao = valorDesejado / prazo;
  const simulacaoSAC = [];

  let saldoDevedor = saldoDevedorInicial;
  for (let i = 0; i < prazo; i++) {
    const juros = saldoDevedor * taxaJuros;
    const prestacao = (amortizacao + juros).toFixed(2);

    saldoDevedor -= amortizacao;

    const parcela = {
      numero: i + 1,
      valorAmortizacao: amortizacao.toFixed(2), 
      valorJuros: juros.toFixed(2), 
      valorPrestacao: prestacao,
    };

    simulacaoSAC.push(parcela);
  }

  return {
    tipo: 'SAC',
    parcelas: JSON.stringify(simulacaoSAC),
  };
}

//metodo para calculo PRICE
function calcularSimulacaoPrice(valorDesejado, prazo, taxaJuros) {
  const saldoDevedorInicial = valorDesejado;
  const parcelaFixa = calcularParcelaFixa(valorDesejado, prazo, taxaJuros);
  const simulacaoPrice = [];

  let saldoDevedor = saldoDevedorInicial;
  for (let i = 0; i < prazo; i++) {
    const juros = saldoDevedor * taxaJuros;
    const amortizacao = parcelaFixa - juros;
    const prestacao = (amortizacao + juros).toFixed(2); 

    saldoDevedor -= amortizacao;

    const parcela = {
      numero: i + 1,
      valorAmortizacao: amortizacao.toFixed(2), 
      valorJuros: juros.toFixed(2), 
      valorPrestacao: prestacao,
    };

    simulacaoPrice.push(parcela);
  }

  return {
    tipo: 'Price',
    parcelas: JSON.stringify(simulacaoPrice),
  };
}
//metodo auxiliar para calculo da parcela fixa
function calcularParcelaFixa(valorDesejado, prazo, taxaJuros) {
  const fator = Math.pow(1 + taxaJuros, prazo);
  const parcelaFixa = (valorDesejado * taxaJuros * fator) / (fator - 1);

  return parcelaFixa;
}

module.exports = {
  processarSimulacao,
};
