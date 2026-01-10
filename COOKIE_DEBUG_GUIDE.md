# Cookie 调试指南

## 问题描述
- 错误：`verifyData.user: undefined`
- 原因：`/api/auth/me` 返回的 JSON 中没有 `user` 字段

## 可能的原因

### 1. Cookie 未设置
**症状**：
- 登录成功后，浏览器中没有 `auth-token` Cookie
- 或者 Cookie 被设置为 `Secure` 但页面是 HTTP

**检查方法**：
```
1. 打开开发者工具 (F12)
2. Application → Cookies → localhost:5000
3. 查看 `auth-token` Cookie 是否存在
```

**可能原因**：
- 浏览器阻止了 Cookie
- Cookie 设置失败
- 使用了 IP 地址而非 localhost

### 2. Cookie 未发送
**症状**：
- 浏览器中有 Cookie
- 但请求时没有发送到后端
- 后端日志显示"未找到 auth-token cookie"

**检查方法**：
```
1. F12 → Network 标签
2. 点击 /api/auth/me 请求
3. 查看 Request Headers 中的 Cookie 字段
```

**可能原因**：
- 缺少 `credentials: 'include'`（已修复）
- SameSite 设置错误
- 跨域问题

### 3. 后端返回格式错误
**症状**：
- Cookie 正确发送
- 但后端返回了错误响应
- 返回的是 `{ error: "未登录" }` 而非 `{ success: true, user: {...} }`

**检查方法**：
```
1. 查看控制台日志
2. 查看 [Auth Me API] 的输出
3. 检查后端日志
```

## 调试步骤

### 步骤 1：访问调试页面
```
http://localhost:5000/debug
```

### 步骤 2：检查 Cookies
点击"刷新 Cookies"按钮，查看：
- 后端是否能读取到 Cookie
- Cookie 的值是否正确

### 步骤 3：测试认证
点击"测试 /api/auth/me"按钮，查看：
- 响应状态码
- 响应数据
- 是否有 `success` 和 `user` 字段

### 步骤 4：检查浏览器 Cookies
在调试页面底部，查看 `document.cookie` 的内容

## 预期结果

### 成功场景
```
{
  "status": 200,
  "ok": true,
  "data": {
    "success": true,
    "user": {
      "id": "...",
      "email": "...",
      "username": "...",
      "avatar": null,
      "createdAt": "..."
    }
  }
}
```

### 失败场景 1：未登录
```
{
  "status": 401,
  "ok": false,
  "data": {
    "error": "未登录"
  }
}
```

### 失败场景 2：Cookie 未发送
```
控制台日志：
[Auth Me API] 未找到 auth-token cookie
[Auth Me API] Cookie 名称列表: []
```

## 解决方案

### 方案 1：清除浏览器数据
```
1. F12 → Application → Clear storage
2. 点击 "Clear site data"
3. 重新登录
```

### 方案 2：使用 localhost 而非 IP
确保访问 URL 是：
```
http://localhost:5000/  ✅
```
而不是：
```
http://127.0.0.1:5000/  ❌
http://10.0.0.1:5000/   ❌
```

### 方案 3：检查 Cookie 设置
登录时检查后端日志：
```
[Login API] Cookie 设置完成，选项: {
  httpOnly: true,
  secure: false,
  sameSite: "lax",
  maxAge: 604800,
  path: "/"
}
```

### 方案 4：禁用隐私模式
某些隐私模式会阻止 Cookie 设置。

## 完整诊断日志

### 期望看到的完整日志

#### 登录成功
```
[AuthModal] 开始登录流程
[AuthContext] 尝试登录: user@example.com
[AuthContext] 当前用户状态（登录前）: null
[Login API] ========== 登录请求开始 ==========
[Login API] 请求体: { email: 'user@example.com', hasPassword: true }
[Login API] 用户验证成功: { id: '...', email: 'user@example.com' }
[Login API] Token 生成成功，长度: 123
[Login API] 设置 Cookie...
[Login API] Cookie 设置完成，选项: { httpOnly: true, secure: false, sameSite: 'lax', maxAge: 604800, path: '/' }
[AuthContext] 登录响应: { success: true, user: {...}, token: '...' }
[AuthContext] 设置用户（登录成功）: { id: '...', email: '...' }
[AuthModal] 登录成功，准备关闭弹窗
```

#### 保存历史记录成功
```
[CardInterpretation] ========== 开始保存历史记录 ==========
[CardInterpretation] 用户状态: { id: '...', email: '...' }
[CardInterpretation] 意图: 我想了解...
[CardInterpretation] 卡牌ID: 1
[CardInterpretation] 重试次数: 0
[CardInterpretation] ========== 开始验证用户状态 ==========
[CardInterpretation] document.cookie (前50字符): auth-token=eyJhbGc...
[CardInterpretation] 验证响应状态码: 200
[CardInterpretation] 验证响应 Content-Type: application/json
[CardInterpretation] 用户状态验证结果: { success: true, user: {...} }
[CardInterpretation] 用户状态验证成功，开始保存...
[History API] 收到保存请求
[History API] Token 验证成功，userId: ...
[CardInterpretation] 保存 API 响应: { success: true, history: {...} }
[CardInterpretation] 保存成功！
```

## 下一步

1. 访问 `http://localhost:5000/debug`
2. 按照步骤测试
3. 将调试页面的输出截图或复制
4. 提供完整信息以便进一步诊断
