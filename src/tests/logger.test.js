describe('Logger', () => {
  const originalEnv = process.env;

  describe.each`
    nodeEnv
    ${'development'}
  `('when process.env.NODE_ENV="$nodeEnv"', ({ nodeEnv }) => {
    beforeEach(() => {
      jest.resetModules();
      process.env = {
        ...originalEnv,
        NODE_ENV: nodeEnv,
      };
    });

    afterEach(() => {
      process.env = originalEnv;
    });

    it(`logs with a requestId if rTracer is active - ${nodeEnv} env`, () => {
      const { logger } = require('../config/logger');
      const rTracer = require('cls-rtracer');
      jest.spyOn(rTracer, 'id').mockReturnValue('abc-123');
      const spy = jest.spyOn(console._stdout, 'write').mockImplementation(() => {});
      logger.info('Test log');
      expect(spy).toHaveBeenCalled();
    });
  });
});
