const fs = require("fs");
const Compiler = require("./compiler/Compiler.js");

const compiler = new Compiler();
const source = fs.readFileSync("./output.bin" /*example.plish"*/, "utf-8");

//console.log(require("./compiler/Tokenizer.js")().tokenize(source));
console.log(compiler.compile(source, "output.bin"));
