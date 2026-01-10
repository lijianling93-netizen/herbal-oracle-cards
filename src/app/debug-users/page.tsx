"use client";

import { useState, useEffect } from "react";

export default function DebugUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const [testEmail, setTestEmail] = useState("");
  const [testPassword, setTestPassword] = useState("");
  const [testUsername, setTestUsername] = useState("");

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev]);
  };

  const fetchUsers = async () => {
    setLoading(true);
    addLog("获取数据库用户列表...");

    try {
      const response = await fetch('/api/debug/users');
      const data = await response.json();

      addLog(`获取结果: ${data.success ? '成功' : '失败'}`);
      addLog(`用户数量: ${data.count || 0}`);

      if (data.users) {
        setUsers(data.users);
        data.users.forEach((u: any) => {
          addLog(`  - ${u.email} (${u.username || '无用户名'})`);
        });
      }
    } catch (error: any) {
      addLog(`错误: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const createTestUser = async () => {
    if (!testEmail || !testPassword) {
      alert('请输入邮箱和密码');
      return;
    }

    setLoading(true);
    addLog(`创建测试用户: ${testEmail}`);

    try {
      const response = await fetch('/api/debug/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          email: testEmail,
          password: testPassword,
          username: testUsername,
        }),
      });

      const data = await response.json();
      addLog(`创建结果: ${data.success ? '成功' : '失败'}`);

      if (data.success) {
        addLog(`用户ID: ${data.user.id}`);
        addLog('用户创建成功！现在可以测试登录了。');
        await fetchUsers(); // 刷新用户列表
      } else {
        addLog(`错误: ${data.error}`);
      }
    } catch (error: any) {
      addLog(`错误: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async (email: string, password: string) => {
    setLoading(true);
    addLog(`测试登录: ${email}`);

    try {
      const response = await fetch('/api/debug/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'test-login',
          email,
          password,
        }),
      });

      const data = await response.json();
      addLog(`测试结果: ${data.success ? '成功' : '失败'}`);

      if (data.success) {
        addLog(`✅ 密码正确！用户ID: ${data.user.id}`);
      } else {
        addLog(`❌ 错误: ${data.error}`);
      }
    } catch (error: any) {
      addLog(`错误: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '1.5rem' }}>🔍 数据库用户管理</h1>

      {/* 用户列表 */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ margin: 0 }}>数据库中的用户 ({users.length})</h2>
          <button
            onClick={fetchUsers}
            disabled={loading}
            style={{
              padding: '0.5rem 1rem',
              background: loading ? '#ccc' : '#4a7c59',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            🔄 刷新
          </button>
        </div>

        {users.length === 0 ? (
          <div style={{
            background: '#fff3cd',
            border: '2px solid #ffc107',
            borderRadius: '8px',
            padding: '1.5rem',
            textAlign: 'center'
          }}>
            <p style={{ margin: 0, marginBottom: '1rem', fontSize: '1.1rem' }}>
              ⚠️ 数据库中没有用户！
            </p>
            <p style={{ margin: 0 }}>
              你需要先创建一个测试账号才能登录。
            </p>
          </div>
        ) : (
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            background: 'white',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <thead>
              <tr style={{ background: '#f5f5f5' }}>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>ID</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>邮箱</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>用户名</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>创建时间</th>
                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td style={{ padding: '1rem', borderBottom: '1px solid #eee', fontFamily: 'monospace', fontSize: '0.85rem' }}>
                    {user.id.substring(0, 8)}...
                  </td>
                  <td style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>{user.email}</td>
                  <td style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>{user.username || '(无)'}</td>
                  <td style={{ padding: '1rem', borderBottom: '1px solid #eee', fontSize: '0.85rem' }}>
                    {new Date(user.createdAt).toLocaleString()}
                  </td>
                  <td style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>
                    <button
                      onClick={() => {
                        const testPass = prompt('输入密码测试登录:');
                        if (testPass) testLogin(user.email, testPass);
                      }}
                      style={{
                        padding: '0.4rem 0.8rem',
                        background: '#6b8e5f',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.85rem'
                      }}
                    >
                      测试密码
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 创建测试用户 */}
      <div style={{
        background: '#f5f5f5',
        padding: '1.5rem',
        borderRadius: '8px',
        marginBottom: '2rem'
      }}>
        <h2 style={{ marginTop: 0, marginBottom: '1rem' }}>创建测试用户</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '1rem', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>邮箱:</label>
            <input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', boxSizing: 'border-box' }}
              placeholder="test@example.com"
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>密码:</label>
            <input
              type="text"
              value={testPassword}
              onChange={(e) => setTestPassword(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', boxSizing: 'border-box' }}
              placeholder="password123"
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>用户名 (可选):</label>
            <input
              type="text"
              value={testUsername}
              onChange={(e) => setTestUsername(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', boxSizing: 'border-box' }}
              placeholder="测试用户"
            />
          </div>

          <button
            onClick={createTestUser}
            disabled={loading || !testEmail || !testPassword}
            style={{
              padding: '0.5rem 1.5rem',
              background: loading || !testEmail || !testPassword ? '#ccc' : '#c9a961',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading || !testEmail || !testPassword ? 'not-allowed' : 'pointer',
              height: '38px'
            }}
          >
            {loading ? '创建中...' : '创建用户'}
          </button>
        </div>
      </div>

      {/* 日志 */}
      <div>
        <h3 style={{ marginBottom: '1rem' }}>操作日志</h3>
        <div style={{
          background: '#1e1e1e',
          color: '#d4d4d4',
          padding: '1rem',
          borderRadius: '8px',
          maxHeight: '300px',
          overflowY: 'auto'
        }}>
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: '0.85rem' }}>
            {logs.join('\n') || '(暂无日志)'}
          </pre>
        </div>
      </div>
    </div>
  );
}
