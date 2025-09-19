# Teste-Tecnico-Fullstack-Junior-AEXP

## Requisitos

- Docker Desktop
- Node.js
- npm

adicionar .env na pasta backend:
PORT=4000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mydb?schema=public"

adicionar .env.local na pasta front end:
NEXT_PUBLIC_API_URL=http://localhost:4000

---

Certifique-se de ter as portas 3000, 4000 e 5432 livres ao rodar o Docker.

### 2. Subir backend + banco de dados

Entre na pasta do backend:

cd backend

Depois:

docker compose up --build

Backend estará disponível em: http://localhost:4000
Banco de dados PostgreSQL em: localhost:5432

O backend já aplica as migrations e roda o seed automaticamente.

### 3. Rodar frontend

Entre na pasta do frontend:

cd frontend
npm install
npm run dev
Frontend estará disponível em: http://localhost:3000

---

Para deletar inscrições, use os endpoints da API (ex.: DELETE /inscriptions/:id).

Lista de inscrições para teste

Churrasco da Galera

Carlos Silva — 11987654321
Ana Santos — 11976543210
Pedro Oliveira — 11965432109
Julia Costa — 11954321098
Rafael Lima — 11943210987
Mariana Souza — 11932109876
Bruno Alves — 11921098765
Camila Rocha — 11910987654

Pelada de Sexta

Diego Martins — 11999888777
Lucas Ferreira — 11988777666
Gabriel Nunes — 11977666555
Thiago Barbosa — 11966555444
Felipe Castro — 11955444333
Eduardo Ramos — 11944333222
Rodrigo Teixeira — 11933222111
Leonardo Dias — 11922111000
Gustavo Moreira — 11911000999
André Carvalho — 11900999888
Vinicius Pereira — 11899888777
Matheus Ribeiro — 11888777666

Aniversário da Maria

Fernanda Lima — 11777666555
Patricia Gomes — 11766555444
Amanda Silva — 11755444333
Bruna Santos — 11744333222
Daniela Costa — 11733222111
Renata Oliveira — 11722111000
Juliana Almeida — 11711000999
Carolina Mendes — 11700999888
Larissa Cardoso — 11699888777
Natália Freitas — 11688777666
Isabela Correia — 11677666555
Priscila Monteiro — 11666555444
Vanessa Campos — 11655444333
Monica Araujo — 11644333222
Claudia Batista — 11633222111

Happy Hour do Trabalho

Roberto Machado — 11622111000
José Miranda — 11611000999
Antonio Nascimento — 11600999888
Francisco Moura — 11599888777
Marcelo Vieira — 11588777666
Paulo Lopes — 11577666555

Pizza e Netflix

Beatriz Cunha — 11566555444
Leticia Fonseca — 11555444333
Aline Pinto — 11544333222
Sabrina Duarte — 11533222111
