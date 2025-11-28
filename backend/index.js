require('dotenv').config()
const app = require('./server/app')
const conn = require('./db/conn')

const PORT = process.env.PORT || 3000
const HOST = process.env.HOST || 'localhost'

// Testa conexão, sincroniza e sobe o servidor
conn.sync()
    // .then(() => {
    //     console.log('✓ Conexão com banco estabelecida')
    //     conn.sync()
    // })
    .then(() => {
        app.listen(PORT, HOST, () => {
            console.log(`Servidor rodando em http://${HOST}:${PORT}/`)
        })
    })
    .catch((err) => {
        console.error('Erro ao conectar ao banco:', err)
    })
