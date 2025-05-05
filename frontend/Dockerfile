FROM node:18-alpine

WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install --legacy-peer-deps

# Копируем остальные файлы проекта
COPY . .

# Экспортируем порт
EXPOSE 3000

# Запускаем приложение
CMD ["npm", "start"]