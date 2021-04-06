import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import { getAliases } from "vite-aliases";
import vitePluginImp from "vite-plugin-imp";
import lessToJS from "less-vars-to-js";
import reactSvgPlugin from "vite-plugin-react-svg";
import path from "path";
import fs from "fs"

const themeVariables = lessToJS(
  fs.readFileSync(path.resolve(__dirname, "./variables.less"), "utf8")
);

const aliases = getAliases();


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    reactRefresh(),
    reactSvgPlugin({ref: true}),
    vitePluginImp({
      libList: [
        {
          libName: "antd",
          style: (name) => `antd/lib/${name}/style/index.less`,
        },
      ],
    }),
  ],
  resolve: {
    alias: aliases,
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        modifyVars: themeVariables,
      },
    },
  },
});
