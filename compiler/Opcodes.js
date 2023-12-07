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

module.exports = OP;
