const OP = require("../Opcodes.js");

function Label(ctx, tokenIndex, token) {
  const { type } = token;

  if (type == "Label") {
    const { label } = token.data;

    const binAddr = ctx.pushBin(OP.NOP); // add a empty opcode
    ctx.setSymbol(label, binAddr); // set symbol value as its address

    return true;
  }

  return false;
}

module.exports = Label;
