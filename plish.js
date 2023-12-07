const fs = require("fs");
const Compiler = require("./compiler/Compiler");
const { c } = require("./compiler/Utils");

const compiler = new Compiler();
const source = fs.readFileSync("./tests/example.plish", "utf-8");

const test = process.argv[2] || "compile";
console.log("Selected test: " + test);

switch (test) {
  case "tokenize":
    console.log(
      colorizeTokens(require("./compiler/Tokenizer.js")().tokenize(source)),
    );
    break;
  case "compile":
    console.log(compiler.compile(source, "tests/output.bin").bin);
    break;
}

function colorizeTokens(tokens) {
  var output = "";

  const palette = {
    K: (token) => c(1, "p")(token.data.keyword),
    S: (token) => c(1, "g")(token.data.symbol),
    C: (token) => {
      const isSequence = token.data.isSequence;
      const q = isSequence ? '"' : "'";
      return c(token.data.isSequence ? 1 : 0, "y")(q + token.data.value + q);
    },
    R: (token) => c(1, "c")(token.data.register),
    N: (token) =>
      c(1, "w")(token.data.numberType == "decimal" ? "#" : "$") +
      c(0, "b")(token.data.number),
    L: (token) => c(1, "w")("@") + c(0, "c")(token.data.label),
  };

  for (var token of tokens) {
    const typeChar = token.type.charAt(0);
    var colorizer = palette[typeChar] || ((str) => str);

    output += (typeChar == "K" ? "\n" : "") + colorizer(token) + " ";
  }

  return output;
}
