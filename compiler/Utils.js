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

module.exports = {
  registerID,
  count,
};
