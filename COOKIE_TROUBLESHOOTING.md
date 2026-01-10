# Cookie 认证问题排查指南

## 快速诊断步骤

### 1. 使用诊断工具

访问 `http://localhost:5000/diagnose` 并运行完整诊断。这个工具会检查：
- ✅ 数据库连接
- ✅ 用户凭证验证
- ✅ Token 生成
- ✅ Token 验证
- ✅ Cookie 设置
- ✅ Cookie 读取
- ✅ 用户信息获取

**重要**：必须使用 `localhost`，不能使用 IP 地址（如 `127.0.0.1`）！

### 2. 检查浏览器开发者工具

打开浏览器开发者工具（F12）：

#### Application 标签
- 导航到 Application > Cookies > http://localhost:5000
- 检查 `auth-token` Cookie 是否存在
- 确认 Cookie 的 Domain 是 `localhost`
- 确认 Cookie 的 HttpOnly 选项已勾选
- 确认 Cookie 的 SameSite 是 `Lax`

#### Console 标签
- 查看是否有错误信息
- 查看诊断日志输出

#### Network 标签
- 切换到 Network 标签
- 执行登录操作
- 点击 `/api/auth/login` 请求
- 查看 Response Headers 中的 `Set-Cookie`
- 查看后续请求的 Request Headers 中是否包含 `Cookie` 头

## 常见问题与解决方案

### 问题 1: Cookie 未被设置

**症状**：
- 浏览器 Application > Cookies 中没有 `auth-token`
- Network 标签中 Response Headers 没有 `Set-Cookie`

**可能原因**：
1. 使用了 IP 地址而非 `localhost`
2. 浏览器阻止了 Cookie
3. Cookie 设置参数不正确

**解决方案**：
```bash
# 1. 确认访问 URL 是 http://localhost:5000
# ❌ 错误: http://127.0.0.1:5000
# ✅ 正确: http://localhost:5000

# 2. 清除浏览器 Cookies
# Application > Cookies > 右键 > Clear

# 3. 尝试无痕模式
# Chrome: Ctrl+Shift+N
# Firefox: Ctrl+Shift+P

# 4. 检查浏览器设置
# Settings > Privacy and security > Cookies and other site data
# 确保 "Block third-party cookies" 未勾选
```

### 问题 2: Cookie 已设置但未发送

**症状**：
- Application > Cookies 中有 `auth-token`
- Network 标签中 Request Headers 没有 `Cookie` 头

**可能原因**：
1. `credentials: 'include'` 未设置
2. Cookie 的 Domain 设置错误
3. 跨域问题

**解决方案**：
```javascript
// 1. 确认所有 fetch 请求包含 credentials
await fetch('/api/auth/me', {
  credentials: 'include', // ✅ 必须包含
});

// 2. 检查 Cookie 的 Domain
// 应该是 "localhost" 或空（表示当前域名）
// 不应该是 "127.0.0.1" 或其他 IP

// 3. 检查 SameSite 设置
// 应该是 "Lax" 或 "None"
// 当前代码使用 "Lax"
```

### 问题 3: Token 验证失败

**症状**：
- `/api/auth/me` 返回 `{ success: false, error: "登录已过期" }`

**可能原因**：
1. Token 已过期（7天）
2. Token 格式错误
3. JWT_SECRET 不匹配

**解决方案**：
```bash
# 1. 重新登录获取新 Token

# 2. 检查 Token 格式
# 应该是三个部分，用点分隔: xxx.yyy.zzz

# 3. 检查服务器日志
# 查看 "[Auth Me API] Token 验证失败" 日志
```

### 问题 4: 用户状态验证失败

**症状**：
- `/api/auth/me` 返回 `{ success: false, error: "用户不存在" }`

**可能原因**：
1. 用户被删除
2. Token 中的 userId 不正确
3. 数据库连接失败

**解决方案**：
```bash
# 1. 检查数据库中用户是否存在
# 运行诊断工具查看 "8. 用户信息获取" 部分

# 2. 重新注册账号

# 3. 检查服务器日志
# 查看 "[Auth Me API] 用户不存在" 日志
```

## 调试技巧

### 1. 查看浏览器 Cookie

```javascript
// 在浏览器控制台执行
console.log(document.cookie);

// 检查是否包含 auth-token
console.log(document.cookie.includes('auth-token'));

// 提取 auth-token
const match = document.cookie.match(/auth-token=([^;]+)/);
if (match) {
  console.log('Token 长度:', match[1].length);
  console.log('Token 前缀:', match[1].substring(0, 30) + '...');
}
```

### 2. 手动测试 API

```bash
# 测试登录
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"email":"test@example.com","password":"password"}'

# 使用 Cookie 测试 /api/auth/me
curl http://localhost:5000/api/auth/me \
  -b cookies.txt
```

### 3. 查看服务器日志

```bash
# 在项目目录下查看日志
tail -f logs/server.log

# 或者查看终端输出
```

## 诊断工具输出解读

诊断工具会输出 8 个步骤的详细结果：

1. **数据库连接测试**: 检查数据库是否可访问
2. **用户凭证验证**: 验证邮箱和密码是否正确
3. **Token 生成测试**: 检查 JWT Token 生成是否正常
4. **Token 验证测试**: 检查生成的 Token 是否可以验证
5. **Cookie 设置测试**: 检查 Cookie 是否正确设置到响应中
6. **请求 Cookie 检查**: 检查当前请求中是否包含 Cookie
7. **Cookie 验证模拟**: 检查 Cookie 中的 Token 是否有效
8. **用户信息获取**: 检查能否从 Token 获取用户信息

### 全部通过 ✅

说明后端逻辑正常，问题可能是：
- Cookie 在浏览器中被阻止
- 使用了 IP 地址而非 localhost
- 前端代码未正确发送 Cookie

### 部分失败 ⚠️

查看具体的失败步骤，根据上面的解决方案修复。

## 开发环境注意事项

### Cookie 设置

当前代码的 Cookie 设置：
```typescript
{
  httpOnly: true,  // ✅ 防止 XSS
  secure: false,   // ✅ 开发环境不需要 HTTPS
  sameSite: "lax", // ✅ 允许跨站导航时发送
  maxAge: 60 * 60 * 24 * 7, // 7天
  path: "/",       // ✅ 全站可用
}
```

### 生产环境修改

部署到生产环境时需要修改：
```typescript
{
  httpOnly: true,
  secure: true,    // ✅ 生产环境使用 HTTPS
  sameSite: "lax",
  maxAge: 60 * 60 * 24 * 7,
  path: "/",
  // domain: ".yourdomain.com", // 可选：设置主域名
}
```

## 需要帮助？

如果按照上述步骤仍无法解决问题，请提供以下信息：

1. 诊断工具的完整输出（截图或复制文本）
2. 浏览器控制台的错误信息
3. Network 标签中 `/api/auth/login` 和 `/api/auth/me` 的请求详情
4. 使用的访问 URL（是 localhost 还是 IP 地址）
5. 浏览器类型和版本
