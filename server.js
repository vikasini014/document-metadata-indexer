const express = require("express");
const multer = require("multer");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const db = new sqlite3.Database("./database.db");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS files (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT,
      filesize REAL,
      extension TEXT,
      uploadDate TEXT
    )
  `);
});

const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

app.post("/upload", upload.single("document"), (req, res) => {
  const file = req.file;

  const filename = file.originalname;
  const filesize = (file.size / 1024).toFixed(2);
  const extension = path.extname(file.originalname);

  const uploadDate = new Date().toLocaleString();

  db.run(
    `INSERT INTO files (filename, filesize, extension, uploadDate)
     VALUES (?, ?, ?, ?)`,
    [filename, filesize, extension, uploadDate],
    err => {
      if (err) {
        return res.status(500).json(err);
      }

      res.json({
        success: true,
        message: "File Uploaded Successfully"
      });
    }
  );
});

app.get("/files", (req, res) => {
  db.all("SELECT * FROM files ORDER BY id DESC", [], (err, rows) => {
    if (err) {
      return res.status(500).json(err);
    }
    res.json(rows);
  });
});

app.delete("/files/:id", (req, res) => {
  db.run(
    "DELETE FROM files WHERE id=?",
    [req.params.id],
    function (err) {
      if (err) {
        return res.status(500).json(err);
      }

      res.json({
        success: true
      });
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});