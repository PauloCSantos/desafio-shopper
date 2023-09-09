FROM mysql:8.0.34-debian
ENV MYSQL_ROOT_PASSWORD=shopper123
ENV MYSQL_DATABASE=shopperdatabase
COPY database.sql /docker-entrypoint-initdb.d
EXPOSE 3306
