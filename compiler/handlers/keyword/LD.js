const OP = require("../../Opcodes");
const { registerID } = require("../../Utils");

function LD(ctx, tokenIndex, token) {
  const [arg0, arg1] = ctx.getArgs(tokenIndex, 2);
  ctx.tokenIndex = tokenIndex + 2;

  const addr = parseInt(arg0.data.number, 16);
  const sourceType = arg1.type;

  switch (sourceType) {
    case "Number":
      const { number, numberType } = arg1.data;
      const decimal = parseInt(number, numberType == "decimal" ? 10 : 16);
      ctx.pushBin(OP.LD_addr_num, addr, decimal);
      break;
    case "Register":
      const register = arg1.data.register;
      ctx.pushBin(OP.LD_addr_reg, addr, registerID(register));

      break;
    case "Char":
      const { value, isSequence } = arg1.data;

      // TODO: apply scape to string

      if (isSequence) {
        for (let i = 0; i < value.length; i++) {
          const char = value.charCodeAt(i);
          ctx.pushBin(OP.LD_addr_char, addr + i, char);
        }
      } else {
        ctx.pushBin(OP.LD_addr_char, addr, value.charCodeAt(0));
      }

      break;
  }
}

module.exports = LD;
