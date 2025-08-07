const path = require('path');

const getFileName = (moduleName) => {
  return path.basename(moduleName);
};

module.exports = { getFileName };
