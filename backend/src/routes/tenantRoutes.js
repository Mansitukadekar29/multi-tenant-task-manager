const express = require("express");
const router = express.Router();

const tenantMiddleware = require("../middleware/tenantMiddleware");

router.get("/info", tenantMiddleware, (req, res) => {
  res.json(req.tenant);
});

module.exports = router;