const handlers = ["Label", "Keywords"].map((handler) => {
  return require("./handlers/" + handler + ".js");
});

module.exports = handlers;
