const fs = require("fs");
const Tokenizer = require("./Tokenizer");
const { count } = require("./Utils");
const tokenHandlers = require("./Handlers");

function Compiler() {
  const tokenizer = new Tokenizer();

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

    for (let tokenIndex = 0; tokenIndex < tokens.length; ) {
      const token = tokens[tokenIndex];
      var validToken = false;

      for (const handler of tokenHandlers) {
        if (handler(ctx, tokenIndex, token)) {
          validToken = true;
          break;
        }
      }

      if (!validToken) {
        const start = token.start;
        const end = token.end;
        const code = token.source.substring(start, end);
        const line = count(token.source.substring(0, start), "\n") + 1;

        throw new Error(
          '\033[0;31mInvalid token "' +
            code +
            '", at line ' +
            line +
            "\033[0;37m",
        );
      }

      tokenIndex = (ctx.tokenIndex || tokenIndex) + 1;
      delete ctx.tokenIndex;
    }

    const binStr = ctx.bin.reduce((prev, curr) => {
      return prev + String.fromCharCode(curr);
    }, "");
    fs.writeFileSync(output, binStr, () => {});

    return {
      sources,
      tokens,
      symbols: {
        solved: ctx.solved,
        unsolved: ctx.unsolved,
      },
      bin: ctx.bin,
      binStr,
    };
  }

  return {
    compile,
  };
}

module.exports = Compiler;
