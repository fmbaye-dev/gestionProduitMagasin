const express = require("express");
const app = express();
app.use(express.json());

const mysql = require("mysql2");
const connection = mysql.createConnection({
  host: "localhost",
  user: "fmbaye_dev",
  password: "GAYA_linux@2005",
  database: "magazin_bd",
  port: 3306,
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Connection a la base de données MySQL réussit");

  connection.query(
    "create database if not exists magazin_bd",
    (err, result) => {
      if (err) throw err;
      console.log("La base de données a été crée avec succés!");
    }
  );

  const requeteSql = `create table if not exists produits (
    id int auto_increment primary key,
    nom varchar(100),
    prix int,
    quantite int,
    categorie varchar(50),
    date_ajout datetime
  )`;

  connection.query(requeteSql, (err, result) => {
    if (err) throw err;
    console.log("Table créée avec succes!");
  });
});

app.get("/produits/recherche", (req, res) => {
  const categorie = req.query.categorie;

   const sql = "select * from produits where categorie = ?";
  connection.query(sql, [categorie], (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

app.get("/produits/recherche", (req, res) => {
  const prix_min = req.query.prix_min;
  const prix_max = req.query.prix_max;

  const sql = "select * from produits where prix between ? and  ?";
  connection.query(sql, [prix_min, prix_max], (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

function validerProduit(corps) {
  const erreurs = [];

  if (corps.prix <= 0) erreurs.push("Le prix ne doit pas être supérieur à 0");

  if (corps.quantite < 0) erreurs.push("La quantite ne doit pas être négative");

  return erreurs;
}

app
  .route("/produits")
  .get((req, res) => {
    connection.query("select * from produits", (err, result) => {
      if (err) throw err;
      res.json(result);
    });
  })
  .post((req, res) => {
    const corps = req.body;
    const erreurs = validerProduit(corps);
    if (erreurs.length > 0) {
      return res.status(400).json({ erreurs });
    }

    const date = new Date();

    const sql =
      "insert into produits (nom, prix, quantite, categorie, date_ajout) values (?, ?, ?, ?, ?)";
    const ajout = [
      corps.nom,
      corps.prix,
      corps.quantite,
      corps.categorie,
      date,
    ];

    connection.query(sql, ajout, (err, result) => {
      if (err) return res.send(err);

      res.json({ id: result.insertId, ajout });
    });
  });

app
  .route("/produits/:id")
  .get((req, res) => {
    const id = req.params.id;
    const sql = "select * from produits where id = ?";
    connection.query(sql, [id], (err, result) => {
      if (err) throw err;

      if (result.length === 0)
        return res.status(404).json("Produit introuvable");
      res.json(result[0]);
    });
  })

  .put((req, res) => {
    const { nom, prix, quantite, categorie } = req.body;
    const id = req.params.id;
    const date = new Date();

    const selectSql = "select * from produits where id = ?";
    connection.query(selectSql, [id], (err, result) => {
      if (err) throw err;

      if (result.length === 0) {
        return res.send("Produit non trouvé");
      }

      const ancien = result[0];

      const nouveau = {
        nom: nom ?? ancien.nom,
        prix: prix ?? ancien.prix,
        quantite: quantite ?? ancien.quantite,
        categorie: categorie ?? ancien.categorie,
        date_ajout: date,
      };

      const sql = `update produits set
            nom = ?, 
            prix = ?, 
            quantite = ?, 
            categorie = ?, 
            date_ajout = ?
        where id = ?`;

      connection.query(
        sql,
        [
          nouveau.nom,
          nouveau.prix,
          nouveau.quantite,
          nouveau.categorie,
          nouveau.date_ajout,
          id,
        ],
        (err, result) => {
          if (err) throw err;
          res.send("Produit modifié avec succès");
        }
      );
    });
  })

  .delete((req, res) => {
    const id = req.params.id;
    const quantite = req.params.quantite;

    if (quantite != 0)
      return res.status(400).json({ erreur: "Suppression impossible" });

    connection.query(
      "delete from produits where id = ?",
      [id],
      (err, result) => {
        if (err) throw err;

        if (result.affectedRows == 0) res.send("echec de la suppression");

        res.send("produit supprimé avec succes");
      }
    );
  });

app.listen(3000, () => {
  console.log("Le server écouter sur le port 3000");
});
