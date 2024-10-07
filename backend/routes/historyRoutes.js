const express = require('express');
const router = express.Router();
const { checkSchema } = require("express-validator");
const { getHistories, createHistory,} = require("../controllers/historyController");
const createHistoryValidationSchema = require("../utils/validationSchemas");

router.route("/").get(getHistories).post(checkSchema(createHistoryValidationSchema),createHistory);
// router.route("/:id").get(getHistory).put(updateHistory).delete(deleteHistory);

module.exports = router;
