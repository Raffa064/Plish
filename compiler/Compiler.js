const fs = require("fs");
const Tokenizer = require("./Tokenizer.js");

const OP = {
  // Opcodes
  NOP: 0x00, // Don't do nothing
  LD_addr_num: 0x01, // Load a number (dec/dex) into memory
  LD_addr_reg: 0x02, // Load register into memory
  LD_addr_char: 0x03, // Load an char or char sequence into memory
  MV_reg_dec: 0x04, // Move an number (dec) to a register
  MV_reg_addr: 0x05, // Move a memory value to a register
  MV_reg_reg: 0x06, // Move an value from a register to other
  MV_reg_char: 0x07, // Move an UNIQUE char to a register
  goto: 0x08, // Goto to an address (specified by labels)
};

function Compiler() {
  const tokenizer = new Tokenizer();

  function registerID(register) {
    var id = 0;

    switch (register) {
      case "A":
        id = 0;
        break;
      case "B":
        id = 1;
        break;
      case "C":
        id = 2;
        break;
      case "I":
        id = 3;
        break;
    }

    return id;
  }

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

  function Keywords(ctx, tokenIndex, token) {
    const { type } = token;

    if (type == "Keyword") {
      const keywords = {
        LD: () => {
          const [arg0, arg1] = ctx.getArgs(tokenIndex, 2);

          const addr = parseInt(arg0.data.number, 16);
          const sourceType = arg1.type;

          switch (sourceType) {
            case "Number":
              const { number, numberType } = arg1.data;
              const decimal = parseInt(
                number,
                numberType == "decimal" ? 10 : 16,
              );
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

          const targetRegister = registerID(arg0.data.register);
          const sourceType = arg1.type;

          switch (sourceType) {
            case "Number":
              const { number, numberType } = arg1.data;
              const decimal = parseInt(
                number,
                numberType == "decimal" ? 10 : 16,
              );

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
                ctx.pushBin(
                  OP.MV_reg_char,
                  targetRegister,
                  value.charCodeAt(0),
                );
              }

              break;
          }
        },
        goto: () => {
          const symbolAddr = ctx.pushBin(OP.goto, 0x0000) + 1;

          const symbol = ctx.getArgs(tokenIndex, 1)[0].data.symbol;
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

  function compile(sources, output) {
    sources = [sources]; // gambiarra, dps tem remover isso

    const tokens = [];

    for (const src of sources) {
      const srcTokens = tokenizer.tokenize(src);
      tokens.push(...srcTokens);
    }

    const ctx = {
      tokens,
      bin: [],
      unsolved: [],
      solved: [],
      getSymbol: (symbol, addr) => {
        const solvedSymbol = ctx.solved.find((sym) => symbol === sym.symbol);

        if (solvedSymbol) {
          ctx.bin[addr] = solvedSymbol.value;
          return;
        }

        ctx.unsolved.push({ symbol, addr });
      },
      setSymbol: (symbol, value) => {
        ctx.solved.push({
          symbol,
          value,
        });

        ctx.unsolved = ctx.unsolved.filter((unsolvedSymbol) => {
          if (symbol === unsolvedSymbol.symbol) {
            ctx.bin[unsolvedSymbol.addr] = value;
            return false;
          }

          return true;
        });
      },
      pushBin: (...bin) => {
        const addr = ctx.bin.length;
        ctx.bin.push(...bin);

        return addr;
      },
      getArgs: (tokenIndex, count) => {
        const argTokens = [];

        for (let i = tokenIndex + 1; i < tokenIndex + 1 + count; i++) {
          argTokens.push(ctx.tokens[i]);
        }

        return argTokens;
      },
    };

    const tokenHandlers = [Label, Keywords];

    var tokenIndex = 0;
    for (const token of tokens) {
      for (const handler of tokenHandlers) {
        if (handler(ctx, tokenIndex, token)) {
          break;
        }
      }

      tokenIndex++;
    }

    const binStr = ctx.bin.reduce((prev, curr) => {
      return prev + String.fromCharCode(curr);
    }, "");
    fs.writeFileSync(output, binStr, () => {});
  }

  return {
    compile,
  };
}

module.exports = Compiler;
