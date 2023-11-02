<h1 align="center">:file_cabinet: PRIMEIRO DESAFIO DE DESENVOLVIMENTO HACKATHON VITEC 2023</h1>

## :memo: Descrição
API SIMULAÇÃO EMPRÉSTIMO COM ENVIO EVENTOS PARA AZURE EVENT HUB

## :books: Conforme requisitos abaixo, para o desafio do Hackathon VITEC 2023:
* Receber um envelope JSON, via chamada à API, contendo uma solicitação de
simulação de empréstimo;
* Consultar um conjunto de informações parametrizadas em uma tabela de banco de
dados SQL Server;
* Validar os dados de entrada da API com base nos parâmetros de produtos retornados no
banco de dados;
* Filtrar qual produto se adequa aos parâmetros de entrada;
* Realizar os cálculos para os sistemas de amortização SAC e PRICE de acordo com
dados validados;
* Retornar um envelope JSON contendo o nome do produto validado e o resultado da
simulação utilizando dois sistemas de amortização (SAC e Price) e gravando este mesmo
envelope JSON no Eventhub. A gravação no Eventhub visa simular uma possibilidade de
integração com a área de relacionamento com o cliente da empresa, que receberia em
poucos segundos este evento de simulação e estaria apta à execução de estratégia
negocial com base na interação do cliente.

## :wrench: Tecnologias utilizadas e justificativa

Decidimos utilizar o javaScript utilizando o Node.js que possibilita a utilização da
linguagem que é comumente utilizada no lado do cliente (front-end) no lado do servidor
(back-end). O Node.js vem sendo muito utilizado tanto por essa característica, utilização
da mesma linguagem no back-end como no front-end além de lidar com eficiência com
um grande número de solicitações simultâneas utilizando-se de um modelo de I/O
assíncrono não bloqueante.

Possui um ecossistema robusto de pacotes, o Node Package Manager,
www.npmjs.com e uma comunidade ativa e muito grande de desenvolvedores no
desenvolvimento de ferramentas e bibliotecas da linguagem.;

## :wrench: A API e seus componentes

A porta de entrada da API é o arquivo index.js que utiliza o servidor express e
configura as rotas. O express é uma biblioteca web para Node utilizada para simplificar o
desenvolvimento de soluções web e APIs, dando recursos para lidar com requests e
responses, middlewres e rotas.
O arquivo /controllers/simulationController.js faz as simulações de empréstimo e
processa a solicitação realizando os cáculos necessários, consulta informações
parametrizadas do modelo e faz o envio do envelope JSON ao Event Hub.
.
As rotas relacionadas a simulação do empréstimo estão definidas em
/routes/simulationRoutes.js
A model é responsável pela consulta ao banco de dados e utilizada da
databaseService para estabelecer a conexão. A biblioteca mssql é utiliada para tanto.
Temos também a EventHubService que tem a responsabilidade de enviar eventos para o
Event Hub, a biblioteca utilizada para este fim é o @azure/event-hubs, fornecida pela
própria Microsoft para interação com o Azure Event Hub.

## :rocket: Rodando o projeto
Abaixo, segue um passo a passo do funcionamento da API, em localhost.
1 Iniciar o servidor através do comando: 
```
node index.js;
```
2 O comando que inicializará o servidor em localhost e será possível fazer uma
requisição POST para localhost:3000/api. Para testes utilizamos o aplicativo Insomnia.
3 No corpo da requisição enviamos um objeto JSON, como definido nos requisitos
como os campos valorDesejado e prazo.
4 A API então realizará a simulação com os parâmetros fornecidos, consultará as
informações parametrizadas no banco de dados e enviará o envento para o Event Hub.
5 Teremos o resultado da simulação no corpo da resposta da API.


## :soon: Importante
* Para rodar o projeto entre em contato para solicitar o .env!
