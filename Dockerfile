# Use nginx as base image
FROM nginx:stable-alpine

# Create directory for the app
WORKDIR /usr/share/nginx/html

# Copy the project files
COPY . .

# Replace config.js with config.prod.js
RUN mv js/config.prod.js js/config.js

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]