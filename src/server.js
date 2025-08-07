require('dotenv').config();
const app = require('./app');
const logger = require('./config/logger');

const PORT = process.env.PORT || 3000;

const log = logger.logWithContext({ module: 'Startup' });

app.listen(PORT, () => {
  log.info(`Server running on port ${PORT}`);
});
