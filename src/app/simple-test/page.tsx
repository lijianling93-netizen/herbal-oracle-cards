"use client";

import { useState } from "react";

export default function SimpleTestPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'creating' | 'testing' | 'done'>('idle');

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev]);
  };

  const runFullTest = async () => {
    setLogs([]);
    setStatus('creating');

    // 测试账号信息
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'password123';

    addLog("========================================");
    addLog("开始完整测试流程");
    addLog("========================================\n");

    // 步骤 1: 检查当前 URL
    const currentUrl = window.location.href;
    addLog(`步骤 1: 检查 URL`);
    addLog(`  当前 URL: ${currentUrl}`);

    if (!currentUrl.includes('localhost')) {
      addLog(`  ❌ 未使用 localhost！请使用 http://localhost:5000`);
      setStatus('done');
      return;
    }
    addLog(`  ✅ 使用 localhost\n`);

    // 步骤 2: 清除 Cookies
    addLog(`步骤 2: 清除浏览器 Cookies`);
    document.cookie.split(";").forEach(c => {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    addLog(`  ✅ 已清除\n`);

    await new Promise(resolve => setTimeout(resolve, 500));

    // 步骤 3: 注册新账号
    addLog(`步骤 3: 注册新账号`);
    addLog(`  邮箱: ${testEmail}`);
    addLog(`  密码: ${testPassword}`);

    try {
      const registerResponse = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: testEmail,
          password: testPassword,
          username: '测试用户',
        }),
      });

      const registerData = await registerResponse.json();

      addLog(`  响应状态: ${registerResponse.status}`);
      addLog(`  success: ${registerData.success}`);
      addLog(`  user: ${registerData.user ? JSON.stringify(registerData.user, null, 2) : '(无)'}`);
      addLog(`  error: ${registerData.error || '(无)'}`);

      if (!registerResponse.ok || !registerData.success) {
        addLog(`  ❌ 注册失败！`);
        setStatus('done');
        return;
      }

      addLog(`  ✅ 注册成功！`);
      addLog(`  用户ID: ${registerData.user.id}\n`);

    } catch (error: any) {
      addLog(`  ❌ 注册出错: ${error.message}`);
      setStatus('done');
      return;
    }

    await new Promise(resolve => setTimeout(resolve, 1000));

    // 步骤 4: 检查 Cookies
    addLog(`步骤 4: 检查 Cookies`);
    const hasCookie = document.cookie.includes('auth-token');
    addLog(`  document.cookie: ${document.cookie.substring(0, 100) || '(空)'}`);
    addLog(`  包含 auth-token: ${hasCookie}`);

    if (!hasCookie) {
      addLog(`  ⚠️ Cookie 未被保存，但继续测试...`);
    } else {
      addLog(`  ✅ Cookie 已保存\n`);
    }

    setStatus('testing');
    await new Promise(resolve => setTimeout(resolve, 500));

    // 步骤 5: 测试登录
    addLog(`步骤 5: 测试登录`);

    try {
      const loginResponse = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: testEmail,
          password: testPassword,
        }),
      });

      const loginData = await loginResponse.json();

      addLog(`  响应状态: ${loginResponse.status}`);
      addLog(`  success: ${loginData.success}`);
      addLog(`  user: ${loginData.user ? JSON.stringify(loginData.user, null, 2) : '(无)'}`);
      addLog(`  error: ${loginData.error || '(无)'}`);

      if (!loginResponse.ok || !loginData.success) {
        addLog(`  ❌ 登录失败！`);
        setStatus('done');
        return;
      }

      addLog(`  ✅ 登录成功！\n`);

    } catch (error: any) {
      addLog(`  ❌ 登录出错: ${error.message}`);
      setStatus('done');
      return;
    }

    await new Promise(resolve => setTimeout(resolve, 1000));

    // 步骤 6: 再次检查 Cookies
    addLog(`步骤 6: 再次检查 Cookies`);
    const hasCookieAfterLogin = document.cookie.includes('auth-token');
    addLog(`  包含 auth-token: ${hasCookieAfterLogin}`);

    if (!hasCookieAfterLogin) {
      addLog(`  ❌ Cookie 仍然未保存！`);
      addLog(`\n问题诊断：`);
      addLog(`- 浏览器阻止了 Cookie 的设置`);
      addLog(`- 可能原因：浏览器安全设置、隐私扩展等`);
      addLog(`\n解决方案：`);
      addLog(`1. 使用无痕模式测试`);
      addLog(`2. 禁用隐私扩展`);
      addLog(`3. 检查浏览器 Cookie 设置`);
      setStatus('done');
      return;
    }

    addLog(`  ✅ Cookie 已保存！\n`);

    // 步骤 7: 测试 /api/auth/me
    addLog(`步骤 7: 测试 /api/auth/me`);

    try {
      const authMeResponse = await fetch('/api/auth/me', {
        credentials: 'include',
      });

      const authMeData = await authMeResponse.json();

      addLog(`  响应状态: ${authMeResponse.status}`);
      addLog(`  success: ${authMeData.success}`);
      addLog(`  user: ${authMeData.user ? JSON.stringify(authMeData.user, null, 2) : '(无)'}`);
      addLog(`  error: ${authMeData.error || '(无)'}`);

      if (!authMeResponse.ok || !authMeData.success) {
        addLog(`  ❌ 认证失败！`);
        setStatus('done');
        return;
      }

      addLog(`  ✅ 认证成功！\n`);

    } catch (error: any) {
      addLog(`  ❌ 认证出错: ${error.message}`);
      setStatus('done');
      return;
    }

    addLog(`========================================`);
    addLog(`🎉 所有测试通过！登录功能正常。`);
    addLog(`\n测试账号信息：`);
    addLog(`邮箱: ${testEmail}`);
    addLog(`密码: ${testPassword}`);
    addLog(`\n现在你可以用这个账号登录应用了！`);
    addLog(`========================================`);

    setStatus('done');
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '1.5rem' }}>🧪 登录功能完整测试</h1>

      {/* 警告提示 */}
      <div style={{
        background: '#fff3cd',
        border: '2px solid #ffc107',
        borderRadius: '8px',
        padding: '1rem',
        marginBottom: '1.5rem'
      }}>
        <h3 style={{ marginTop: 0, marginBottom: '0.5rem' }}>⚠️ 重要提示</h3>
        <p style={{ margin: 0 }}>
          此页面会自动注册一个测试账号并测试完整的登录流程。
          <strong>必须使用 http://localhost:5000 访问！</strong>
        </p>
      </div>

      {/* 测试按钮 */}
      <button
        onClick={runFullTest}
        disabled={status !== 'idle'}
        style={{
          padding: '1rem 2rem',
          background: status === 'idle' ? '#4a7c59' : '#ccc',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: status === 'idle' ? 'pointer' : 'not-allowed',
          fontSize: '1.1rem',
          fontWeight: 'bold',
          marginBottom: '1.5rem'
        }}
      >
        {status === 'idle' ? '🚀 开始测试' :
         status === 'creating' ? '⏳ 注册中...' :
         status === 'testing' ? '⏳ 测试中...' :
         '✅ 测试完成'}
      </button>

      {/* 进度提示 */}
      {status !== 'idle' && status !== 'done' && (
        <div style={{
          background: '#e7f3ff',
          border: '2px solid #007bff',
          borderRadius: '8px',
          padding: '1rem',
          marginBottom: '1.5rem'
        }}>
          <p style={{ margin: 0 }}>
            {status === 'creating' && '正在注册测试账号...'}
            {status === 'testing' && '正在测试登录功能...'}
          </p>
        </div>
      )}

      {/* 测试结果 */}
      {status === 'done' && (
        <div style={{
          background: logs.some(l => l.includes('🎉')) ? '#d4edda' : '#f8d7da',
          border: `2px solid ${logs.some(l => l.includes('🎉')) ? '#28a745' : '#dc3545'}`,
          borderRadius: '8px',
          padding: '1rem',
          marginBottom: '1.5rem'
        }}>
          <h3 style={{ marginTop: 0, marginBottom: '0.5rem' }}>
            {logs.some(l => l.includes('🎉')) ? '🎉 测试通过' : '❌ 测试失败'}
          </h3>
          <p style={{ margin: 0 }}>
            {logs.some(l => l.includes('🎉'))
              ? '所有功能正常！你可以使用测试账号登录了。'
              : '请查看下方的详细日志，找出问题所在。'}
          </p>
        </div>
      )}

      {/* 日志输出 */}
      <div style={{
        background: '#1e1e1e',
        color: '#d4d4d4',
        padding: '1rem',
        borderRadius: '8px',
        maxHeight: '600px',
        overflowY: 'auto',
        fontSize: '0.85rem'
      }}>
        <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {logs.join('\n') || '(暂无日志)'}
        </pre>
      </div>
    </div>
  );
}
