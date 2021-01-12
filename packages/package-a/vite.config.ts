import reactRefresh from "@vitejs/plugin-react-refresh";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/index.tsx",
      name: "PackageA",
    },
  },
  plugins: [reactRefresh()],
});
