

module.exports = app => {
  app.use("/api/article", require("./article"))
  app.use("/api/tag", require("./tag"))
  app.use("/api/rss", require("./rss"))
  app.use("/user", require("./user"))
  app.use("/docs", require("./docs"))
  app.use("/resource", require("./resource"))
  app.use("/statistics", require("./statistics"))
  app.use("/api/release", require("./release"))
};
