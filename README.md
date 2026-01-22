# PWA

## PWA Manifest 文件的核心结构

manifest.json 是一个 JSON 格式的文件，包含了 PWA 的元数据，浏览器通过它识别应用并提供“安装到桌面”等能力。以下是完整且符合最佳实践的结构示例，同时解释每个核心字段的作用：

1. 基础结构示例（可直接复用）
```json
{
  "name": "我的 PWA 应用",                // 必填：应用全称（安装/启动时显示）
  "short_name": "PWA 应用",              // 可选：短名称（桌面图标下方显示，优先展示）
  "description": "一个示例 PWA 应用，演示 manifest 配置", // 可选：应用描述
  "start_url": "/?source=pwa",           // 必填：应用启动时加载的 URL（相对/绝对路径）
  "display": "standalone",               // 必填：应用显示模式
  "background_color": "#ffffff",         // 可选：启动页背景色（应用加载前显示）
  "theme_color": "#2196F3",              // 可选：应用主题色（影响状态栏/标题栏）
  "orientation": "portrait-primary",     // 可选：强制屏幕方向
  "scope": "/",                          // 可选：应用的作用域（限制导航范围）
  "lang": "zh-CN",                       // 可选：应用默认语言
  "dir": "ltr",                          // 可选：文本方向（ltr/rtl）
  "icons": [                             // 可选但建议：应用图标（多尺寸适配不同设备）
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable any"          // 可选：图标用途（maskable=适配圆角，any=通用）
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable any"
    }
  ],
  "screenshots": [                       // 可选：应用截图（应用商店展示）
    {
      "src": "/screenshots/screen-1.png",
      "sizes": "1280x720",
      "type": "image/png",
      "label": "首页截图"
    }
  ],
  "categories": ["productivity", "tools"],// 可选：应用分类（应用商店归类）
  "prefer_related_applications": false    // 可选：是否优先推荐关联的原生应用
}
```
2. 核心字段详细解释

| 字段  | 是否必填 | 说明   | 常用值/示例|
| --- | --- | --- | --- |
| name             | 是           | 应用全称（安装弹窗、应用列表展示）          | `"我的 PWA 应用"`|
| short_name       | 否           | 短名称（桌面图标、状态栏显示，建议≤12字符） | `"PWA 应用"`     |
| start_url        | 是           | 应用启动时加载的 URL（相对/绝对路径）       | `"/?pwa=1"`、`"https://example.com"` |
| display          | 是           | 应用显示模式（决定是否显示浏览器导航栏）    | `fullscreen`：全屏<br>`standalone`：独立窗口（推荐）<br>`minimal-ui`：极简UI<br>`browser`：浏览器模式 |
| background_color | 否           | 启动页背景色（应用加载前的过渡背景）        | `"#ffffff"`、`"#2196F3"`                                                                              |
| theme_color      | 否           | 应用主题色（影响浏览器状态栏、标题栏颜色）  | `"#2196F3"`（Material 蓝）                                                                            |
| icons            | 否（但建议） | 应用图标（多尺寸适配不同设备/平台）         | 至少包含 192x192 和 512x512 尺寸                                                                      |
| scope            | 否           | 应用的作用域（限制 PWA 能导航范围）         | `"/"`（整站）、`"/app/"`（仅 app 目录）                                                               |
| orientation      | 否           | 强制屏幕方向                                | `portrait-primary`（竖屏）、`landscape`（横屏）                                                       |

3. 关键注意事项

- 文件位置：建议放在项目根目录，且在 HTML 中通过 <link rel="manifest" href="/manifest.json"> 引入。

- 图标要求：

  - 至少提供 192x192（手机）和 512x512（桌面/安装弹窗）两种尺寸；

  - purpose: "maskable" 适配安卓设备的圆角图标裁剪，建议添加。

- MIME 类型：服务器需返回 Content-Type: application/manifest+json（Nginx/Apache 可配置）。

- 兼容性：部分字段（如 screenshots、categories）仅在部分应用商店/浏览器（如 Chrome Web Store）生效。

**总结**

1. PWA manifest.json 的必填核心字段为 name、start_url、display，是实现 PWA 安装能力的基础；

2. icons 字段虽非必填，但必须配置多尺寸图标才能让 PWA 在不同设备上正常显示；

3. display: standalone 是最常用的显示模式，能让 PWA 拥有接近原生应用的体验，theme_color 和 background_color 则决定了应用的视觉一致性。

## Service Worker

Service Worker 是 PWA 的离线缓存机制，它可以在浏览器离线时提供服务，也可以在浏览器在线时提供服务。

Service Worker 工作时，会监听网络请求，如果请求的资源在缓存中，则返回缓存中的资源，如果请求的资源不在缓存中，则请求网络资源，并缓存资源。即 缓存代替网络请求，保存应用离线使用。

Service Worker 通常会配合 Caches API 或 IndexedDB 等本地存储机制一起使用，以实现离线缓存和数据持久化。

### Service Worker 和 web worker 的区别

| 特性	| Service Worker	| Web Worker |
| --- | --- | --- |
| 主要用途	| 离线缓存、网络代理、推送通知、后台同步	| 后台执行复杂计算，提高响应性 |
| 网络访问	| 拦截、修改、响应网络请求 (fetch)	| 不能直接访问网络请求 |
| DOM访问	| 无法直接访问 DOM	| 无法直接访问 DOM |
| 生命周期	| 独立于页面，持续运行	| 随页面关闭而结束 |
| 适用范围	| 整个域，服务多个页面	| 仅限创建它的页面 |