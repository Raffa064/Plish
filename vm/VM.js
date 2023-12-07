const Memory = require("./Memory.js");
const { bit8, bit16, Register } = require("./Register.js");

function VM() {
  const mem = new Memory();

  const PC = Register(bit16);
  const SP = Regsiter(bit16);
  const I = Register(bit16);

  const a = Register(bit8);
  const b = Register(bit8);
  const c = Register(bit8);
}

module.exports = VM;
