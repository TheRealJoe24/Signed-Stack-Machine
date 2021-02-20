const VM = require('./vm');


const vm = new VM();

// TODO reserve memory for unsigned values

// prints -5-(-6) infinitely
// vm.write(0x4005);
// vm.write(0x4006);
// vm.write(0x8003);
// vm.write(0x8004);
// vm.write(0x0100);
// vm.write(0x8001);

// vm.write(0x8005);

// print 0 3 times
vm.write(0x0000); // push 0 to stack
vm.write(0x0000); // push 0 to stack
vm.write(0x8006); // store 0 in 0x0000
vm.write(0x0000); // push 0 to stack
vm.write(0x8007); // start: 0x0106, load variable from memory at 0x0000
vm.write(0x0000);
vm.write(0x8007);
vm.write(0x8004);
vm.write(0x0001); // push 1 to stack
vm.write(0x8002); // add variable to 1
vm.write(0x0000);
vm.write(0x8006); // store variable + 1
vm.write(0x0003); // push 3
vm.write(0x0000);
vm.write(0x8007); // load variable
vm.write(0x0106); // push address of start
vm.write(0x8008); // jump if variable is greater than 3
vm.write(0x0000);
vm.write(0x8007);
vm.write(0x8001);


vm.run();