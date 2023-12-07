const fs = require("fs");
const Compiler = require("./compiler/Compiler");
const { c } = require("./compiler/Utils");

const compiler = new Compiler();
const source = fs.readFileSync("./tests/example.plish", "utf-8");

const test = process.argv[2] || "compile";
console.log("Selected test: " + c(0, "c")(test));

switch (test) {
  case "tokenize":
    console.log(
      colorizeTokens(require("./compiler/Tokenizer.js")().tokenize(source)),
    );
    break;
  case "compile":
    const { sources, tokens, symbols } = compiler.compile(
      source,
      "tests/output.bin",
    );

    const title = c(1, "y");
    const sucess = c(0, "g");
    const error = c(0, "r");
    const value = c(1, "c");

    console.log(title("[ Sources ]"));
    console.log("Source count: " + value(sources.length) + "\n");

    console.log(title("[ Tokens ]"));
    console.log("Token count: " + value(tokens.length));
    console.log("\n" + colorizeTokens(tokens) + "\n");

    console.log(title("[ Symbols ]"));
    const { solved, unsolved } = symbols;

    solved.forEach(({ symbol, value }) => {
      console.log("[x]\t" + sucess(symbol + " " + value));
    });

    unsolved.forEach(({ symbol, addr }) => {
      console.log("[ ]\t" + error(symbol + " " + addr));
    });

    console.log("Solved: " + value(solved.length));
    console.log("Unsolved: " + value(unsolved.length));

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
