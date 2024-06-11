# Use uma imagem oficial do Node.js como base, versão mais recente
FROM node:18

# Crie um diretório de trabalho
WORKDIR /usr/src/app

# Copie o package.json e o package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instale as dependências do projeto
RUN npm install

# Copie o restante do código da aplicação
COPY . .

# Exponha a porta na qual a aplicação vai rodar
EXPOSE 3000

# Comando para rodar a aplicação
CMD ["node", "app.js"]
