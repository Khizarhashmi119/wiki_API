const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const articleSchema = new mongoose.Schema({
  title: String,
  content: String
});
const Article = mongoose.model("Article", articleSchema);

app
  .route("/articles")

  .get(function(req, res) {
    Article.find({}, function(err, result) {
      if (err) {
        res.send("Error");
      } else {
        res.send(result);
      }
    });
  })

  .post(function(req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });
    newArticle.save(function(err) {
      if (err) {
        res.send("Error");
      } else {
        res.send("Successfully added article.");
      }
    });
  })

  .delete(function(req, res) {
    Article.deleteMany(function(err) {
      if (err) {
        res.send("Error");
      } else {
        res.send("Successfully deleted all articles.");
      }
    });
  });

app
  .route("/articles/:article")

  .get(function(req, res) {
    Article.findOne(
      {
        title: req.params.article
      },
      function(err, result) {
        if (err) {
          res.send("Error");
        } else {
          if (result) {
            res.send(result);
          } else {
            res.send("No article found.");
          }
        }
      }
    );
  })

  .put(function(req, res) {
    Article.updateOne(
      {
        title: req.params.article
      },
      {
        title: req.body.title,
        content: req.body.content
      },
      {
        overwrite: true
      },
      function(err) {
        if (err) {
          res.send("Error");
        } else {
          res.send("Successfully updated article.");
        }
      }
    );
  })

  .patch(function(req, res) {
    Article.updateOne(
      {
        title: req.params.article
      },
      {
        $set: req.body
      },
      function(err) {
        if (err) {
          res.send("Error");
        } else {
          res.send("Successfully updated article.");
        }
      }
    );
  })

  .delete(function(req, res) {
    Article.deleteOne(
      {
        title: req.params.article
      },
      function(err) {
        if (err) {
          res.send("Error");
        } else {
          res.send("Successfully deleted article.");
        }
      }
    );
  });

app.listen(3000, function() {
  console.log("Server has been started at port no. 3000");
});
