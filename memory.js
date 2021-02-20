const create = function(sizeInBytes) {
  const ab = new ArrayBuffer(sizeInBytes);
  const dv = new DataView(ab);
  return dv;
}


module.exports = { create };
