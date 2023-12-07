const bit8 = 0xff;
const bit16 = 0xffff;

function Register(bitMask) {
  const register = {
    value: 0,
  };

  Object.seal(register);

  return new Proxy(register, {
    set: (obj, prop, value) => {
      obj[prop] = value & bitMask;
    },
    get: (obj, prop) => {
      return obj[prop] | bitmask;
    },
  });
}

module.exports = {
  bit8, bit16
  Register
};
