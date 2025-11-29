create database magazin_db;
use magazin_bd;

create table if not exists produits (
    id int auto_increment primary key,
    nom varchar(100),
    prix int,
    quantite int,
    categorie varchar(50),
    date_ajout datetime);

insert into produits (nom, prix, quantite, categorie, date_ajout)
 values (?, ?, ?, ?, ?);