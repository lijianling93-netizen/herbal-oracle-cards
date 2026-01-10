'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle, XCircle, Globe, Cookie, Lock } from 'lucide-react';

interface DiagnosticInfo {
  currentUrl: string;
  hostname: string;
  cookies: Record<string, string>;
  hasAuthToken: boolean;
  localStorageData: Record<string, any>;
}

export default function DiagnoseDomainPage() {
  const [info, setInfo] = useState<DiagnosticInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [authStatus, setAuthStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [authMessage, setAuthMessage] = useState('');

  useEffect(() => {
    // 收集浏览器信息
    const cookies: Record<string, string> = {};
    document.cookie.split(';').forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      if (name && value) {
        cookies[name] = value.substring(0, 50) + (value.length > 50 ? '...' : '');
      }
    });

    const localStorageData: Record<string, any> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        try {
          localStorageData[key] = JSON.parse(localStorage.getItem(key) || '{}');
          // 只显示部分内容
          if (typeof localStorageData[key] === 'object') {
            localStorageData[key] = JSON.stringify(localStorageData[key]).substring(0, 100) + '...';
          }
        } catch {
          localStorageData[key] = localStorage.getItem(key)?.substring(0, 100) + '...';
        }
      }
    }

    setInfo({
      currentUrl: window.location.href,
      hostname: window.location.hostname,
      cookies,
      hasAuthToken: !!document.cookie.includes('auth-token'),
      localStorageData,
    });

    setLoading(false);

    // 测试认证 API
    testAuthAPI();
  }, []);

  const testAuthAPI = async () => {
    setAuthStatus('loading');
    setAuthMessage('正在测试认证 API...');

    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
      });

      const data = await response.json();

      if (data.success && data.user) {
        setAuthStatus('success');
        setAuthMessage(`认证成功！当前用户: ${data.user.email}`);
      } else {
        setAuthStatus('error');
        setAuthMessage(`认证失败: ${data.error || '未知错误'} (HTTP ${response.status})`);
      }
    } catch (error) {
      setAuthStatus('error');
      setAuthMessage(`API 调用失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  };

  const isUsingCorrectDomain = info?.hostname === 'localhost' || info?.hostname.startsWith('127.0.0.1');
  const isUsingDevCoze = info?.hostname.includes('dev.coze.site');
  const isVercel = info?.hostname.includes('vercel.app');
  const isUsingValidDomain = isUsingCorrectDomain || isUsingDevCoze || isVercel;
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f5f1ed',
        fontFamily: 'Georgia, serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔍</div>
          <p>正在诊断...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      padding: '2rem',
      background: 'linear-gradient(135deg, #ebe6dd 0%, #f5f1ed 100%)',
      fontFamily: 'Georgia, serif'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{
          fontSize: '2rem',
          marginBottom: '0.5rem',
          color: '#3d3528'
        }}>
          🔍 域名与认证诊断
        </h1>
        <p style={{ color: '#8b8176', marginBottom: '2rem' }}>
          检查当前访问域名和 Cookie 状态
        </p>

        {/* 域名状态 */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '1.2rem',
            marginBottom: '1rem',
            color: '#3d3528'
          }}>
            <Globe size={20} />
            访问域名
          </h2>

          <div style={{
            padding: '1rem',
            borderRadius: '8px',
            background: '#f5f5f0',
            fontFamily: 'monospace',
            fontSize: '0.9rem',
            marginBottom: '1rem',
            wordBreak: 'break-all'
          }}>
            <strong>完整 URL:</strong><br />
            {info?.currentUrl}
          </div>

          {isUsingCorrectDomain ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem',
              background: '#d1fae5',
              borderRadius: '8px',
              color: '#065f46'
            }}>
              <CheckCircle size={18} />
              <span>✅ 正在使用本地开发域名 (localhost)</span>
            </div>
          ) : isUsingDevCoze ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem',
              background: '#fee2e2',
              borderRadius: '8px',
              color: '#991b1b'
            }}>
              <AlertTriangle size={18} />
              <span>⚠️ 检测到 dev.coze.site 域名</span>
            </div>
          ) : (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem',
              background: '#fef3c7',
              borderRadius: '8px',
              color: '#92400e'
            }}>
              <AlertTriangle size={18} />
              <span>⚠️ 域名异常: {info?.hostname}</span>
            </div>
          )}
        </div>

        {/* Cookie 状态 */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '1.2rem',
            marginBottom: '1rem',
            color: '#3d3528'
          }}>
            <Cookie size={20} />
            Cookie 状态
          </h2>

          {info?.hasAuthToken ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem',
              background: '#d1fae5',
              borderRadius: '8px',
              color: '#065f46',
              marginBottom: '1rem'
            }}>
              <CheckCircle size={18} />
              <span>✅ 已找到 auth-token Cookie</span>
            </div>
          ) : (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem',
              background: '#fee2e2',
              borderRadius: '8px',
              color: '#991b1b',
              marginBottom: '1rem'
            }}>
              <XCircle size={18} />
              <span>❌ 未找到 auth-token Cookie</span>
            </div>
          )}

          <div style={{
            padding: '1rem',
            borderRadius: '8px',
            background: '#f5f5f0',
            fontSize: '0.85rem',
            maxHeight: '200px',
            overflow: 'auto'
          }}>
            <strong>所有 Cookies:</strong>
            <pre style={{ margin: '0.5rem 0 0', whiteSpace: 'pre-wrap' }}>
              {Object.keys(info?.cookies || {}).length > 0
                ? JSON.stringify(info?.cookies, null, 2)
                : '无'}
            </pre>
          </div>
        </div>

        {/* 认证状态 */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '1.5rem',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '1.2rem',
            marginBottom: '1rem',
            color: '#3d3528'
          }}>
            <Lock size={20} />
            认证 API 测试
          </h2>

          <div style={{
            padding: '1rem',
            borderRadius: '8px',
            background: authStatus === 'success' ? '#d1fae5' :
                       authStatus === 'error' ? '#fee2e2' : '#f3f4f6',
            color: authStatus === 'success' ? '#065f46' :
                   authStatus === 'error' ? '#991b1b' : '#6b7280'
          }}>
            {authStatus === 'loading' && '⏳ 正在测试...'}
            {authStatus === 'success' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={18} />
                <span>{authMessage}</span>
              </div>
            )}
            {authStatus === 'error' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <XCircle size={18} />
                <span>{authMessage}</span>
              </div>
            )}
          </div>

          <button
            onClick={testAuthAPI}
            style={{
              marginTop: '1rem',
              padding: '0.75rem 1.5rem',
              background: '#4a7c59',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.95rem'
            }}
          >
            重新测试
          </button>
        </div>

        {/* 解决方案 */}
        {(isUsingDevCoze || !isUsingCorrectDomain) && (
          <div style={{
            background: '#fef3c7',
            border: '2px solid #f59e0b',
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            <h3 style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '1.1rem',
              marginBottom: '1rem',
              color: '#92400e'
            }}>
              <AlertTriangle size={20} />
              发现问题！
            </h3>

            <p style={{ color: '#92400e', marginBottom: '1rem', lineHeight: '1.6' }}>
              你当前正在使用 <strong>{info?.hostname}</strong> 访问应用。
              这会导致 Cookie 无法正确工作，因为 Cookie 只能在同一域名下使用。
            </p>

            <h4 style={{ color: '#92400e', marginBottom: '0.5rem' }}>解决方案：</h4>

            <ol style={{
              color: '#92400e',
              paddingLeft: '1.5rem',
              lineHeight: '1.8'
            }}>
              <li>
                在浏览器中打开新的标签页，访问:{' '}
                <a
                  href="http://localhost:5000"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: '#f59e0b20',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px',
                    textDecoration: 'underline',
                    fontWeight: 'bold'
                  }}
                >
                  http://localhost:5000
                </a>
              </li>
              <li>在 localhost:5000 上重新登录</li>
              <li>之后始终使用 localhost:5000 访问应用</li>
            </ol>

            <div style={{
              marginTop: '1rem',
              padding: '0.75rem',
              background: '#f59e0b20',
              borderRadius: '8px',
              fontSize: '0.9rem',
              color: '#92400e'
            }}>
              <strong>提示：</strong>如果 localhost:5000 无法访问，请确保开发服务正在运行（应运行在 5000 端口）。
            </div>
          </div>
        )}

        {/* 返回按钮 */}
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button
            onClick={() => window.location.href = '/'}
            style={{
              padding: '1rem 2rem',
              background: '#c9a961',
              color: '#3d3528',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold'
            }}
          >
            返回首页
          </button>
        </div>
      </div>
    </div>
  );
}
