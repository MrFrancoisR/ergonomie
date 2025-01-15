# Ergonomie
Pour avoir accès à notre application. Il est nécessaire de créer une base de donée. 

// Installation de postgresql sous Linux
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl restart postgresql

// Création de la table
sudo -u postgres psql
CREATE DATABASE Users;
CREATE USER user WITH PASSWORD 'lannion';
GRANT ALL PRIVILEGES ON DATABASE Users TO user;
\q

// Lancement du serveur en php
php -S localhost:3000

Et enfin connectez vous à la page web http://localhost:3000