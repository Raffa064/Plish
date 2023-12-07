function Tokenizer() {
  function removeComments(source) {
    var outputSource = "";

    var comment = false;
    var mutiline = false;

    // TODO : make it known when is inside a string/char

    for (let i = 0; i < source.length - 1; i++) {
      const c = source.charAt(i);
      const cc = source.charAt(i + 1);

      if (comment) {
        if (mutiline) {
          if (c == ";" && c == cc) {
            comment = false;
            i++;
          }

          continue;
        }

        if (cc == "\n") {
          comment = false;
        }

        continue;
      }

      if (c == ";" && c != cc) {
        comment = true;
        mutiline = false;

        continue;
      }

      if (c == ";" && c == cc) {
        comment = true;
        mutiline = true;
        i += 1;

        continue;
      }

      outputSource += c;
    }

    return outputSource;
  }

  function separator(char) {
    return !char.match("[A-z0-9\\$_]");
  }

  function Char(source, t) {
    var end = -1;
    var isString = false;

    var quote = source.charAt(t);

    if (quote == "'" || quote == '"') {
      isString = true;
    }

    if (isString) {
      for (let i = t + 1; i < source.length - 1; i++) {
        const c = source.charAt(i);
        const cc = source.charAt(i + 1);

        if (c == "\\" && cc == quote) {
          i += 1; // scape for quotes inde a string
          continue;
        }

        if (c == quote) {
          end = i;
          break;
        }
      }
    }

    if (end === -1) {
      return null;
    }

    return {
      type: "Char",
      start: t,
      end,
      data: {
        value: source.substring(t + 1, end),
        isSequence: quote == '"',
      },
    };
  }

  function Label(source, t) {
    var end = -1;

    if (source.charAt(t) == "@") {
      for (let i = t + 1; i < source.length; i++) {
        var char = source.charAt(i);

        if (separator(char)) {
          end = i;
          break;
        }
      }
    }

    if (end === -1) {
      return null;
    }

    return {
      type: "Label",
      start: t,
      end,
      data: {
        label: source.substring(t + 1, end),
      },
    };
  }

  function Keyword(source, t) {
    var end = -1;

    var keywords = [
      "LD",
      "IF",
      "MV",
      "OUT",
      "goto",
      "ADD",
      "SUB",
      "DIV",
      "MUL",
      "SHR",
      "SHL",
    ];

    for (let i = 0; i < keywords.length; i++) {
      const kw = keywords[i];
      const kwLen = kw.length;

      if (source.substring(t, t + kwLen) == kw) {
        end = t + kwLen;
        break;
      }
    }

    if (end === -1) {
      return null;
    }

    return {
      type: "Keyword",
      start: t,
      end,
      data: {
        keyword: source.substring(t, end),
      },
    };
  }

  function Register(source, t) {
    var end = -1;

    var registers = [
      // Math registers (8bit)
      "A",
      "B",
      "C",
      "I", // memory register (16bit)
    ];

    for (let i = 0; i < registers.length; i++) {
      const reg = registers[i];

      if (source.substring(t, t + 1) == reg) {
        end = t + 1;
        break;
      }
    }

    if (end === -1) {
      return null;
    }

    return {
      type: "Register",
      start: t,
      end,
      data: {
        register: source.substring(t, end),
      },
    };
  }

  function LitNumber(source, t) {
    var end = -1;
    var isNumber = false;
    var isDecimal = null;

    var char = source.charAt(t);

    if (char == "$") {
      isNumber = true;
      isDecimal = false;
    }

    if (char == "#") {
      isNumber = true;
      isDecimal = true;
    }

    if (isNumber) {
      for (let i = t + 1; i < source.length; i++) {
        const char = source.charAt(i);

        if (isDecimal) {
          if (!char.match("[0-9]")) {
            end = i;
            break;
          }

          continue;
        }

        if (!char.match("[A-Fa-f0-9]")) {
          end = i;
          break;
        }
      }
    }

    if (end === -1) {
      return null;
    }

    return {
      type: "Number",
      start: t,
      end,
      data: {
        numberType: isDecimal ? "decimal" : "address",
        number: source.substring(t + 1, end),
      },
    };
  }

  function Symbol(source, t) {
    var end = -1;

    for (var i = t; i < source.length; i++) {
      const char = source.charAt(i);
      if (separator(char)) {
        end = i;
        break;
      }
    }

    if (end === -1) {
      return null;
    }

    const symbol = source.substring(t, end).trim();

    if (symbol.length === 0) {
      return null;
    }

    return {
      type: "Symbol",
      start: t,
      end,
      data: {
        symbol,
      },
    };
  }

  function tokenize(source) {
    const tokens = [];

    source = removeComments(source);

    const tokenizers = [Char, Label, Keyword, Register, LitNumber, Symbol];

    for (let i = 0; i < source.length; i++) {
      var token = null;

      for (let j = 0; j < tokenizers.length; j++) {
        token = tokenizers[j](source, i);

        if (token) {
          const { end } = token;
          i = end;

          token.source = source;

          break;
        }
      }

      if (token) {
        tokens.push(token);
      }
    }

    return tokens;
  }

  return {
    tokenize,
  };
}

module.exports = Tokenizer;
