const fs = require("fs");
const Compiler = require("./compiler/Compiler.js");

const compiler = new Compiler();
const source = fs.readFileSync("./tests/example.plish", "utf-8");

const test = process.argv[2] || "compile";
console.log("Selected test: " + test);

switch (test) {
  case "tokenize":
    console.log(require("./compiler/Tokenizer.js")().tokenize(source));
    break;
  case "compile":
    console.log(compiler.compile(source, "tests/output.bin").bin);
    break;
}
