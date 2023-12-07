const OP = require("../../Opcodes");
const { B16_REGISTERS, registerID } = require("../../Utils");

function LD(ctx, tokenIndex, token) {
  const [arg0, arg1] = ctx.getArgs(tokenIndex, 2);
  ctx.tokenIndex = tokenIndex + 2;

  var opcode = null;
  var p0 = null;
  if (arg0.type == "Register") {
    const { register } = arg0.data;

    if (B16_REGISTERS.indexOf(register) < 0) {
      throw new Error("Invalid LD_I register: " + register);
    }

    opcode = OP.LD.I;
    p0 = registerID(register);
  } else {
    opcode = OP.LD.addr;
    p0 = parseInt(
      arg0.data.number,
      arg0.data.numberType == "decimal" ? 10 : 16,
    );
  }

  const sourceType = arg1.type;

  switch (sourceType) {
    case "Number":
      const { number, numberType } = arg1.data;
      const decimal = parseInt(number, numberType == "decimal" ? 10 : 16);
      ctx.pushBin(opcode.num, p0, decimal);
      break;
    case "Register":
      const register = arg1.data.register;
      ctx.pushBin(opcode.reg, p0, registerID(register));

      break;
    case "Char":
      const { value, isSequence } = arg1.data;

      // TODO: apply scape to string

      if (isSequence) {
        for (let i = 0; i < value.length; i++) {
          const char = value.charCodeAt(i);
          ctx.pushBin(opcode.char, p0 + i, char);
        }
      } else {
        ctx.pushBin(opcode, p0, value.charCodeAt(0));
      }

      break;
  }
}

module.exports = LD;
