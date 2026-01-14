# GitHub Actions 自动构建指南

本文档说明如何使用 GitHub Actions 自动构建所有平台的安装包。

## 📋 前置准备

1. 拥有 GitHub 账号
2. 本地已安装 Git
3. 项目代码已准备就绪

## 🚀 完整步骤

### 第一步：在 GitHub 创建仓库

1. 访问 https://github.com/new
2. 填写仓库信息：
   - **Repository name**: `tcp-sender`（或其他名称）
   - **Description**: TCP 报文发送工具
   - **Public** 或 **Private**（根据需要选择）
   - **不要**勾选 "Initialize this repository with a README"
3. 点击 "Create repository"

### 第二步：推送代码到 GitHub

在项目目录执行以下命令：

```bash
# 添加所有文件到 Git
git add .

# 提交更改
git commit -m "Initial commit: TCP 报文发送工具"

# 添加远程仓库（替换 YOUR_USERNAME 为你的 GitHub 用户名）
git remote add origin https://github.com/YOUR_USERNAME/tcp-sender.git

# 推送到 GitHub
git branch -M main
git push -u origin main
```

### 第三步：触发自动构建

#### 方式 A：创建 Release Tag（推荐）

这种方式会自动创建 GitHub Release 并上传所有安装包。

```bash
# 创建版本标签
git tag v1.0.0

# 推送标签到 GitHub
git push origin v1.0.0
```

推送后，GitHub Actions 会自动开始构建：
- ⏱️ 构建时间：约 10-15 分钟
- 📦 构建平台：macOS (Intel + Apple Silicon)、Windows、Linux
- 🎉 完成后自动创建 Release

#### 方式 B：手动触发构建

1. 访问你的 GitHub 仓库
2. 点击顶部的 **Actions** 标签
3. 在左侧选择 **Build and Release** workflow
4. 点击右侧的 **Run workflow** 按钮
5. 选择分支（通常是 `main`）
6. 点击绿色的 **Run workflow** 按钮

手动触发只会构建并上传 artifacts，不会创建 Release。

### 第四步：查看构建进度

1. 访问 `https://github.com/YOUR_USERNAME/tcp-sender/actions`
2. 点击最新的 workflow 运行
3. 查看各个平台的构建状态：
   - ✅ 绿色勾：构建成功
   - ❌ 红色叉：构建失败
   - 🟡 黄色圆：正在构建

### 第五步：下载构建产物

#### 如果使用 Tag 触发（方式 A）

1. 访问 `https://github.com/YOUR_USERNAME/tcp-sender/releases`
2. 找到对应的版本（如 `v1.0.0`）
3. 在 **Assets** 部分下载对应平台的安装包：
   - **macOS Apple Silicon**: `tcp-sender-temp_1.0.0_aarch64.dmg`
   - **macOS Intel**: `tcp-sender-temp_1.0.0_x64.dmg`
   - **Windows MSI**: `tcp-sender-temp_1.0.0_x64_en-US.msi`
   - **Windows NSIS**: `tcp-sender-temp_1.0.0_x64-setup.exe`
   - **Linux Debian**: `tcp-sender-temp_1.0.0_amd64.deb`
   - **Linux AppImage**: `tcp-sender-temp_1.0.0_amd64.AppImage`

#### 如果手动触发（方式 B）

1. 在 workflow 运行详情页面
2. 滚动到底部的 **Artifacts** 部分
3. 下载对应平台的 artifacts：
   - `macos-aarch64-apple-darwin`
   - `macos-x86_64-apple-darwin`
   - `windows-x86_64-pc-windows-msvc`
   - `linux-x86_64-unknown-linux-gnu`

## 📦 安装包说明

### macOS

- **DMG 文件**：双击打开，拖动到应用程序文件夹
- **Apple Silicon (M1/M2/M3)**：选择 `aarch64` 版本
- **Intel**：选择 `x64` 版本

### Windows

- **MSI 安装包**：双击运行，按向导安装
- **NSIS 安装包**：双击运行，按向导安装
- 两种安装包功能相同，选择其一即可

### Linux

- **DEB 包**（Debian/Ubuntu）：
  ```bash
  sudo dpkg -i tcp-sender-temp_1.0.0_amd64.deb
  ```
- **AppImage**（通用）：
  ```bash
  chmod +x tcp-sender-temp_1.0.0_amd64.AppImage
  ./tcp-sender-temp_1.0.0_amd64.AppImage
  ```

## 🔧 常见问题

### Q: 构建失败怎么办？

A: 点击失败的 job，查看错误日志。常见原因：
- 依赖安装失败：检查网络连接
- 编译错误：检查代码是否有语法错误
- 权限问题：确保 GitHub Actions 有足够权限

### Q: 如何修改应用名称？

A: 编辑 `src-tauri/tauri.conf.json`，修改 `productName` 字段。

### Q: 如何修改版本号？

A: 编辑以下文件：
- `src-tauri/Cargo.toml`：修改 `version`
- `src-tauri/tauri.conf.json`：修改 `version`
- `package.json`：修改 `version`

### Q: 构建时间太长？

A: 正常情况下：
- macOS: 5-8 分钟
- Windows: 8-12 分钟
- Linux: 5-8 分钟
- 总计: 10-15 分钟

### Q: 如何只构建特定平台？

A: 编辑 `.github/workflows/build.yml`，注释掉不需要的平台。

## 🎯 下次发布新版本

```bash
# 1. 修改代码
# 2. 提交更改
git add .
git commit -m "新功能：XXX"
git push

# 3. 创建新版本标签
git tag v1.1.0
git push origin v1.1.0

# 4. 等待自动构建完成
# 5. 在 Releases 页面下载新版本
```

## 📝 注意事项

1. **首次构建**可能需要更长时间（15-20 分钟），因为需要下载依赖
2. **后续构建**会使用缓存，速度更快
3. **Tag 命名**建议使用语义化版本（如 `v1.0.0`、`v1.1.0`）
4. **Private 仓库**的 Actions 有使用限制，注意配额
5. **构建产物**会在 90 天后自动删除（Release 中的不会）

## 🔗 相关链接

- GitHub Actions 文档: https://docs.github.com/en/actions
- Tauri 文档: https://tauri.app/
- 语义化版本: https://semver.org/
