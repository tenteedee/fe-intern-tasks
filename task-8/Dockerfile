# Sử dụng Node.js làm base image
FROM node:18-alpine AS build

# Thiết lập thư mục làm việc
WORKDIR /app

# Copy file package.json và package-lock.json để cài đặt dependencies
COPY package.json package-lock.json ./

# Cài đặt dependencies
RUN npm install

# Copy toàn bộ mã nguồn vào container
COPY . .

# Build ứng dụng React Vite
RUN npm run build

# Sử dụng Nginx để chạy ứng dụng
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Mở cổng 80 cho Nginx
EXPOSE 80

# Chạy Nginx
CMD ["nginx", "-g", "daemon off;"]
