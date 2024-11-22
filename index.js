//MYRIAM BENMOUFFOK 

require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");

const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
    user: process.env.DATABASE_USER,
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
    port: 5432
});

// Création de la table articles (à exécuter une seule fois)
pool.query(`CREATE TABLE IF NOT EXISTS articles (
    id SERIAL PRIMARY KEY,  
    title TEXT, 
    content TEXT,
    author TEXT 
)`)
    .then(() => console.log("Table articles a été créée ou est déjà existante."))
    .catch(err => console.error(`Une erreur s'est produite lors de la tentative de création de la table articles : ${err}`));

// Middleware 
app.use(express.json());

//Définir les routes

app.get("/", (req, res) => {
    res.send("Hello from your API articles !");
});


app.get("/articles", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM articles ORDER BY id ASC");
        if (result.rows.length <= 0 || !result.rows) {
            throw new Error("La table articles est vide ou inexistante.");
        }
        res.status(200).json(result.rows);

        res.send(`Liste des articles : ${JSON.stringify(result.rows)}`);
    } catch (err) {
        res.status(500).json({
            "message": `Une erreur s'est produite lors de la tentative de récupération des données de la table articles : ${err}.`
        });
    }
});


app.post("/articles", async (req, res) => {

    try {
        const { title, content, author } = req.body;

        const result = await pool.query("INSERT INTO articles (title, content, author) VALUES ($1, $2, $3) RETURNING *", [title, content, author]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ message: `Une erreur s'est produite lors de la création de l'article : ${err}` });
    }
});


app.patch("/articles/edit/title", async (req, res) => { 
    try {
        const { id, title, ...params } = req.body;

        //vérifie si article existe 
        const verifyarticle = await pool.query("SELECT * FROM articles WHERE id = $1", [id]);

        if (verifyarticle.rows.length === 0) {
            return res.status(418).json({ message: "L'article est introuvable." });
        }

        const result = await pool.query("UPDATE articles SET title=$2 WHERE id=$1 RETURNING *", [id, title]);

        res.status(200).json({
            message: "Le titre de l'article a été modifié.",
            result: result.rows[0], 
            params: params
        });

    } catch (err) {
        res.status(500).json({
            message: `Une erreur s'est produite lors de la mise à jour du titre de l'article : ${err}`
        });
    }
});


app.delete("/articles/delete", async (req, res) => {

    try {
        const { id } = req.body;

          //vérifie si article existe 
          const verifyarticle = await pool.query("SELECT * FROM articles WHERE id = $1", [id]);

          if (verifyarticle.rows.length === 0) {
            return res.status(418).json({ message: "L'article est introuvable." });
          }

        const result = await pool.query("DELETE FROM articles WHERE id = $1 RETURNING *", [id]);

        res.status(200).json({
            message: "L'article a été supprimé.",
            article: result.rows[0]
        });
    } catch (err) {
        res.status(500).json({
            message: `Une erreur s'est produite lors de la suppression de l'article : ${err}`
        });
    }
});


// On lance de serveur Express 
app.listen(port, () => {
    console.log(`Le serveur écoute sur le port ${port}.`);
});
