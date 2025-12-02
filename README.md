# E-Commerce

Sistema de e-commerce desenvolvido com Node.js no backend e HTML/CSS/JavaScript no frontend.

## Configuração Técnica

### Banco de Dados

- **Tipo**: MySQL
- **ORM**: Sequelize 6.37.7
- **Driver**: mysql2 3.15.1

### Servidor

- **Framework**: Express 5.1.0
- **Porta**: 3000 (padrão, configurável via `.env`)
- **Host**: localhost (padrão, configurável via `.env`)

## Estrutura do Projeto

### Backend (`/backend`)

#### Diretórios Principais

- **`/controller`** - Controllers da aplicação
  - `auth.controller.js` - Autenticação e registro
  - `usuario.controller.js` - Gerenciamento de usuários
  - `produto.controller.js` - Gerenciamento de produtos
  - `pedido.controller.js` - Gerenciamento de pedidos
  - `item_pedido.controller.js` - Itens dos pedidos
  - `entrega.controller.js` - Gerenciamento de entregas
  - `estoque.controller.js` - Gerenciamento de estoque

- **`/models`** - Modelos Sequelize
  - `Usuario.js` - Modelo de usuário
  - `Produto.js` - Modelo de produto
  - `Pedido.js` - Modelo de pedido
  - `ItemPedido.js` - Modelo de item de pedido
  - `Entrega.js` - Modelo de entrega
  - `Estoque.js` - Modelo de estoque
  - `rel.js` - Definição de relacionamentos entre modelos

- **`/routes`** - Rotas da API
  - `auth.routes.js` - Rotas de autenticação
  - `usuario.routes.js` - Rotas de usuário
  - `produto.routes.js` - Rotas de produto
  - `pedido.routes.js` - Rotas de pedido
  - `item_pedido.routes.js` - Rotas de item de pedido
  - `entrega.routes.js` - Rotas de entrega
  - `estoque.routes.js` - Rotas de estoque

- **`/middleware`** - Middlewares customizados
  - `authMiddleware.js` - Autenticação JWT
  - `isAdmin.middleware.js` - Verificação de permissões de admin

- **`/utils`** - Utilitários e funções auxiliares
  - `tokenJWT.js` - Geração e validação de tokens JWT
  - `criptografia.js` - Funções de criptografia
  - `validacao.js` - Validações gerais
  - `validaCPF.js` - Validação de CPF
  - `frete.js` - Cálculo de frete

- **`/db`** - Configuração do banco de dados
  - `conn.js` - Conexão Sequelize com MySQL

- **`/server`** - Configuração da aplicação
  - `app.js` - Configuração do Express

- **`/docs`** - Documentação
  - `fluxo_pedido.txt` - Documentação do fluxo de pedidos
  - `fluxo_checkout.txt` - Documentação do fluxo de checkout
  - `casoUsoEcom.png` - Diagrama de caso de uso
  - `classeDiagramaEcom.png` - Diagrama de classes
  - `modeloDER.png` - Modelo Entidade-Relacionamento
  - `modelo_logico_.png` - Modelo lógico

#### Arquivos Raiz

- `index.js` - Entrada da aplicação
- `sync.js` - Script de sincronização
- `package.json` - Dependências do projeto
- `.env` - Variáveis de ambiente (não versionado)
- `.env_exemplo` - Exemplo de variáveis de ambiente

### Frontend (`/frontend`)

#### Arquivos Principais

- `index.html` - Página inicial
- `login.html` - Página de login
- `register.html` - Página de registro
- `checkout.html` - Página de checkout
- `pedidosCliente.html` - Página de pedidos do cliente

#### Estilos

- `styles.css` - Estilos gerais
- `styleCheckout.css` - Estilos do checkout
- `stylePedidos.css` - Estilos de pedidos

#### Scripts JavaScript (`/js`)

- **`/other`** - Scripts gerais
  - `auth.js` - Autenticação
  - `login.js` - Login
  - `register.js` - Registro
  - `checkout.js` - Checkout
  - `meusPedidos.js` - Página de meus pedidos
  - `search.js` - Busca de produtos

- **`/produto`** - Scripts de produto
  - `listar.js`, `cadastrar.js`, `atualizar.js`, `consultar.js`, `deletar.js`

- **`/pedido`** - Scripts de pedido
  - `listar.js`, `cadastrar.js`, `atualizar.js`, `consultar.js`, `deletar.js`

- **`/entrega`** - Scripts de entrega
  - `listar.js`, `cadastrar.js`, `atualizar.js`, `consultar.js`

- **`/estoque`** - Scripts de estoque
  - `listar.js`, `cadastrar.js`, `atualizar.js`, `consultar.js`

- **`/usuario`** - Scripts de usuário
  - `listar.js`, `cadastrar.js`, `atualizar.js`, `consultar.js`, `deletar.js`

- **`/item_pedido`** - Scripts de item de pedido
  - `listar.js`, `cadastrar.js`, `atualizar.js`, `consultar.js`, `deletar.js`

#### Páginas HTML (`/html`)

- **`/produto`**, **`/pedido`**, **`/entrega`**, **`/estoque`**, **`/usuario`**, **`/item_pedido`** - Páginas de CRUD para cada entidade

## Dependências Principais

- **express** - Framework web
- **sequelize** - ORM para Node.js
- **mysql2** - Driver MySQL
- **bcrypt** - Hash de senhas
- **jsonwebtoken** - Geração de tokens JWT
- **cors** - CORS para requisições cross-origin
- **dotenv** - Gerenciamento de variáveis de ambiente

## Como Usar

1. Configure as variáveis de ambiente no arquivo `.env` (copie de `.env_exemplo`)
2. Instale as dependências: `npm install`
3. Inicie o servidor: `npm start` ou `node index.js`
4. Acesse o frontend em um navegador

---

## Funcionalidades

### Autenticação e Autorização
- **Login e Registro**: Autenticação de usuários com JWT
- **Controle de Acesso**: Middleware para verificar permissões de admin

### Gerenciamento de Produtos
- **CRUD Completo**: Cadastro, leitura, atualização e exclusão de produtos
- **Busca e Filtros**: Busca de produtos por nome, categoria e outros critérios

### Gerenciamento de Pedidos
- **Fluxo de Pedido**: Criação, atualização e exclusão de pedidos
- **Itens de Pedido**: Gerenciamento de itens associados a pedidos

### Gerenciamento de Entregas
- **Acompanhamento**: Status e detalhes de entregas
- **Atualização**: Atualização de informações de entrega

### Gerenciamento de Estoque
- **Controle**: Controle de estoque de produtos
- **Atualização**: Atualização de quantidades e informações de estoque

### Gerenciamento de Usuários
- **Perfis**: Cadastro e gerenciamento de perfis de usuário
- **Permissões**: Controle de acesso baseado em funções

## Documentação Adicional

- **Diagramas**: Disponíveis em `/backend/docs` para visualização da arquitetura
- **Fluxos**: Documentação de fluxos de pedido e checkout

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a Licença MIT. Consulte o arquivo LICENSE para mais detalhes.
