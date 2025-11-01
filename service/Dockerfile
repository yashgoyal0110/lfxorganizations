FROM node:18-alpine

WORKDIR /service

# Copy package files and install deps
COPY package*.json ./
RUN npm install

# Copy the rest of the code (including prisma folder)
COPY . .

# Generate Prisma client for Linux
RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "run", "dev"]
