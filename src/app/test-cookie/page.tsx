"use client";

import { useState, useEffect } from "react";

export default function TestCookiePage() {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const addResult = (step: string, status: 'pass' | 'fail' | 'warn', message: string, details?: any) => {
    setTestResults(prev => [...prev, {
      step,
      status,
      message,
      details,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const runTests = async () => {
    setTestResults([]);
    setLoading(true);

    // 步骤 1: 检查浏览器 URL
    const currentUrl = window.location.href;
    const usesLocalhost = currentUrl.includes('localhost');

    if (!usesLocalhost) {
      addResult('1. URL 检查', 'fail',
        '❌ 未使用 localhost！',
        { url: currentUrl, message: '请使用 http://localhost:5000 访问' }
      );
      setLoading(false);
      return;
    } else {
      addResult('1. URL 检查', 'pass',
        '✅ 使用 localhost 访问',
        { url: currentUrl }
      );
    }

    // 步骤 2: 检查当前 Cookies
    const currentCookies = document.cookie;
    const hasToken = currentCookies.includes('auth-token');

    addResult('2. 当前 Cookies', hasToken ? 'pass' : 'warn',
      hasToken ? '✅ 浏览器中有 auth-token' : '⚠️ 浏览器中无 auth-token',
      { cookies: currentCookies.substring(0, 100) || '(空)' }
    );

    // 步骤 3: 测试登录 API（使用测试账号）
    addResult('3. 测试登录 API', 'pass', '开始测试登录...');

    try {
      const loginResponse = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: 'test@example.com', password: 'password123' })
      });

      const loginData = await loginResponse.json();

      if (loginResponse.ok && loginData.success) {
        addResult('3. 测试登录 API', 'pass',
          '✅ 登录 API 响应成功',
          { status: loginResponse.status, user: loginData.user }
        );

        // 等待 1 秒让 Cookie 生效
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 步骤 4: 再次检查 Cookies
        const newCookies = document.cookie;
        const hasNewToken = newCookies.includes('auth-token');

        addResult('4. 登录后 Cookies', hasNewToken ? 'pass' : 'fail',
          hasNewToken ? '✅ Cookie 已设置' : '❌ Cookie 未设置',
          { cookies: newCookies.substring(0, 100) || '(空)' }
        );

        if (!hasNewToken) {
          addResult('5. 问题诊断', 'fail',
            '❌ 浏览器拒绝了 Cookie！',
            {
              message: '浏览器可能阻止了 Cookie 的设置。请尝试：',
              solutions: [
                '使用无痕模式',
                '清除浏览器所有 Cookies',
                '检查浏览器 Cookie 设置',
                '确保使用 localhost 而非 IP 地址'
              ]
            }
          );
          setLoading(false);
          return;
        }

        // 步骤 5: 测试 /api/auth/me
        const authMeResponse = await fetch('/api/auth/me', {
          credentials: 'include'
        });

        const authMeData = await authMeResponse.json();

        if (authMeData.success) {
          addResult('5. 测试 /api/auth/me', 'pass',
            '✅ 认证成功！',
            { user: authMeData.user }
          );

          addResult('6. 总结', 'pass',
            '🎉 一切正常！Cookie 功能正常工作。',
            { message: '你的应用应该可以正常保存占卜记录了' }
          );
        } else {
          addResult('5. 测试 /api/auth/me', 'fail',
            '❌ 认证失败',
            { status: authMeResponse.status, error: authMeData.error }
          );
        }

      } else {
        addResult('3. 测试登录 API', 'fail',
          '❌ 登录失败（测试账号不存在）',
          { status: loginResponse.status, error: loginData.error }
        );
      }

    } catch (error: any) {
      addResult('3. 测试登录 API', 'fail',
        '❌ 请求失败',
        { error: error.message }
      );
    }

    setLoading(false);
  };

  // 页面加载时自动运行测试
  useEffect(() => {
    runTests();
  }, []);

  return (
    <div style={{
      padding: '2rem',
      fontFamily: 'monospace',
      maxWidth: '800px',
      margin: '0 auto',
      background: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <h1 style={{ marginBottom: '1.5rem' }}>🔍 Cookie 自动诊断</h1>

      <div style={{
        background: '#fff3cd',
        border: '2px solid #ffc107',
        borderRadius: '8px',
        padding: '1rem',
        marginBottom: '1.5rem'
      }}>
        <strong>重要提示：</strong>此页面会自动测试 Cookie 功能，无需手动操作。
      </div>

      <button
        onClick={runTests}
        disabled={loading}
        style={{
          padding: '0.75rem 1.5rem',
          background: loading ? '#ccc' : '#4a7c59',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '1rem',
          marginBottom: '1.5rem'
        }}
      >
        {loading ? '测试中...' : '🔄 重新运行测试'}
      </button>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {testResults.map((result, index) => {
          const colors = result.status === 'pass' ? '#d4edda' :
                         result.status === 'fail' ? '#f8d7da' : '#fff3cd';
          const borderColor = result.status === 'pass' ? '#28a745' :
                            result.status === 'fail' ? '#dc3545' : '#ffc107';
          const textColor = result.status === 'pass' ? '#155724' :
                           result.status === 'fail' ? '#721c24' : '#856404';

          return (
            <div
              key={index}
              style={{
                background: colors,
                border: `2px solid ${borderColor}`,
                borderRadius: '8px',
                padding: '1rem',
                color: textColor
              }}
            >
              <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                {result.step} - {result.message}
              </div>
              {result.details && (
                <pre style={{
                  background: 'rgba(255,255,255,0.5)',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  margin: 0,
                  fontSize: '0.85rem',
                  overflowX: 'auto'
                }}>
                  {JSON.stringify(result.details, null, 2)}
                </pre>
              )}
              <div style={{ fontSize: '0.8rem', marginTop: '0.5rem', opacity: 0.8 }}>
                {result.timestamp}
              </div>
            </div>
          );
        })}
      </div>

      {testResults.length === 0 && loading && (
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          color: '#6c757d'
        }}>
          正在运行测试...
        </div>
      )}
    </div>
  );
}
