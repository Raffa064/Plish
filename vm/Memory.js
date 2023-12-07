function Memory(size = 4096) {
  const buffer = new Array(size);

  function read(addr) {
    return buffer[addr] & 0xff; // 1b / 8bit
  }

  function write(addr, byte) {
    buffer[addr] = byte & 0xff;
  }

  function readWord(addr) {
    return (read(addr) << 8) | read(addr + 1); // 2b / 16bit
  }

  function writeWord(addr, hbyte, lbyte) {
    buffer[addr] = hbyte;
    buffer[addr + 1] = lbyte;
  }

  return {
    buffer,
    read,
    write,
    readWord,
    writeWord,
  };
}

module.exports = Memory;
