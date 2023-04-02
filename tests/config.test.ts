import fs from 'fs';
import { DEFAULT_CONFIG, RetypeConfig } from '../src/config';

function writeConfig(path: string, config: Partial<RetypeConfig>) {
  fs.writeFileSync(path, JSON.stringify(config));
}

describe('RetypeConfig', () => {
  describe('fromCmd', () => {
    it('resolves defaults', () => {
      expect(RetypeConfig.fromCmd({})).toEqual(DEFAULT_CONFIG);
    });
    it('resolves with options', () => {
      expect(RetypeConfig.fromCmd({ json: './foo.json' })).toEqual({
        ...DEFAULT_CONFIG,
        json: './foo.json',
      });
    });
    describe('given config file', () => {
      beforeEach(() => {
        writeConfig('./.tmp-retyperc', { output: './output-from-config.html' });
      });
      describe('key exists in both', () => {
        it('resolves value from options', () => {
          expect(
            RetypeConfig.fromCmd({ config: './.tmp-retyperc', output: './output-from-cmd.html' }),
          ).toEqual({
            ...DEFAULT_CONFIG,
            output: './output-from-cmd.html',
          });
        });
      });
      describe('key exist only in config', () => {
        it('resolves value from config', () => {
          expect(RetypeConfig.fromCmd({ config: './.tmp-retyperc' })).toEqual({
            ...DEFAULT_CONFIG,
            output: './output-from-config.html',
          });
        });
      });
      describe('key exist only in options', () => {
        it('resolves value from config', () => {
          expect(RetypeConfig.fromCmd({ config: './.tmp-retyperc', include: ['./*.ts'] })).toEqual({
            ...DEFAULT_CONFIG,
            output: './output-from-config.html',
            include: ['./*.ts'],
          });
        });
      });
      describe('key does not exist', () => {
        it('resolves default value', () => {
          expect(RetypeConfig.fromCmd({ config: './.tmp-retyperc' })).toEqual({
            ...DEFAULT_CONFIG,
            output: './output-from-config.html',
            include: DEFAULT_CONFIG.include,
          });
        });
      });
    });
  });
  describe('fromArgs', () => {
    it('resolves defaults', () => {
      expect(RetypeConfig.fromArgs({})).toEqual(DEFAULT_CONFIG);
    });
    it('resolves with options', () => {
      expect(RetypeConfig.fromArgs({ include: ['index.ts'] })).toEqual({
        ...DEFAULT_CONFIG,
        include: ['index.ts'],
      });
    });
  });
  describe('fromConfigFile', () => {
    beforeAll(() => {
      writeConfig('./.tmp-retyperc', { json: './foo.json' });
    });
    it('resolves partial from config file', () => {
      expect(RetypeConfig.fromConfigFile('./.tmp-retyperc')).toEqual({
        json: './foo.json',
      });
    });
  });
});
