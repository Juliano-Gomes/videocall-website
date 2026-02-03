# Fullstack Rooms Website

## Descrição do Projeto
Este projeto é uma aplicação web de videoconferência que permite aos usuários criar e gerenciar salas de reunião. A aplicação é construída utilizando a arquitetura Clean Architecture, garantindo uma separação clara entre as camadas de apresentação, domínio e infraestrutura.

## Tecnologias Utilizadas
- **Node.js**: Ambiente de execução para JavaScript no servidor.
- **Express**: Framework para construção de APIs RESTful.
- **Prisma**: ORM para interagir com o banco de dados.
- **Socket.IO**: Para comunicação em tempo real.

## Estrutura do Projeto
A estrutura do projeto é organizada em pastas, seguindo os princípios da Clean Architecture:
- **source/**: Contém a lógica de negócios e a implementação das rotas.
- **lib/**: Contém a configuração do Prisma e outras bibliotecas.
- **prisma/**: Contém o esquema do banco de dados e as migrações.

## Rotas da API
A aplicação expõe as seguintes rotas:
- `POST /RegisterRoom`: Cria uma nova sala.
- `POST /createSubRoom`: Cria uma nova sub-sala.
- `POST /signUp`: Cria uma conta de usuário.
- `POST /signIn`: Realiza o login do usuário.
- `GET /search/:username`: Busca um usuário pelo nome.
- `POST /invitation`: Entra em uma sala através de um convite.
- `POST /sudoers`: Promove um usuário a super usuário.
- `GET /Room/info/:roomId`: Recupera informações de uma sala.

### Exemplo de Requisições
1. **Criar Sala**:
   ```json
   {
       "roomTitle": "",
       "owner": {
           "id": ""
       },
       "description": ""
   }
   ```
2. **Criar Sub-Sala**:
   ```json
   {
       "roomId": "",
       "subRoomName": "",
       "subRoomType": ""
   }
   ```
3. **Criar Conta**:
   ```json
   {
       "username": ""
   }
   ```
4. **Login**:
   ```json
   {
       "username": "",
       "userUniqueKey": ""
   }
   ```
5. **Entrar em Sala**:
   ```json
   {
       "userId": "",
       "username": "",
       "roomId": "",
       "link": ""
   }
   ```
6. **Promover Usuário**:
   ```json
   {
       "newSuperUser": {
           "roomId": "",
           "name": "",
           "id": ""
       },
       "administrator": {
           "roomId": "",
           "name": "",
           "id": ""
       },
       "roomId": ""
   }
   ```
7. **Recuperar Informações da Sala**:
   ```json
   {
       "roomId": ""
   }
   ```

## Como Executar o Projeto
1. Clone o repositório.
2. Instale as dependências com `yarn install`.
3. Execute o servidor com `yarn room`.

## Contribuição
Contribuições são bem-vindas! Sinta-se à vontade para abrir um pull request ou relatar problemas.

## Licença
Este projeto está licenciado sob a MIT License.
