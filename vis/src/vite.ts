import { UserConfig, Plugin } from 'vite';
import { OutputOptions } from 'rollup';

const buildConfig = (config: UserConfig) => {
  if (!config.build) config.build = {};

  if (!config.build.rollupOptions) config.build.rollupOptions = {};
  if (!config.build.rollupOptions.output) config.build.rollupOptions.output = {};

  const updateOutputOptions = (out: OutputOptions) => {
    out.outro = 'window.__datajson__="DATA_JSON"';
  };

  if (Array.isArray(config.build.rollupOptions.output)) {
    for (const o in config.build.rollupOptions.output) updateOutputOptions(o as OutputOptions);
  } else {
    updateOutputOptions(config.build.rollupOptions.output as OutputOptions);
  }
};

export function datajson(): Plugin {
  return {
    name: 'datajson',
    config: buildConfig,
    enforce: 'post',
  };
}
