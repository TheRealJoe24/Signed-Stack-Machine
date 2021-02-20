const Stack = require('./stack');
const Memory = require('./memory');

const PROGRAM_START = 0x100;

const FLAG_POSITIVE = 0;
const FLAG_NEGATIVE = 1;
const FLAG_INSTRUCTION = 2;
const FLAG_UNDEFINED = 3;

const unsign = function(x) { // return x without its sign
  return x & 0x3FFF;
}

const get_sign = function(x) { // assuming a 16 bit int, return only first two bits
  return x >> 14;
}

const sign = function(x) { // return a javascript int with the sign of x
  let s = get_sign(x);
  let c = unsign(x);
  switch (s) {
    case FLAG_POSITIVE:
      return c;
    case FLAG_NEGATIVE:
      return c * -1;
    case FLAG_INSTRUCTION:
      return 0;
    case FLAG_UNDEFINED:
      return 0;
  }
}

function re_sign(x) { // given a javascript signed integer, return a stack signed integer
  let js = Math.sign(x); // javascript sign of x
  let s = Math.abs(x);
  return js < 0 ?  FLAG_NEGATIVE << 14 | s : FLAG_POSITIVE << 14 | s;
}

class VM {
  constructor() {
    this.stack = new Stack(64*2);
    this.memory = Memory.create(1024);
    this.pc = PROGRAM_START;
    this.wp = this.pc;

    this.running = false;
  }

  write(x) {
    this.memory.setUint16(this.wp+=2, x);
  }

  fetch() {
    return this.memory.getUint16(this.pc+=2);
  }

  run() {
    this.running = true;
    while (this.running) {
      this.step();
    }
  }

  step() {
    let word = this.fetch();
    let op = unsign(word); // remove the first to bits (flag)
    let flag = get_sign(word);

    switch (flag) {
      case FLAG_POSITIVE:
        this.stack.push(word);
        break;
      case FLAG_NEGATIVE:
        this.stack.push(word);
        break;
      case FLAG_INSTRUCTION: {
        switch (op) {
          case 0: // NOP
            break;
          case 1: // HALT
            this.running = false;
            break;
          case 2: {// ADD
            let a = this.stack.pop();
            let b = this.stack.pop();
            let x = sign(a);
            let y = sign(b);
            this.stack.push(re_sign(y+x));
            break;
          }
          case 3: {// SUB
            let a = this.stack.pop();
            let b = this.stack.pop();
            let x = sign(a);
            let y = sign(b);
            this.stack.push(re_sign(y-x));
            break;
          }
          case 4: {// POP
            let a = this.stack.pop();
            let x = sign(a);
            process.stdout.write(x.toString(10) + " ");
            break;
          }
          case 5: {// JMP
            this.pc = unsign(this.stack.pop());
            break;
          }
          case 6: {// store
            let address = this.stack.pop();
            this.memory.setUint16(unsign(address), this.stack.pop());
            break;
          }
          case 7: {// load
            let address = this.stack.pop();
            this.stack.push(this.memory.getUint16(unsign(address)));
            break;
          }
          case 8: {// JMP GT
            let ad = this.stack.pop();
            let a = this.stack.pop();
            let b = this.stack.pop();
            this.pc = (b > a ? ad : this.pc);
            break;
          }
        }
        break;
      }
    }
  }
}

module.exports = VM;
