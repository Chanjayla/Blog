module.exports = app => {
  app.get("/api", (req, res) => {
    res.json({ message: "welcome" })
  });

  app.use("/api/article", require("./article"))
  app.use("/api/tag", require("./tag"))
  app.use("/api", require("./other"))
};
