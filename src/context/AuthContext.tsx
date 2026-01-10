"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface User {
  id: string;
  email: string;
  username: string | null;
  avatar: string | null;
  createdAt: string | Date;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 获取当前用户信息
  const refreshUser = async (forceUpdate: boolean = false) => {
    console.log('[AuthContext] refreshUser 被调用, forceUpdate:', forceUpdate);

    try {
      // 先尝试使用 Cookie
      let response = await fetch("/api/auth/me", {
        credentials: 'include', // 确保发送 Cookie
      });
      let data = await response.json();

      console.log('[AuthContext] 获取用户信息响应（Cookie）:', data);

      // 如果 Cookie 失败，尝试使用 localStorage 中的 token
      if (!data.success && !data.user) {
        const token = localStorage.getItem('auth-token');
        if (token) {
          console.log('[AuthContext] Cookie 失败，尝试使用 localStorage token');
          response = await fetch("/api/auth/me", {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          data = await response.json();
          console.log('[AuthContext] 获取用户信息响应（localStorage）:', data);
        }
      }

      // 使用更清晰的判断条件：success 必须明确为 true
      if (data.success === true && data.user) {
        console.log('[AuthContext] 设置用户:', data.user);
        setUser(data.user);
      } else {
        // 无论是否强制更新，获取失败都应该清空用户状态
        console.log('[AuthContext] 获取用户信息失败，清空用户状态');
        console.log('[AuthContext] 失败原因:', data.error || '未知错误');
        setUser(null);
      }
    } catch (error) {
      console.error("[AuthContext] 获取用户信息失败:", error);
      // 无论是否强制更新，出错都应该清空用户状态
      console.log('[AuthContext] 出错，清空用户状态');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // 组件挂载时获取用户信息
  useEffect(() => {
    console.log('[AuthContext] 组件挂载，开始获取用户信息...');
    refreshUser();
  }, []);

  // 登录
  const login = async (email: string, password: string) => {
    console.log('[AuthContext] 尝试登录:', email);
    console.log('[AuthContext] 当前用户状态（登录前）:', user);

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: 'include', // 确保接收 Cookie
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log('[AuthContext] 登录响应:', data);

    if (!response.ok) {
      throw new Error(data.error || "登录失败");
    }

    // 保存 token 到 localStorage（用于 Coze 环境中 Cookie 不可用的情况）
    if (data.token) {
      localStorage.setItem('auth-token', data.token);
      console.log('[AuthContext] Token 已保存到 localStorage');
    }

    console.log('[AuthContext] 设置用户（登录成功）:', data.user);
    setUser(data.user);

    console.log('[AuthContext] 当前用户状态（登录后）:', user);
  };

  // 注册
  const register = async (email: string, password: string, username?: string) => {
    console.log('[AuthContext] 尝试注册:', email);
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: 'include', // 确保接收 Cookie
      body: JSON.stringify({ email, password, username }),
    });

    const data = await response.json();
    console.log('[AuthContext] 注册响应:', data);

    if (!response.ok) {
      throw new Error(data.error || "注册失败");
    }

    // 保存 token 到 localStorage（用于 Coze 环境中 Cookie 不可用的情况）
    if (data.token) {
      localStorage.setItem('auth-token', data.token);
      console.log('[AuthContext] Token 已保存到 localStorage');
    }

    setUser(data.user);
  };

  // 退出登录
  const logout = async () => {
    console.log('[AuthContext] 用户登出');
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: 'include', // 确保发送 Cookie
    });
    // 清除 localStorage 中的 token
    localStorage.removeItem('auth-token');
    console.log('[AuthContext] 清空用户状态');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
