# =========================================================================
# BUILDER STAGE: Usando uma base moderna e segura (Node 20)
# =========================================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copia os arquivos de definição de pacotes
COPY package*.json ./

# Instala TODAS as dependências. A versão do NPM que vem com o Node 20
# já é moderna e segura, então não precisamos mais do 'npm install -g'.
RUN npm install

# Copia o resto do código-fonte
COPY . .

# Roda o script de build para compilar o TypeScript
RUN npm run build

# =========================================================================
# PRODUCTION STAGE: Usando a mesma base moderna e segura
# =========================================================================
FROM node:20-alpine

WORKDIR /app

# Copia os arquivos de definição de pacotes do builder
COPY --from=builder /app/package*.json ./

# Instala APENAS as dependências de PRODUÇÃO.
RUN npm install --omit=dev

# Copia APENAS o código compilado do estágio de builder
COPY --from=builder /app/dist ./dist

# Expõe a porta que a aplicação usa
EXPOSE 3000

# Comando para iniciar a aplicação em produção
CMD [ "npm", "start" ]