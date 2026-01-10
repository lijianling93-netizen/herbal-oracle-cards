"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function DebugLoginPage() {
  const { user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [logs, setLogs] = useState<string[]>([]);
  const [testResults, setTestResults] = useState<any>(null);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev]);
  };

  const clearLogs = () => setLogs([]);

  const testUserState = () => {
    addLog("=== 检查用户状态 ===");
    addLog(`loading: ${loading}`);
    addLog(`user: ${user ? JSON.stringify(user, null, 2) : '(null)'}`);
    addLog(`user.id: ${user?.id || '(未定义)'}`);
    addLog(`user.email: ${user?.email || '(未定义)'}`);
  };

  const testBrowserCookies = () => {
    addLog("=== 检查浏览器 Cookies ===");
    if (typeof window === 'undefined') {
      addLog("⚠️ 非浏览器环境，无法访问 document");
      return;
    }
    addLog(`document.cookie: ${document.cookie.substring(0, 200) || '(空)'}`);
    addLog(`包含 auth-token: ${document.cookie.includes('auth-token')}`);

    if (document.cookie.includes('auth-token')) {
      const match = document.cookie.match(/auth-token=([^;]+)/);
      if (match) {
        addLog(`auth-token 长度: ${match[1].length}`);
        addLog(`auth-token 前30字符: ${match[1].substring(0, 30)}...`);
      }
    }
  };

  const testLoginAPI = async () => {
    addLog("=== 测试登录 API ===");

    try {
      addLog(`POST /api/auth/login`);
      addLog(`  邮箱: ${email}`);
      addLog(`  密码: ${password ? '***' : '(空)'}`);

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      addLog(`  响应状态: ${response.status} ${response.statusText}`);

      const data = await response.json();
      addLog(`  success: ${data.success}`);
      addLog(`  user: ${data.user ? JSON.stringify(data.user, null, 2) : '(无)'}`);
      addLog(`  error: ${data.error || '(无)'}`);

      // 检查响应头
      const setCookie = response.headers.get('set-cookie');
      addLog(`  Set-Cookie 头: ${setCookie ? '(存在)' : '(不存在)'}`);
      if (setCookie) {
        addLog(`  Set-Cookie 内容: ${setCookie.substring(0, 100)}...`);
      }

      setTestResults({ response: { status: response.status, data, setCookie } });

      // 等待 1 秒后检查 Cookie
      addLog("\n等待 1 秒后检查 Cookie...");
      await new Promise(resolve => setTimeout(resolve, 1000));
      testBrowserCookies();

    } catch (error: any) {
      addLog(`❌ 错误: ${error.message}`);
    }
  };

  const testAuthMeAPI = async () => {
    addLog("=== 测试 /api/auth/me ===");

    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
      });

      addLog(`  响应状态: ${response.status} ${response.statusText}`);

      const data = await response.json();
      addLog(`  success: ${data.success}`);
      addLog(`  user: ${data.user ? JSON.stringify(data.user, null, 2) : '(无)'}`);
      addLog(`  error: ${data.error || '(无)'}`);

      setTestResults({ authMe: { status: response.status, data } });

    } catch (error: any) {
      addLog(`❌ 错误: ${error.message}`);
    }
  };

  const runFullTest = async () => {
    clearLogs();
    addLog("========================================");
    addLog("开始完整测试流程");
    addLog("========================================\n");

    // 1. 初始状态
    addLog("步骤 1: 检查初始状态");
    testUserState();
    testBrowserCookies();

    await new Promise(resolve => setTimeout(resolve, 500));

    // 2. 登录
    addLog("\n步骤 2: 执行登录");
    await testLoginAPI();

    await new Promise(resolve => setTimeout(resolve, 1000));

    // 3. 检查 AuthContext 状态
    addLog("\n步骤 3: 检查 AuthContext 状态");
    testUserState();

    await new Promise(resolve => setTimeout(resolve, 500));

    // 4. 测试 /api/auth/me
    addLog("\n步骤 4: 测试 /api/auth/me");
    await testAuthMeAPI();

    addLog("\n========================================");
    addLog("测试完成！");
    addLog("========================================");
  };

  const simulateCardInterpretation = async () => {
    addLog("=== 模拟 CardInterpretation 保存流程 ===");

    if (!user) {
      addLog("❌ 用户未登录（AuthContext）");
      return;
    }

    addLog(`✅ AuthContext 用户: ${user.email}`);

    // 模拟验证用户状态
    addLog("\n步骤 1: 调用 /api/auth/me 验证用户状态");

    const verifyResponse = await fetch('/api/auth/me', {
      credentials: 'include',
    });

    addLog(`  响应状态: ${verifyResponse.status}`);

    const verifyData = await verifyResponse.json();
    addLog(`  success: ${verifyData.success}`);
    addLog(`  user: ${verifyData.user ? '(存在)' : '(不存在)'}`);

    if (!verifyData.success || !verifyData.user) {
      addLog(`❌ 验证失败: ${verifyData.error}`);
      return;
    }

    addLog("✅ 验证成功！");

    // 模拟保存
    addLog("\n步骤 2: 调用 /api/history 保存");

    const saveResponse = await fetch('/api/history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        cards: [1], // 使用数字而非字符串
        intention: '测试意图',
      }),
    });

    addLog(`  响应状态: ${saveResponse.status}`);

    const saveData = await saveResponse.json();
    addLog(`  success: ${saveData.success}`);
    addLog(`  error: ${saveData.error || '(无)'}`);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '1.5rem' }}>🔍 登录调试页面</h1>

      {/* 重要提示 */}
      <div style={{
        background: '#fff3cd',
        border: '2px solid #ffc107',
        borderRadius: '8px',
        padding: '1rem',
        marginBottom: '1.5rem'
      }}>
        <h3 style={{ marginTop: 0 }}>⚠️ 重要提示</h3>
        <ul style={{ marginBottom: 0 }}>
          <li>必须使用 <strong>http://localhost:5000/debug-login</strong> 访问此页面</li>
          <li>不能使用 IP 地址（如 127.0.0.1）</li>
        </ul>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* 左侧：表单 */}
        <div>
          <h2 style={{ marginTop: 0 }}>测试账号</h2>
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
          </div>
        </div>

        {/* 右侧：当前状态 */}
        <div>
          <h2 style={{ marginTop: 0 }}>当前状态</h2>
          <div style={{ background: '#f5f5f5', padding: '1.5rem', borderRadius: '8px' }}>
            <div style={{ marginBottom: '0.5rem' }}>
              <strong>AuthContext loading:</strong> {loading ? 'true' : 'false'}
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              <strong>AuthContext user:</strong> {user ? JSON.stringify(user, null, 2) : '(null)'}
            </div>
            <div style={{ marginBottom: '0.5rem' }}>
              <strong>浏览器 Cookies:</strong>
            </div>
            <pre style={{ fontSize: '0.85rem', margin: 0, overflowX: 'auto' }}>
              {typeof window !== 'undefined' ? document.cookie : '(服务端渲染)'}
            </pre>
          </div>
        </div>
      </div>

      {/* 操作按钮 */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        <button
          onClick={runFullTest}
          disabled={!email || !password}
          style={{
            padding: '0.75rem 1.5rem',
            background: !email || !password ? '#ccc' : '#4a7c59',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: !email || !password ? 'not-allowed' : 'pointer',
            fontWeight: 'bold'
          }}
        >
          🚀 运行完整测试
        </button>

        <button
          onClick={testUserState}
          style={{
            padding: '0.75rem 1.5rem',
            background: '#c9a961',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          👤 检查用户状态
        </button>

        <button
          onClick={testBrowserCookies}
          style={{
            padding: '0.75rem 1.5rem',
            background: '#6b8e5f',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          🍪 检查 Cookies
        </button>

        <button
          onClick={testAuthMeAPI}
          style={{
            padding: '0.75rem 1.5rem',
            background: '#3d3528',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          🔐 测试 /api/auth/me
        </button>

        <button
          onClick={simulateCardInterpretation}
          style={{
            padding: '0.75rem 1.5rem',
            background: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          🎴 模拟占卜保存
        </button>

        <button
          onClick={clearLogs}
          style={{
            padding: '0.75rem 1.5rem',
            background: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          🗑️ 清空日志
        </button>
      </div>

      {/* 日志输出 */}
      <div style={{ background: '#1e1e1e', color: '#d4d4d4', padding: '1rem', borderRadius: '8px', maxHeight: '500px', overflowY: 'auto' }}>
        <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: '0.85rem' }}>
          {logs.join('\n') || '(暂无日志)'}
        </pre>
      </div>

      {/* 测试结果 */}
      {testResults && (
        <div style={{ marginTop: '1.5rem', background: '#f5f5f5', padding: '1rem', borderRadius: '8px' }}>
          <h3 style={{ marginTop: 0 }}>测试结果</h3>
          <pre style={{ overflowX: 'auto' }}>
            {JSON.stringify(testResults, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
