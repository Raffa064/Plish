function Keywords(ctx, tokenIndex, token) {
  const { type } = token;

  if (type == "Keyword") {
    const { keyword } = token.data;

    try {
      const keywordModule = require("./keyword/" + keyword + ".js");

      if (keywordModule) {
        keywordModule(ctx, tokenIndex, token);
        return true;
      }
    } catch {
      throw new Error("Invalid keyword: " + keyword);
    }
  }

  return false;
}

module.exports = Keywords;
