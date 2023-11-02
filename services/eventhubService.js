const { EventHubProducerClient } = require("@azure/event-hubs");

class EventHubService {
  constructor(endpoint, sharedAccessKeyName, sharedAccessKey, entityPath) {
    this.connectionString = `Endpoint=${endpoint};SharedAccessKeyName=${sharedAccessKeyName};SharedAccessKey=${sharedAccessKey};EntityPath=${entityPath}`;
    this.producerClient = new EventHubProducerClient(this.connectionString);
  }

  async enviarEvento(envelopeJSON) {
    try {
      const eventData = { body: JSON.stringify(envelopeJSON) };

      await this.producerClient.sendBatch([eventData]);

      console.log("Evento enviado para o Event Hub com sucesso");
    } catch (error) {
      console.error("Erro ao enviar evento para o Event Hub:", error);
    }
  }

  async fecharConexao() {
    try {
      await this.producerClient.close();
      console.log("Conexão com o Event Hub fechada com sucesso");
    } catch (error) {
      console.error("Erro ao fechar conexão com o Event Hub:", error);
    }
  }
}

module.exports = EventHubService;
