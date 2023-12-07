const B8_REGISTERS = ["A", "B", "C"];
const B16_REGISTERS = ["I", "O"];
const REGISTERS = [...B8_REGISTERS, ...B16_REGISTERS];

function registerID(register) {
  return REGISTERS.indexOf(register);
}

function count(str, substr) {
  if (str.length < substr.length) {
    return 0;
  }

  var count = 0;
  for (let i = 0; i < str.length - substr.length; i++) {
    const currStr = str.substring(i, i + substr.length);

    if (currStr == substr) {
      count++;
    }
  }

  return count;
}

function c(style, color) {
  if (color === undefined) {
    color = style;
    style = "0";
  }

  if (isNaN(color)) {
    switch (color) {
      case "d":
        color = "30";
        break;
      case "r":
        color = "31";
        break;
      case "g":
        color = "32";
        break;
      case "y":
        color = "33";
        break;
      case "b":
        color = "34";
        break;
      case "p":
        color = "35";
        break;
      case "c":
        color = "36";
        break;
      case "w":
        color = "37";
        break;
    }
  }

  return (str) => {
    return "\x1b[" + style + ";" + color + "m" + str + "\x1b[0;37m";
  };
}

module.exports = {
  B8_REGISTERS,
  B16_REGISTERS,
  REGISTERS,
  registerID,
  count,
  c,
};
