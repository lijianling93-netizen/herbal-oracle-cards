"use client";

import { useState, useEffect } from "react";

export default function DebugPage() {
  const [cookies, setCookies] = useState<any[]>([]);
  const [authResponse, setAuthResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkCookies = async () => {
    try {
      const response = await fetch('/api/auth/debug');
      const data = await response.json();
      setCookies(data.cookies || []);
    } catch (error) {
      console.error('获取 Cookie 失败:', error);
    }
  };

  const testAuth = async () => {
    setLoading(true);
    try {
      console.log('[Debug] 开始测试认证...');
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
      });
      console.log('[Debug] 响应状态:', response.status);
      console.log('[Debug] 响应头:', Object.fromEntries(response.headers.entries()));

      const data = await response.json();
      console.log('[Debug] 响应数据:', data);
      setAuthResponse({
        status: response.status,
        ok: response.ok,
        data: data,
      });
    } catch (error) {
      console.error('[Debug] 测试失败:', error);
      setAuthResponse({ error: String(error) });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkCookies();
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
      <h1>🔧 调试页面</h1>

      <section style={{ marginBottom: '2rem' }}>
        <h2>1. Cookies 检查</h2>
        <button onClick={checkCookies}>刷新 Cookies</button>
        <div style={{ marginTop: '1rem', background: '#f5f5f5', padding: '1rem' }}>
          {cookies.length === 0 ? (
            <p>没有找到 Cookies</p>
          ) : (
            <pre>{JSON.stringify(cookies, null, 2)}</pre>
          )}
        </div>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2>2. 认证测试</h2>
        <button onClick={testAuth} disabled={loading}>
          {loading ? '测试中...' : '测试 /api/auth/me'}
        </button>
        <div style={{ marginTop: '1rem', background: '#f5f5f5', padding: '1rem' }}>
          {authResponse ? (
            <pre>{JSON.stringify(authResponse, null, 2)}</pre>
          ) : (
            <p>点击按钮测试</p>
          )}
        </div>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2>3. 浏览器 Cookies (Document)</h2>
        <div style={{ marginTop: '1rem', background: '#f5f5f5', padding: '1rem' }}>
          <pre>
            {typeof window !== 'undefined' ? document.cookie : '(服务端渲染)'}
          </pre>
        </div>
      </section>

      <section>
        <h2>4. 说明</h2>
        <ul>
          <li>如果 Cookies 检查显示没有 auth-token，说明登录未成功或 Cookie 未设置</li>
          <li>如果认证测试返回 401，说明 Cookie 未正确发送到后端</li>
          <li>如果认证测试返回 200 但 success 为 false，说明后端验证逻辑有问题</li>
        </ul>
      </section>
    </div>
  );
}
