const express = require("express");

let app = express();

let path = require("path");

const port = 3000;

app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));

const knex = require("knex")({
    client: "pg",
    connection: {
        host : "localhost",
        user : "postgres",
        password : "S0cc3rr0cks",
        database : "music",
        port : 5432
    }
});  

app.get("/", (req, res) => {
    knex.select("band_id", 
                "band_name", 
                "lead_singer",
                "music_genre",
                "still_rocking",
                "rating").from('bands').then(bands => {
        res.render("displayBand", {mybands: bands});
    }).catch(err => {
        console.log(err);
        res.status(500).json({err});
    });
});

app.get("/findRecord", (req, res) => {
    res.render("findRecord", {});
});

app.get("/chooseBand/:bandName", (req, res) => {
    knex.select("band_name", "lead_singer").from('bands').where("band_name", req.params.bandName).then(bands => {
        res.render("displayBand", {mybands: bands});
    }).catch(err => {
        console.log(err);
        res.status(500).json({err});
    });
});

app.get("/editBand", (req, res) => {
    knex.select("band_id", 
                "band_name", 
                "lead_singer",
                "music_genre",
                "still_rocking",
                "rating").from("bands").where("band_name", req.query.band_name.toUpperCase()).then(bands => {
                    res.render("editBand", {mybands: bands});
    }).catch(err => {
        console.log(err);
        res.status(500).json({err});
    });    
});


app.post("/editBand", (req, res) => {
    knex("bands").where("band_id", parseInt(req.body.band_id)).update({
        band_name: req.body.bandName,
        lead_singer: req.body.singer,
        music_genre: req.body.music_genre,
        still_rocking: req.body.still_rocking ? "Y" : "N",
        rating: req.body.rating
    }).then(mybands => {
        res.redirect("/");
    });    
});

app.get("/addBand", (req, res) => {
    res.render("addBand");
});    
    
// This is one way to do it. This way doesn't specify the column names where you want to insert and just inserts all.
// app.post("/addBand", (req, res) => {
//     knex("bands").insert(req.body).then(mybands => {
//         res.redirect("/");
//     })
// }); 

// This is another way, just specifying the column names you want to insert.
app.post("/addBand", (req, res) => {
    knex("bands").insert({band_name: req.body.band_name.toUpperCase(), lead_singer: req.body.lead_singer.toUpperCase()}).then(mybands => {
        res.redirect("/");
    })
});

app.post("/deleteBand/:id", (req, res) => {
    knex("bands").where("band_id", req.params.id).del().then(mybands => {
        res.redirect("/");
    }).catch(err => {
        console.log(err);
        res.status(500).json({err});
    })
});

app.post("/deleteAllBands", (req, res) => {
    knex("bands").del().then(mybands => {
        res.redirect("/");
    }).catch(err => {
        console.log(err);
        res.status(500).json({err});
    })
}); 

app.listen(3000, () => console.log("Express App has started and server is listening!"));