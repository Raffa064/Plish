const OP = {
  // Opcodes
  NOP: 0x00, // Don't do nothing
  LD: {
    I: {
      num: 0x01, // Load a number (dec/dex) into memory
      reg: 0x02, // Load register into memory
      char: 0x03, // Load an char or char sequence into memory
    },
    addr: {
      num: 0x04,
      reg: 0x05,
      char: 0x06,
    },
  },
  MV_reg_dec: 0x07, // Move an number (dec) to a register
  MV_reg_addr: 0x08, // Move a memory value to a register
  MV_reg_reg: 0x09, // Move an value from a register to other
  MV_reg_char: 0x0a, // Move an UNIQUE char to a register
  goto: 0x0b, // Goto to an address (specified by labels)
};

module.exports = OP;
