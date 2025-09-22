# nginx.Dockerfile (optional helper)
FROM nginx:stable
COPY nginx/careplanner.conf /etc/nginx/conf.d/default.conf
COPY ssl/ /etc/nginx/ssl/
