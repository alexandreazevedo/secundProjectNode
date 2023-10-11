
const express = require('express')
const app = express()
const port = 3000
app.use(express.json())
const orderArry = []
const uuid = require('uuid')


/*Crie um middleware que será utilizado em todas rotas que recebem
  o parâmetro ID, então ele deve verificar se o ID passado existe. Se
  não existir retorne um erro, caso contrário permita a requisição 
  continuar normalmente*/
const oneMiddlewareID = (request, response, next) => {
    const { id } = request.params
    const index = orderArry.findIndex(user => user.id === id)
    //const orderId = orderArry.filter(selecao => selecao.id == id)

    if (index < 0) {
        return response.status(404).json({ erro: "Order not found" })
    }
    request.orderIndex = index
    request.orderId = id

    next()
}

/*Crie um middleware que é chamado em todas requisições que tenha um
 console.log que mostra o método da requisiçao(GET,POST,PUT,DELETE, etc)
 e também a url da requisição.*/
const twoMiddlewareIDthod = (request, response, next) =>{
    const method = request.method
    const url = request.url
     
    console.log(`Esse é o método: ${method} seguido dessa URL: ${url}`)
   
    next() 
}

//Rota POST/order: Adicionar novos pedidos
app.post('/order', (request, response) => {
    const { order, clientName, price} = request.body
    const oneOrder = { id: uuid.v4(), order, clientName, price, status: "Em preparação" }
    orderArry.push(oneOrder)
    return response.status(201).json(oneOrder)
})

//Rota GET /order: Rota que lista todos os pedidos já feitos
app.get('/order', twoMiddlewareIDthod,  (request, response) => {
    
    return response.json(orderArry)
})

/*Rota PUT /order/:id: Essa rota deve alterar um pedido já feito. 
Pode alterar,um ou todos os dados do pedido.O id do pedido deve ser 
enviado nos parâmetros da rota.*/
app.put('/order/:id', oneMiddlewareID, twoMiddlewareIDthod, (request, response) => {
    const { order, clientName, price, status } = request.body
    const index = request.orderIndex
    const id = request.orderId

    const upDateOrder = { id, order, clientName, price, status }

    orderArry[index] = upDateOrder
    return response.json(upDateOrder)
})

/*Rota /order/:id: Essa rota deve deletar um pedido já feito com
 o id enviado nos parâmetros da rota.*/
app.delete('/order/:id', oneMiddlewareID, (request, response) => {
    const index = request.orderIndex
    orderArry.splice(index, 1)
    return response.status(204).json()
})

/*Rota GET /order/:id: Essa rota recebe o id nos parâmetros e 
  deve retornar um pedido específico*/
app.get('/order/:id', oneMiddlewareID, twoMiddlewareIDthod, (request, response) => {
    const index = request.orderIndex
    const id = request.orderId   

    return response.json(orderArry[index]) 

})

/*PATCH /order/:id: Essa rota recebe o id nos parâmetros e assim 
  que ela for chamada, deve alterar o status do pedido recebido pelo id para "Pronto".*/
app.patch('/order/:id', oneMiddlewareID, (request, response) =>{
    const index = request.orderIndex
    const { id } = request.params
    const {order,clientName,price} = request.body

    const StatusPedido = {id,order,clientName,price,status: "pedido pronto"}


    orderArry[index] = StatusPedido

    console.log(StatusPedido)
    return response.json(StatusPedido)
    
})

//Ativa o servidor automatio: NPM RUN DEV
app.listen(port, () => {
    console.log("🚀🚀 Server started on port:", port)
})