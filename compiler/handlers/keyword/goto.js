const OP = require("../../Utils");

function goto(ctx, tokenIndex, token) {
  const symbolAddr = ctx.pushBin(OP.goto, 0x0000) + 1;

  const symbol = ctx.getArgs(tokenIndex, 1)[0].data.symbol;
  ctx.tokenIndex = tokenIndex + 1;
  ctx.getSymbol(symbol, symbolAddr);
}

module.exports = goto;
