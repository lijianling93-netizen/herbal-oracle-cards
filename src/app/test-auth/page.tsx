"use client";

import { useState } from "react";

export default function TestAuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev]);
  };

  const clearLogs = () => setLogs([]);

  const checkCookies = () => {
    addLog("=== 检查浏览器 Cookies ===");
    addLog(`document.cookie: ${document.cookie.substring(0, 200) || "(空)"}`);

    const hasAuthToken = document.cookie.includes('auth-token');
    addLog(`auth-token 存在: ${hasAuthToken}`);

    if (hasAuthToken) {
      const match = document.cookie.match(/auth-token=([^;]+)/);
      if (match) {
        addLog(`auth-token 长度: ${match[1].length}`);
        addLog(`auth-token 前缀: ${match[1].substring(0, 30)}...`);
      }
    }
  };

  const testLogin = async () => {
    setLoading(true);
    addLog("=== 开始登录测试 ===");

    try {
      addLog(`POST /api/auth/login`);
      addLog(`  邮箱: ${email}`);

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      addLog(`  响应状态: ${response.status} ${response.statusText}`);
      addLog(`  Content-Type: ${response.headers.get('content-type')}`);

      const data = await response.json();
      addLog(`  响应数据: ${JSON.stringify(data, null, 2)}`);

      if (data.success) {
        addLog("✅ 登录成功！");
      } else {
        addLog(`❌ 登录失败: ${data.error}`);
      }

      // 等待 1 秒后检查 Cookie
      addLog("等待 1 秒后检查 Cookie...");
      await new Promise(resolve => setTimeout(resolve, 1000));
      checkCookies();
    } catch (error: any) {
      addLog(`❌ 登录出错: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testAuthMe = async () => {
    addLog("=== 测试 /api/auth/me ===");

    try {
      addLog("发送请求...");

      const response = await fetch('/api/auth/me', {
        credentials: 'include',
      });

      addLog(`  响应状态: ${response.status} ${response.statusText}`);
      addLog(`  Content-Type: ${response.headers.get('content-type')}`);

      const data = await response.json();
      addLog(`  响应数据: ${JSON.stringify(data, null, 2)}`);

      if (data.success) {
        addLog("✅ 认证成功！");
      } else {
        addLog(`❌ 认证失败: ${data.error}`);
      }
    } catch (error: any) {
      addLog(`❌ 请求出错: ${error.message}`);
    }
  };

  const testDebug = async () => {
    addLog("=== 测试 /api/auth/debug ===");

    try {
      const response = await fetch('/api/auth/debug');
      const data = await response.json();
      addLog(`后端 Cookies: ${JSON.stringify(data, null, 2)}`);
    } catch (error: any) {
      addLog(`❌ 请求出错: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace', maxWidth: '900px', margin: '0 auto' }}>
      <h1>🧪 登录与 Cookie 测试页面</h1>

      {/* 重要提示 */}
      <div style={{
        background: '#fff3cd',
        border: '1px solid #ffc107',
        borderRadius: '8px',
        padding: '1rem',
        marginBottom: '2rem'
      }}>
        <h3 style={{ marginTop: 0 }}>⚠️ 重要提示</h3>
        <ul style={{ marginBottom: 0 }}>
          <li>请使用 <strong>http://localhost:5000</strong> 访问应用，而非 IP 地址（如 127.0.0.1）</li>
          <li>Cookie 仅在 localhost 域名下正常工作</li>
          <li>如果遇到 Cookie 问题，请检查浏览器开发者工具的 Application &gt; Cookies</li>
        </ul>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        {/* 左侧：登录表单 */}
        <div>
          <h2>1. 登录测试</h2>
          <div style={{ background: '#f5f5f5', padding: '1.5rem', borderRadius: '8px' }}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>邮箱:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', boxSizing: 'border-box' }}
                placeholder="test@example.com"
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>密码:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', boxSizing: 'border-box' }}
                placeholder="password"
              />
            </div>
            <button
              onClick={testLogin}
              disabled={loading}
              style={{
                padding: '0.75rem 1.5rem',
                background: loading ? '#ccc' : '#4a7c59',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? '登录中...' : '登录并检查 Cookie'}
            </button>
          </div>
        </div>

        {/* 右侧：诊断按钮 */}
        <div>
          <h2>2. 诊断工具</h2>
          <div style={{ background: '#f5f5f5', padding: '1.5rem', borderRadius: '8px' }}>
            <button
              onClick={checkCookies}
              style={{
                display: 'block',
                width: '100%',
                padding: '0.75rem',
                marginBottom: '0.5rem',
                background: '#c9a961',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              🔍 检查浏览器 Cookies
            </button>
            <button
              onClick={testAuthMe}
              style={{
                display: 'block',
                width: '100%',
                padding: '0.75rem',
                marginBottom: '0.5rem',
                background: '#6b8e5f',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              🧪 测试 /api/auth/me
            </button>
            <button
              onClick={testDebug}
              style={{
                display: 'block',
                width: '100%',
                padding: '0.75rem',
                background: '#3d3528',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              📡 测试 /api/auth/debug
            </button>
            <button
              onClick={clearLogs}
              style={{
                display: 'block',
                width: '100%',
                padding: '0.75rem',
                background: '#8b8176',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              🗑️ 清空日志
            </button>
          </div>
        </div>
      </div>

      {/* 日志输出 */}
      <div style={{ marginBottom: '2rem' }}>
        <h2>3. 日志输出</h2>
        <div
          style={{
            background: '#1e1e1e',
            color: '#d4d4d4',
            padding: '1.5rem',
            borderRadius: '8px',
            minHeight: '400px',
            maxHeight: '600px',
            overflowY: 'auto',
            fontFamily: 'Courier New, monospace',
            fontSize: '0.9rem',
            lineHeight: '1.6'
          }}
        >
          {logs.length === 0 ? (
            <div style={{ color: '#888' }}>暂无日志，请执行测试...</div>
          ) : (
            logs.map((log, idx) => (
              <div key={idx} style={{ marginBottom: '0.5rem' }}>
                {log}
              </div>
            ))
          )}
        </div>
      </div>

      {/* 使用说明 */}
      <div style={{ background: '#fff3cd', padding: '1.5rem', borderRadius: '8px', border: '1px solid #ffc107' }}>
        <h3 style={{ marginTop: 0 }}>📝 使用说明</h3>
        <ol style={{ marginBottom: 0, paddingLeft: '1.5rem' }}>
          <li style={{ marginBottom: '0.5rem' }}>确保使用 <code>http://localhost:5000</code> 访问（不是 IP 地址）</li>
          <li style={{ marginBottom: '0.5rem' }}>输入测试账号的邮箱和密码</li>
          <li style={{ marginBottom: '0.5rem' }}>点击"登录并检查 Cookie"</li>
          <li style={{ marginBottom: '0.5rem' }}>登录后点击"测试 /api/auth/me"验证 Cookie 是否有效</li>
          <li>如果测试失败，请查看日志并复制完整的错误信息</li>
        </ol>
      </div>
    </div>
  );
}
