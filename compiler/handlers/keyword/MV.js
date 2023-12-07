const OP = require("../../Opcodes");
const { registerID } = require("../../Utils");

function MV(ctx, tokenIndex, token) {
  const [arg0, arg1] = ctx.getArgs(tokenIndex, 2);
  ctx.tokenIndex = tokenIndex + 2;

  const targetRegister = registerID(arg0.data.register);
  const sourceType = arg1.type;

  switch (sourceType) {
    case "Number":
      const { number, numberType } = arg1.data;
      const decimal = parseInt(number, numberType == "decimal" ? 10 : 16);

      if (numberType == "decimal") {
        ctx.pushBin(OP.MV_reg_dec, targetRegister, decimal);
      } else {
        ctx.pushBin(OP.MV_reg_addr, targetRegister, decimal); // Copy value from memory
      }

      break;
    case "Register":
      const sourceRegister = registerID(arg1.data.register);
      ctx.pushBin(OP.MV_reg_reg, targetRegister, sourceRegister);
      break;
    case "Char":
      const { value, isSequence } = arg1.data;

      if (isSequence) {
        throw new Error("Can't move string to a register");
      } else {
        ctx.pushBin(OP.MV_reg_char, targetRegister, value.charCodeAt(0));
      }

      break;
  }
}

module.exports = MV;
