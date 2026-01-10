"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { X, Mail, Lock, User, Leaf } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "login" | "register";
}

export default function AuthModal({ isOpen, onClose, defaultTab = "login" }: AuthModalProps) {
  const { login, register } = useAuth();
  const [tab, setTab] = useState<"login" | "register">(defaultTab);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // 登录表单
  const [loginData, setLoginData] = useState({ email: "", password: "" });

  // 注册表单
  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
  });

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setSuccess(false);

    try {
      console.log('[AuthModal] 开始登录流程');
      await login(loginData.email, loginData.password);
      console.log('[AuthModal] 登录成功，准备关闭弹窗');

      // 显示成功提示
      setSuccess(true);
      setLoginData({ email: "", password: "" });

      // 延迟关闭弹窗，让用户看到成功状态
      setTimeout(() => {
        console.log('[AuthModal] 关闭弹窗');
        onClose();
        setSuccess(false);
      }, 800);
    } catch (err: any) {
      console.error('[AuthModal] 登录失败:', err);
      setError(err.message || "登录失败");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // 验证密码
    if (registerData.password.length < 6) {
      setError("密码至少6位");
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      setError("两次输入的密码不一致");
      return;
    }

    setLoading(true);

    try {
      console.log('[AuthModal] 开始注册流程');
      await register(
        registerData.email,
        registerData.password,
        registerData.username || undefined
      );
      console.log('[AuthModal] 注册成功，准备关闭弹窗');

      // 显示成功提示
      setSuccess(true);
      setRegisterData({ email: "", password: "", confirmPassword: "", username: "" });

      // 延迟关闭弹窗，让用户看到成功状态
      setTimeout(() => {
        console.log('[AuthModal] 关闭弹窗');
        onClose();
        setSuccess(false);
      }, 800);
    } catch (err: any) {
      console.error('[AuthModal] 注册失败:', err);
      setError(err.message || "注册失败");
    } finally {
      setLoading(false);
    }
  };

  const colors = {
    bg: "#f5f1ed",
    darkBrown: "#7c4d4d",
    darkerBrown: "#6b3e3e",
    darkGreen: "#4a7c59",
    darkerGreen: "#3a6348",
    text: "#3a3a3a",
    lightText: "#8b8176",
    gold: "#c9a961",
  };

  // 根据当前标签页选择主题色
  const themeColor = tab === "register" ? colors.darkGreen : colors.darkBrown;
  const themeColorDarker = tab === "register" ? colors.darkerGreen : colors.darkerBrown;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div
        className="w-full max-w-md mx-4 overflow-hidden"
        style={{
          backgroundColor: "#fff",
          borderRadius: "10px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* 标题栏 */}
        <div
          className="px-6 py-5 flex justify-between items-center"
          style={{ backgroundColor: themeColor }}
        >
          <div className="flex items-center gap-2">
            <Leaf size={20} style={{ color: colors.gold }} />
            <h2 className="text-xl font-semibold" style={{ fontFamily: "Georgia, serif", color: "white" }}>
              草药卡占卜
            </h2>
          </div>
          <button
            onClick={onClose}
            className="hover:opacity-70 transition-opacity"
            style={{ color: "white", background: "none", border: "none", cursor: "pointer" }}
          >
            <X size={24} />
          </button>
        </div>

        {/* 标签切换 */}
        <div className="flex border-b" style={{ borderColor: "#e5e5e5" }}>
          <button
            onClick={() => {
              setTab("login");
              setError("");
            }}
            className={`flex-1 py-4 text-sm font-medium transition-colors ${
              tab === "login" ? themeColor : colors.lightText
            }`}
            style={{
              fontFamily: "Georgia, serif",
              borderBottom: tab === "login" ? `2px solid ${themeColor}` : "none",
              background: tab === "login" ? `${themeColor}08` : "transparent",
            }}
          >
            登录
          </button>
          <button
            onClick={() => {
              setTab("register");
              setError("");
            }}
            className={`flex-1 py-4 text-sm font-medium transition-colors ${
              tab === "register" ? themeColor : colors.lightText
            }`}
            style={{
              fontFamily: "Georgia, serif",
              borderBottom: tab === "register" ? `2px solid ${themeColor}` : "none",
              background: tab === "register" ? `${themeColor}08` : "transparent",
            }}
          >
            注册
          </button>
        </div>

        {/* 表单内容 */}
        <div className="p-8" style={{ backgroundColor: "#faf9f7" }}>
          {success && (
            <div
              className="mb-4 p-3 rounded text-sm text-center"
              style={{
                backgroundColor: "#f0fdf4",
                border: "1px solid #86efac",
                color: "#166534",
                fontFamily: "Georgia, serif",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              {tab === "login" ? "登录成功！" : "注册成功！"}
            </div>
          )}

          {error && (
            <div
              className="mb-4 p-3 rounded text-sm"
              style={{
                backgroundColor: "#fef2f2",
                border: "1px solid #fecaca",
                color: "#dc2626",
                fontFamily: "Georgia, serif",
              }}
            >
              {error}
            </div>
          )}

          {tab === "login" ? (
            <form onSubmit={handleLogin} style={{ textAlign: "left" }}>
              {/* 邮箱输入 */}
              <div className="mb-5">
                <label
                  htmlFor="login-email"
                  className="block mb-2"
                  style={{
                    fontFamily: "Georgia, serif",
                    fontSize: "14px",
                    color: themeColor,
                    fontWeight: 500,
                  }}
                >
                  邮箱
                </label>
                <div style={{ position: "relative", width: "100%" }}>
                  <Mail
                    style={{
                      position: "absolute",
                      left: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: "18px",
                      color: themeColor,
                      zIndex: 1,
                    }}
                    size={18}
                  />
                  <input
                    type="email"
                    id="login-email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "10px 15px 10px 40px",
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                      fontSize: "16px",
                      fontFamily: "Georgia, serif",
                      outline: "none",
                      transition: "border-color 0.2s",
                    }}
                    placeholder="输入邮箱"
                    required
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = themeColor;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "#ccc";
                    }}
                  />
                </div>
              </div>

              {/* 密码输入 */}
              <div className="mb-5">
                <label
                  htmlFor="login-password"
                  className="block mb-2"
                  style={{
                    fontFamily: "Georgia, serif",
                    fontSize: "14px",
                    color: themeColor,
                    fontWeight: 500,
                  }}
                >
                  密码
                </label>
                <div style={{ position: "relative", width: "100%" }}>
                  <Lock
                    style={{
                      position: "absolute",
                      left: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: "18px",
                      color: themeColor,
                      zIndex: 1,
                    }}
                    size={18}
                  />
                  <input
                    type="password"
                    id="login-password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "10px 15px 10px 40px",
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                      fontSize: "16px",
                      fontFamily: "Georgia, serif",
                      outline: "none",
                      transition: "border-color 0.2s",
                    }}
                    placeholder="输入密码"
                    required
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = themeColor;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "#ccc";
                    }}
                  />
                </div>
              </div>

              {/* 记住我 & 忘记密码 */}
              <div
                className="mb-5"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: "14px",
                  fontFamily: "Georgia, serif",
                }}
              >
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                  <input type="checkbox" style={{ accentColor: themeColor }} />
                  <span style={{ color: colors.text }}>记住我</span>
                </label>
                <a
                  href="#"
                  style={{
                    color: themeColor,
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    alert("找回密码功能即将上线");
                  }}
                >
                  忘记密码？
                </a>
              </div>

              {/* 登录按钮 */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  backgroundColor: themeColor,
                  color: "white",
                  padding: "12px",
                  border: "none",
                  borderRadius: "5px",
                  fontSize: "16px",
                  fontWeight: 500,
                  cursor: loading ? "not-allowed" : "pointer",
                  fontFamily: "Georgia, serif",
                  transition: "background-color 0.2s",
                  opacity: loading ? 0.5 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.backgroundColor = themeColorDarker;
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = themeColor;
                }}
              >
                {loading ? "登录中..." : "登录"}
              </button>

              {/* 注册引导 */}
              <p
                className="mt-4 text-center"
                style={{ fontSize: "14px", fontFamily: "Georgia, serif", color: colors.text }}
              >
                还没有账号？{" "}
                <button
                  type="button"
                  onClick={() => {
                    setTab("register");
                    setError("");
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: themeColor,
                    textDecoration: "underline",
                    cursor: "pointer",
                    fontFamily: "Georgia, serif",
                  }}
                >
                  注册
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleRegister} style={{ textAlign: "left" }}>
              {/* 邮箱输入 */}
              <div className="mb-5">
                <label
                  htmlFor="register-email"
                  className="block mb-2"
                  style={{
                    fontFamily: "Georgia, serif",
                    fontSize: "14px",
                    color: themeColor,
                    fontWeight: 500,
                  }}
                >
                  邮箱
                </label>
                <div style={{ position: "relative", width: "100%" }}>
                  <Mail
                    style={{
                      position: "absolute",
                      left: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: "18px",
                      color: themeColor,
                      zIndex: 1,
                    }}
                    size={18}
                  />
                  <input
                    type="email"
                    id="register-email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "10px 15px 10px 40px",
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                      fontSize: "16px",
                      fontFamily: "Georgia, serif",
                      outline: "none",
                      transition: "border-color 0.2s",
                    }}
                    placeholder="输入邮箱"
                    required
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = themeColor;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "#ccc";
                    }}
                  />
                </div>
              </div>

              {/* 昵称输入 */}
              <div className="mb-5">
                <label
                  htmlFor="register-username"
                  className="block mb-2"
                  style={{
                    fontFamily: "Georgia, serif",
                    fontSize: "14px",
                    color: themeColor,
                    fontWeight: 500,
                  }}
                >
                  昵称（可选）
                </label>
                <div style={{ position: "relative", width: "100%" }}>
                  <User
                    style={{
                      position: "absolute",
                      left: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: "18px",
                      color: themeColor,
                      zIndex: 1,
                    }}
                    size={18}
                  />
                  <input
                    type="text"
                    id="register-username"
                    value={registerData.username}
                    onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "10px 15px 10px 40px",
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                      fontSize: "16px",
                      fontFamily: "Georgia, serif",
                      outline: "none",
                      transition: "border-color 0.2s",
                    }}
                    placeholder="输入昵称"
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = themeColor;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "#ccc";
                    }}
                  />
                </div>
              </div>

              {/* 密码输入 */}
              <div className="mb-5">
                <label
                  htmlFor="register-password"
                  className="block mb-2"
                  style={{
                    fontFamily: "Georgia, serif",
                    fontSize: "14px",
                    color: themeColor,
                    fontWeight: 500,
                  }}
                >
                  密码
                </label>
                <div style={{ position: "relative", width: "100%" }}>
                  <Lock
                    style={{
                      position: "absolute",
                      left: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: "18px",
                      color: themeColor,
                      zIndex: 1,
                    }}
                    size={18}
                  />
                  <input
                    type="password"
                    id="register-password"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "10px 15px 10px 40px",
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                      fontSize: "16px",
                      fontFamily: "Georgia, serif",
                      outline: "none",
                      transition: "border-color 0.2s",
                    }}
                    placeholder="密码至少6位"
                    required
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = themeColor;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "#ccc";
                    }}
                  />
                </div>
              </div>

              {/* 确认密码输入 */}
              <div className="mb-5">
                <label
                  htmlFor="register-confirm-password"
                  className="block mb-2"
                  style={{
                    fontFamily: "Georgia, serif",
                    fontSize: "14px",
                    color: themeColor,
                    fontWeight: 500,
                  }}
                >
                  确认密码
                </label>
                <div style={{ position: "relative", width: "100%" }}>
                  <Lock
                    style={{
                      position: "absolute",
                      left: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: "18px",
                      color: themeColor,
                      zIndex: 1,
                    }}
                    size={18}
                  />
                  <input
                    type="password"
                    id="register-confirm-password"
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                    style={{
                      width: "100%",
                      padding: "10px 15px 10px 40px",
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                      fontSize: "16px",
                      fontFamily: "Georgia, serif",
                      outline: "none",
                      transition: "border-color 0.2s",
                    }}
                    placeholder="再次输入密码"
                    required
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = themeColor;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "#ccc";
                    }}
                  />
                </div>
              </div>

              {/* 注册按钮 */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  backgroundColor: themeColor,
                  color: "white",
                  padding: "12px",
                  border: "none",
                  borderRadius: "5px",
                  fontSize: "16px",
                  fontWeight: 500,
                  cursor: loading ? "not-allowed" : "pointer",
                  fontFamily: "Georgia, serif",
                  transition: "background-color 0.2s",
                  opacity: loading ? 0.5 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.backgroundColor = themeColorDarker;
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = themeColor;
                }}
              >
                {loading ? "注册中..." : "注册"}
              </button>

              {/* 登录引导 */}
              <p
                className="mt-4 text-center"
                style={{ fontSize: "14px", fontFamily: "Georgia, serif", color: colors.text }}
              >
                已有账号？{" "}
                <button
                  type="button"
                  onClick={() => {
                    setTab("login");
                    setError("");
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: themeColor,
                    textDecoration: "underline",
                    cursor: "pointer",
                    fontFamily: "Georgia, serif",
                  }}
                >
                  登录
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
