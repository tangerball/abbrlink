# 多技术栈适配方案设计文档

## 1. 项目背景

abbrlink 是一个用于为 Markdown 文件生成唯一缩写链接的工具，目前支持 Vite、Astro、Next.js 和 Nuxt.js 等技术栈。为了扩大用户群体，需要扩展对 Gatsby、Hexo 和 Eleventy 等技术栈的支持。

## 2. 适配方案

### 2.1 方案选择

选择**方案2：创建独立插件包**，为每种技术栈创建独立的插件包，每个插件包依赖核心 abbrlink 包。同时添加技术栈自动检测功能，方便用户使用。

### 2.2 架构设计

```
├── packages/
│   ├── cli/              # 核心 abbrlink 包
│   ├── vite-plugin-abbrlink/  # Vite 插件（已存在）
│   ├── gatsby-plugin-abbrlink/  # Gatsby 插件（新建）
│   ├── hexo-plugin-abbrlink/  # Hexo 插件（新建）
│   ├── eleventy-plugin-abbrlink/  # Eleventy 插件（新建）
│   ├── vuepress-plugin-abbrlink/  # VuePress 插件（新建）
│   ├── sveltekit-plugin-abbrlink/  # SvelteKit 插件（新建）
│   └── remix-plugin-abbrlink/  # Remix 插件（新建）
```

### 2.3 核心功能

- 为 Markdown 文件生成唯一的缩写链接
- 支持不同技术栈的插件集成
- 保持核心逻辑的一致性
- 提供统一的配置选项

### 2.4 技术栈适配策略

#### 2.4.1 Gatsby 适配

- 创建 `gatsby-plugin-abbrlink` 包
- 利用 Gatsby 的 API 钩子（如 `onPreBootstrap`、`onCreateNode`）
- 在构建开始时生成 abbrlink
- 监听文件变化并更新 abbrlink

#### 2.4.2 Hexo 适配

- 创建 `hexo-plugin-abbrlink` 包
- 利用 Hexo 的插件 API（如 `hexo.extend.filter.register`）
- 在文章生成前添加 abbrlink
- 支持 Hexo 的配置系统

#### 2.4.3 Eleventy 适配

- 创建 `eleventy-plugin-abbrlink` 包
- 利用 Eleventy 的插件 API（如 `eleventyConfig.addTransform`）
- 在构建过程中为 Markdown 文件添加 abbrlink
- 支持 Eleventy 的配置方式

#### 2.4.4 VuePress 适配

- 创建 `vuepress-plugin-abbrlink` 包
- 利用 VuePress 的插件 API（如 `extendsMarkdown`、`onInitialized`）
- 在 Markdown 处理过程中添加 abbrlink
- 支持 VuePress 的配置系统

#### 2.4.5 SvelteKit 适配

- 创建 `sveltekit-plugin-abbrlink` 包
- 利用 SvelteKit 的钩子（如 `handle`、`prerender`）
- 在构建过程中为 Markdown 文件添加 abbrlink
- 支持 SvelteKit 的配置方式

#### 2.4.6 Remix 适配

- 创建 `remix-plugin-abbrlink` 包
- 利用 Remix 的 API（如 `loader`、`action`）
- 在构建过程中为 Markdown 文件添加 abbrlink
- 支持 Remix 的配置系统

## 3. 实现计划

### 3.1 核心包修改

1. 确保 `abbrlink` 核心包提供足够的 API 供插件使用
2. 优化核心逻辑，提高生成速度（用户要求优先速度）
3. 确保配置选项的一致性

### 3.2 插件包实现

1. **Gatsby 插件**
   - 创建 `packages/gatsby-plugin-abbrlink` 目录
   - 实现 Gatsby 插件逻辑
   - 添加配置选项
   - 编写文档

2. **Hexo 插件**
   - 创建 `packages/hexo-plugin-abbrlink` 目录
   - 实现 Hexo 插件逻辑
   - 添加配置选项
   - 编写文档

3. **Eleventy 插件**
   - 创建 `packages/eleventy-plugin-abbrlink` 目录
   - 实现 Eleventy 插件逻辑
   - 添加配置选项
   - 编写文档

4. **VuePress 插件**
   - 创建 `packages/vuepress-plugin-abbrlink` 目录
   - 实现 VuePress 插件逻辑
   - 添加配置选项
   - 编写文档

5. **SvelteKit 插件**
   - 创建 `packages/sveltekit-plugin-abbrlink` 目录
   - 实现 SvelteKit 插件逻辑
   - 添加配置选项
   - 编写文档

6. **Remix 插件**
   - 创建 `packages/remix-plugin-abbrlink` 目录
   - 实现 Remix 插件逻辑
   - 添加配置选项
   - 编写文档

### 3.3 测试计划

1. **自动化测试验证**
   - 为每个插件创建自动化测试用例
   - 使用 CI/CD 流程自动运行测试
   - 测试不同技术栈下的功能是否正常
   - 测试性能和稳定性
2. **集成测试**
   - 测试技术栈自动检测功能
   - 测试统一配置格式在不同技术栈下的兼容性
   - 测试性能优化效果

## 4. 配置选项

### 4.1 统一配置格式

所有插件包将使用统一的配置格式，确保用户在不同技术栈中使用相同的配置方式：

- `paths`：需要处理的 Markdown 文件路径（支持字符串或数组）
- `alg`：生成 abbrlink 的算法（crc32 或 crc16，默认 crc32）
- `timeOffsetInHours`：时区偏移量（默认 8）

### 4.2 技术栈特定配置

除了统一配置外，各插件包还可以支持技术栈特定的配置选项，但必须保持核心配置的一致性。

## 5. 性能优化

### 5.1 核心优化策略

1. **缓存机制**
   - 缓存已处理文件的 abbrlink 结果
   - 避免重复计算相同内容的 abbrlink
   - 使用内存缓存和磁盘缓存结合的方式

2. **并行处理**
   - 利用 Node.js 的 `Promise.all` 并行处理多个 Markdown 文件
   - 控制并发数，避免系统资源耗尽

3. **增量处理**
   - 只处理修改过的文件
   - 使用文件哈希值检测文件变化
   - 避免全量重新处理

4. **文件系统优化**
   - 批量读取和写入文件
   - 使用流式操作处理大文件
   - 减少文件系统调用次数

5. **算法优化**
   - 优化 CRC 算法的实现
   - 减少字符串操作和内存分配
   - 使用更高效的数据结构

### 5.2 技术栈特定优化

针对不同技术栈的特点，采用相应的优化策略：

- **静态站点生成器**：在构建前预处理所有 Markdown 文件
- **框架**：利用框架的缓存机制和构建优化
- **开发模式**：使用增量编译和热更新

## 6. 技术栈自动检测

### 6.1 功能描述

实现技术栈自动检测功能，当用户在项目中安装 abbrlink 核心包时，自动检测项目使用的技术栈并推荐相应的插件。

### 6.2 检测方法

1. **配置文件检测**：检查项目根目录下的配置文件（如 `gatsby-config.js`、`hexo.config.js`、`eleventy.config.js` 等）
2. **依赖检测**：检查 `package.json` 中的依赖项
3. **目录结构检测**：检查项目的目录结构

### 6.3 实现方式

- 在核心包中添加技术栈检测模块
- 当用户安装核心包时，自动运行检测
- 根据检测结果，推荐安装相应的插件包
- 提供手动指定技术栈的选项

## 7. 文档和示例

1. 为每个插件包编写详细的 README.md
2. 提供使用示例
3. 添加集成指南
4. 编写技术栈自动检测功能的使用指南

## 8. 发布计划

1. 首先发布核心包的更新版本
2. 然后发布各个插件包
3. 更新主 README.md，添加新插件的链接

## 9. 技术栈更新

### 9.1 OXC 技术栈替换

将项目中的 eslint 和 prettier 替换为 OXC 技术栈：

- **OXC Linter**：替代 eslint，提供更快的代码检查速度
- **OXC Formatter**：替代 prettier，提供更快的代码格式化速度
- **OXC Parser**：提供更快的代码解析能力

### 9.2 迁移计划

1. 移除项目中的 eslint 和 prettier 依赖
2. 添加 OXC 相关依赖
3. 配置 OXC 规则，保持与原有 eslint/prettier 配置的兼容性
4. 更新 package.json 中的脚本命令
5. 运行 OXC 工具验证配置

## 10. 结论

通过创建独立的插件包，可以为不同技术栈的用户提供更好的使用体验，同时保持核心逻辑的一致性和可维护性。这种方案虽然需要维护多个包，但模块化程度高，用户可以按需安装，符合现代前端工具的设计理念。

同时，通过引入 OXC 技术栈，可以显著提高代码检查和格式化的速度，提升开发效率。