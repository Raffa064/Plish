const fs = require("fs");
const Compiler = require("./compiler/Compiler.js");

const compiler = new Compiler();
const source = fs.readFileSync("./output.bin" /*example.plish"*/, "utf-8");

const bin = [];

for (let i = 0; i < source.length; i++) {
  bin.push(source.charCodeAt(i));
}

console.log(bin);

//console.log(require("./compiler/Tokenizer.js")().tokenize(source));
//console.log(compiler.compile(source, "output.bin"));
