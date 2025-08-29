import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  declaration: true,
  rollup: {
    emitCJS: true,
  },
  entries: [
    'src/index',
    {
      input: 'src/drivers/',
      outDir: 'drivers',
      format: 'esm',
    },
    {
      input: 'src/drivers/',
      outDir: 'drivers',
      format: 'cjs',
      ext: 'cjs',
      declaration: false,
    },
    {
      input: 'src/drivers/internal/',
      outDir: 'kit',
      format: 'esm',
    },
    {
      input: 'src/drivers/internal/',
      outDir: 'kit',
      format: 'cjs',
      ext: 'cjs',
      declaration: false,
    }
  ],
});
