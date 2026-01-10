"use client";

import { useState } from "react";

interface DiagnosticSection {
  name: string;
  status: 'pass' | 'fail' | 'warn';
  data: any;
  timestamp: string;
}

interface DiagnosticResult {
  timestamp: string;
  sections: DiagnosticSection[];
  summary?: {
    total: number;
    passed: number;
    failed: number;
    allPassed: boolean;
  };
}

export default function DiagnosePage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [loading, setLoading] = useState(false);

  const runDiagnostics = async () => {
    setLoading(true);
    setResult(null);

    try {
      console.log('开始诊断流程...');

      const response = await fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('诊断结果:', data);
      setResult(data);
    } catch (error: any) {
      console.error('诊断出错:', error);
      alert(`诊断出错: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testCookieAfterLogin = async () => {
    console.log('检查登录后的 Cookie...');
    console.log('document.cookie:', document.cookie);

    const hasToken = document.cookie.includes('auth-token');
    alert(
      `Cookie 检查结果:\n\n` +
      `document.cookie 是否包含 auth-token: ${hasToken}\n\n` +
      `完整 Cookie (前200字符):\n${document.cookie.substring(0, 200)}`
    );
  };

  const testAuthMeAfterLogin = async () => {
    console.log('测试 /api/auth/me...');

    const response = await fetch('/api/auth/me', {
      credentials: 'include',
    });

    console.log('响应状态:', response.status);
    console.log('响应头:', Object.fromEntries(response.headers.entries()));

    const data = await response.json();
    console.log('响应数据:', data);

    alert(
      `/api/auth/me 测试结果:\n\n` +
      `状态码: ${response.status}\n` +
      `success: ${data.success}\n` +
      `user: ${data.user ? JSON.stringify(data.user, null, 2) : '(无)'}\n\n` +
      `error: ${data.error || '(无)'}`
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return '✅';
      case 'fail': return '❌';
      case 'warn': return '⚠️';
      default: return '❓';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass': return { bg: '#d4edda', border: '#28a745', text: '#155724' };
      case 'fail': return { bg: '#f8d7da', border: '#dc3545', text: '#721c24' };
      case 'warn': return { 'background': '#fff3cd', 'border': '#ffc107', 'text': '#856404' };
      default: return { bg: '#e2e3e5', border: '#6c757d', text: '#383d41' };
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>🔍 完整诊断工具</h1>

      {/* 警告提示 */}
      <div style={{
        background: '#fff3cd',
        border: '2px solid #ffc107',
        borderRadius: '8px',
        padding: '1.5rem',
        marginBottom: '2rem'
      }}>
        <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>⚠️ 使用前必读</h3>
        <ol style={{ marginBottom: 0, paddingLeft: '1.5rem' }}>
          <li style={{ marginBottom: '0.5rem' }}>
            <strong>必须</strong>使用 <code>http://localhost:5000/diagnose</code> 访问此页面
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            不能使用 IP 地址（如 127.0.0.1）或其他域名
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            如果使用了 IP 地址，请修改 URL 为 localhost 后刷新页面
          </li>
        </ol>
      </div>

      {/* 诊断表单 */}
      <div style={{
        background: '#f5f5f5',
        padding: '2rem',
        borderRadius: '8px',
        marginBottom: '2rem'
      }}>
        <h2 style={{ marginTop: 0 }}>📝 输入测试账号</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              邮箱:
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
                boxSizing: 'border-box',
                fontSize: '1rem'
              }}
              placeholder="test@example.com"
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              密码:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
                boxSizing: 'border-box',
                fontSize: '1rem'
              }}
              placeholder="password"
            />
          </div>

          <button
            onClick={runDiagnostics}
            disabled={loading || !email || !password}
            style={{
              padding: '0.75rem 2rem',
              background: loading ? '#ccc' : '#4a7c59',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading || !email || !password ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold',
              height: '48px'
            }}
          >
            {loading ? '诊断中...' : '🚀 开始诊断'}
          </button>
        </div>
      </div>

      {/* 诊断结果 */}
      {result && (
        <div>
          {/* 总结 */}
          <div style={{
            background: result.summary?.allPassed ? '#d4edda' : '#f8d7da',
            border: `2px solid ${result.summary?.allPassed ? '#28a745' : '#dc3545'}`,
            borderRadius: '8px',
            padding: '1.5rem',
            marginBottom: '2rem'
          }}>
            <h2 style={{ marginTop: 0, marginBottom: '1rem' }}>
              {result.summary?.allPassed ? '🎉 诊断通过' : '⚠️ 发现问题'}
            </h2>
            <div style={{ fontSize: '1.1rem' }}>
              <div>总测试项: <strong>{result.summary?.total}</strong></div>
              <div>通过: <strong style={{ color: '#28a745' }}>{result.summary?.passed}</strong></div>
              <div>失败: <strong style={{ color: '#dc3545' }}>{result.summary?.failed}</strong></div>
            </div>
          </div>

          {/* 详细结果 */}
          <h2 style={{ marginBottom: '1rem' }}>📋 详细诊断结果</h2>

          {result.sections.map((section, index) => {
            const colors = getStatusColor(section.status);

            return (
              <div
                key={index}
                style={{
                  background: colors.bg,
                  border: `2px solid ${colors.border}`,
                  borderRadius: '8px',
                  padding: '1.5rem',
                  marginBottom: '1rem',
                  color: colors.text
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>
                    {getStatusIcon(section.status)}
                  </span>
                  <h3 style={{ margin: 0, fontSize: '1.2rem' }}>
                    {section.name}
                  </h3>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.5)', padding: '1rem', borderRadius: '4px' }}>
                  <div style={{ marginBottom: '0.5rem', fontSize: '0.9rem', opacity: 0.8 }}>
                    时间: {new Date(section.timestamp).toLocaleTimeString()}
                  </div>
                  <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                    {JSON.stringify(section.data, null, 2)}
                  </pre>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 额外测试按钮 */}
      {result && result.summary?.allPassed && (
        <div style={{
          background: '#e7f3ff',
          border: '2px solid #007bff',
          borderRadius: '8px',
          padding: '1.5rem',
          marginTop: '2rem'
        }}>
          <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>✅ 基础诊断通过！继续测试</h3>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={testCookieAfterLogin}
              style={{
                padding: '0.75rem 1.5rem',
                background: '#c9a961',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              🍪 检查浏览器 Cookie
            </button>
            <button
              onClick={testAuthMeAfterLogin}
              style={{
                padding: '0.75rem 1.5rem',
                background: '#6b8e5f',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '1rem'
              }}
            >
              🔐 测试 /api/auth/me
            </button>
          </div>
        </div>
      )}

      {/* 问题排查指南 */}
      <div style={{
        background: '#f8f9fa',
        border: '2px solid #dee2e6',
        borderRadius: '8px',
        padding: '1.5rem',
        marginTop: '2rem'
      }}>
        <h3 style={{ marginTop: 0 }}>📖 问题排查指南</h3>

        <details style={{ marginBottom: '1rem' }}>
          <summary style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            诊断通过了，但保存历史记录还是失败？
          </summary>
          <div style={{ paddingLeft: '1rem' }}>
            <ol>
              <li>检查浏览器开发者工具 &gt; Application &gt; Cookies</li>
              <li>确认 `auth-token` Cookie 存在</li>
              <li>确认 Cookie 的 Domain 是 `localhost`</li>
              <li>清除所有 Cookies 后重新登录</li>
              <li>使用无痕模式重新测试</li>
            </ol>
          </div>
        </details>

        <details style={{ marginBottom: '1rem' }}>
          <summary style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            诊断显示 Cookie 设置失败？
          </summary>
          <div style={{ paddingLeft: '1rem' }}>
            <ol>
              <li>确认使用 `http://localhost:5000` 访问（而非 IP 地址）</li>
              <li>检查浏览器是否阻止了第三方 Cookie</li>
              <li>尝试使用无痕模式</li>
              <li>清除浏览器缓存和 Cookies</li>
            </ol>
          </div>
        </details>

        <details>
          <summary style={{ cursor: 'pointer', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            Token 验证失败？
          </summary>
          <div style={{ paddingLeft: '1rem' }}>
            <ol>
              <li>Token 可能已过期，重新登录</li>
              <li>检查数据库中用户是否存在</li>
              <li>查看浏览器控制台的详细错误日志</li>
            </ol>
          </div>
        </details>
      </div>
    </div>
  );
}
