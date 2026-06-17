import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // 锁定工作区根目录为本项目（上层目录存在其它 lockfile，避免被误判）
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
