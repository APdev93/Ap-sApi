const root = process.cwd();

const express = require("express");
const router = express.Router();

const { getInfo } = require(`${root}/lib/function.js`);

router.use("/info", (req, res, next) => {
		let data = getInfo();
		res.json(data);
});

module.exports = router;
