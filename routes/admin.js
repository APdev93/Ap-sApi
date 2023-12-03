const root = process.cwd();

const express = require("express");
const router = express.Router();

const config = require(`${root}/config/config.json`);
const rootPath = { root: __dirname };

router.get("/", (req, res, next) => {
	res.sendFile(`${root}/public/admin.html`, rootPath);
});

module.exports = router;
