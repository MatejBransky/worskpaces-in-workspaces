import reactRefresh from "@vitejs/plugin-react-refresh";
import { defineConfig } from "vite";
import watchWorkspaces from "@packages/vite-plugin-watch-source";

export default defineConfig({
  plugins: [reactRefresh(), watchWorkspaces("../../../")],
});
