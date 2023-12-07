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
  registerID,
  count,
  c,
};
