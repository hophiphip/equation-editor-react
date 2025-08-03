import resolve from "@rollup/plugin-node-resolve";
import external from "rollup-plugin-peer-deps-external";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";
import dts from "rollup-plugin-dts";
import typescript from "@rollup/plugin-typescript";
import styles from 'rollup-plugin-styles';

import pkg from "./package.json";

export default [
  {
    input: "src/index.tsx",
    output: [
      {
        file: pkg.main,
        format: "cjs",
        exports: "named",
        sourcemap: true,
      },
      {
        file: pkg.module,
        format: "es",
        exports: "named",
        sourcemap: true,
      },
    ],
    external: ["mathquill", "jquery", "mathquill/build/mathquill.css"],
    plugins: [
      external(),
      resolve(),
      commonjs(),
      typescript({
        tsconfig: "./tsconfig.json",
      }),
      styles(),
      terser(),
    ]
  },
  {
    input: "./lib/types/index.d.ts",
    output: [{ file: pkg.types, format: "esm" }],
    external: [/\.css$/],
    plugins: [dts()],
  }
];
