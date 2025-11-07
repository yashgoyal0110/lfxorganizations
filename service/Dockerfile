FROM node:18-alpine

WORKDIR /service
ENV DATABASE_URL="postgresql://placeholder_user:placeholder_pass@localhost:5432/placeholder_db"


# Copy package files and install deps
COPY package*.json ./
COPY . .
RUN npm install

# Copy the rest of the code (including prisma folder)

# Generate Prisma client for Linux
RUN npx prisma generate

EXPOSE 3000

CMD ["npm", "run", "dev"]
