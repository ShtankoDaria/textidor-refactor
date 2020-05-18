const fs = require("fs");
const path = require("path");
const config = require("../config");

// define FILES_DIR
const FILES_DIR = path.join(__dirname, config.FILES_DIR);

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const unlink = util.promisify(fs.unlink);
const readDir = util.promisify(fs.readdir);

// declare the handlers
const handlers = {
  getFiles: async (req, res, next) => {
    try {
      const list = await readDir(FILES_DIR);
      console.log(FILES_DIR);
      res.json(list);
    } catch (err) {
      if (err.code === "ENOENT") {
        console.log(FILES_DIR);
        res.status(404).end();
      }
      console.error(err);
      next(err);
    }
  },

  getFileNames: async (req, res, next) => {
    const fileName = req.params.name;
    try {
      const fileText = await readFile(`${FILES_DIR}/${fileName}`, "utf-8");
      const responseData = {
        name: fileName,
        text: fileText,
      };
      res.json(responseData);
    } catch (err) {
      if (err.code === "ENOENT") res.status(404).end();
      console.error(err);
      next(err);
    }
  },

  postFileName: async (req, res, next) => {
    const fileName = req.params.name;
    const fileText = req.body.text;
    try {
      await writeFile(`${FILES_DIR}/${fileName}`, fileText);

      // refactor hint:
      res.redirect(303, "/api/files");
      // handlers.getFiles(req, res, next);
    } catch (err) {
      if (err.code === "ENOENT") res.status(404).end();
      console.error(err);
      next(err);
    }
  },

  deleteFileName: async (req, res, next) => {
    const fileName = req.params.name;
    try {
      await unlink(`${FILES_DIR}/${fileName}`);

      // refactor hint:
      res.redirect(303, "/api/files");
      // handlers.getFiles(req, res, next);
    } catch (err) {
      console.error(err);
    }
  },
};

// export the handlers
module.exports = handlers;
