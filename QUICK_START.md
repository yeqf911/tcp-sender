# 快速开始指南

## 🎯 目标

将您的 TCP 报文发送工具发布到 GitHub，并自动构建 Windows、macOS、Linux 三个平台的安装包。

## ⚡ 5 分钟快速发布

### 1. 创建 GitHub 仓库（1 分钟）

访问 https://github.com/new 创建新仓库：
- 仓库名：`tcp-sender`
- 可见性：Public 或 Private
- **不要**勾选任何初始化选项

### 2. 推送代码（2 分钟）

```bash
# 在项目目录执行
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/tcp-sender.git
git branch -M main
git push -u origin main
```

**重要**：将 `YOUR_USERNAME` 替换为你的 GitHub 用户名！

### 3. 触发构建（1 分钟）

```bash
# 创建版本标签
git tag v1.0.0

# 推送标签
git push origin v1.0.0
```

### 4. 等待构建（10-15 分钟）

访问 `https://github.com/YOUR_USERNAME/tcp-sender/actions` 查看构建进度。

### 5. 下载安装包（1 分钟）

访问 `https://github.com/YOUR_USERNAME/tcp-sender/releases` 下载：

- **Windows**: `tcp-sender-temp_1.0.0_x64-setup.exe` 或 `.msi`
- **macOS Apple Silicon**: `tcp-sender-temp_1.0.0_aarch64.dmg`
- **macOS Intel**: `tcp-sender-temp_1.0.0_x64.dmg`
- **Linux**: `tcp-sender-temp_1.0.0_amd64.deb` 或 `.AppImage`

## 🎉 完成！

现在您可以：
1. 将安装包分享给其他人
2. 在 Windows 10 上安装并运行
3. 在任何平台上使用

## 📝 下次更新

```bash
# 修改代码后
git add .
git commit -m "更新说明"
git push

# 发布新版本
git tag v1.1.0
git push origin v1.1.0
```

## 🪟 Windows 10 安装说明

1. 下载 `.exe` 或 `.msi` 安装包
2. 双击运行安装程序
3. 按照向导完成安装
4. 在开始菜单找到 "tcp-sender-temp" 并运行

## ❓ 遇到问题？

查看详细文档：
- 完整指南：`GITHUB_ACTIONS_GUIDE.md`
- 使用说明：`README.md`

## 💡 提示

- 首次构建需要 15-20 分钟（下载依赖）
- 后续构建只需 10-15 分钟（使用缓存）
- 构建完成后会收到 GitHub 邮件通知
- 所有平台的安装包会自动上传到 Release
