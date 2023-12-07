const OP = require("../Opcodes.js");
const { registerID } = require("../Utils.js");

function Keywords(ctx, tokenIndex, token) {
  const { type } = token;

  if (type == "Keyword") {
    const keywords = {
      LD: () => {
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
      },
      MV: () => {
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
      },
      goto: () => {
        const symbolAddr = ctx.pushBin(OP.goto, 0x0000) + 1;

        const symbol = ctx.getArgs(tokenIndex, 1)[0].data.symbol;
        ctx.tokenIndex = tokenIndex + 1;
        ctx.getSymbol(symbol, symbolAddr);
      },
    };

    const { keyword } = token.data;

    if (keywords[keyword]) {
      keywords[keyword]();
      return true;
    }
  }

  return false;
}

module.exports = Keywords;
