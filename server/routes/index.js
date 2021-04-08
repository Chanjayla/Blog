

module.exports = app => {
  app.get("/api", (req, res) => {
    res.json({ message: "welcome" })
  });
  app.use("/api/article", require("./article"))
  app.use("/api/tag", require("./tag"))
  app.use("/api/rss", require("./rss"))
  app.use("/user", require("./user"))
  app.use("/docs", require("./docs"))
  app.use("/resource", require("./resource"))
  app.use("/statistics", require("./statistics"))
};
