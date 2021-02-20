const Memory = require('./memory');


class Stack {
  constructor(sizeInBytes) {
    this.bytes = Memory.create(sizeInBytes);
    this.byteLength = sizeInBytes;
    this.sp = 0;
  }

  push(x) {
    this.bytes.setUint16(this.sp, x);
    this.sp += 2;
    if (this.sp >= this.byteLength) this.sp = 0;
  }

  pop() {
    this.sp -= 2;
    if (this.sp < 0) this.sp = this.byteLength;
    return this.bytes.getUint16(this.sp);
  }
}


module.exports = Stack;
