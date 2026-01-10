"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { User, Mail, Calendar, LogOut, ArrowLeft, Star, Edit } from "lucide-react";

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // 如果未登录，重定向到首页
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f5f5dc",
        }}
      >
        <div style={{ color: "#7c4d4d", fontFamily: "Georgia, serif" }}>
          加载中...
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const colors = {
    bg: "#f5f1ed",
    darkBg: "#3d3528",
    gold: "#c9a961",
    darkGold: "#7c4d4d",
    text: "#4a4139",
    lightText: "#8b8176",
    accent: "#6b8e5f",
  };

  const formatDate = (date: string | Date) => {
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${colors.bg} 0%, #ebe6dd 50%, #f5f1ed 100%)`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* 纹理背景 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            'url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" /%3E%3C/filter%3E%3Crect width="100" height="100" filter="url(%23noise)" opacity="0.03"/%3E%3C/svg%3E") repeat',
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      {/* 星点装饰 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
        }}
      >
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: Math.random() * 2 + 1 + "px",
              height: Math.random() * 2 + 1 + "px",
              background: colors.gold,
              borderRadius: "50%",
              opacity: Math.random() * 0.3 + 0.1,
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
            }}
          />
        ))}
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: "800px",
          margin: "0 auto",
          padding: "clamp(1.5rem, 4vw, 3rem)",
        }}
      >
        {/* 顶部导航 */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
          }}
        >
          <button
            onClick={() => router.push("/")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.5rem 1rem",
              background: "transparent",
              border: `1px solid ${colors.gold}50`,
              borderRadius: "30px",
              color: colors.darkGold,
              fontSize: "0.9rem",
              cursor: "pointer",
              transition: "all 0.3s ease",
              fontFamily: "Georgia, serif",
            }}
            onMouseEnter={(e) => {
              const target = e.currentTarget as HTMLButtonElement;
              target.style.background = `${colors.gold}15`;
            }}
            onMouseLeave={(e) => {
              const target = e.currentTarget as HTMLButtonElement;
              target.style.background = "transparent";
            }}
          >
            <ArrowLeft size={18} />
            返回首页
          </button>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "1.5rem",
            }}
          >
            <span>🌿</span>
            <span
              style={{
                fontSize: "1.2rem",
                fontWeight: "600",
                color: colors.darkGold,
                fontFamily: "Georgia, serif",
              }}
            >
              草药卡占卜
            </span>
          </div>
        </div>

        {/* 页面标题 */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "3rem",
          }}
        >
          <h1
            style={{
              fontSize: "clamp(1.8rem, 5vw, 2.5rem)",
              fontWeight: "700",
              color: colors.darkGold,
              marginBottom: "0.5rem",
              fontFamily: "Georgia, serif",
              letterSpacing: "0.05em",
            }}
          >
            个人中心
          </h1>
          <div
            style={{
              width: "80px",
              height: "2px",
              background: colors.gold,
              margin: "0 auto",
            }}
          />
        </div>

        {/* 用户信息卡片 */}
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            padding: "clamp(1.5rem, 4vw, 2.5rem)",
            boxShadow: `0 4px 20px ${colors.darkBg}15`,
            border: `1px solid ${colors.gold}30`,
            marginBottom: "2rem",
          }}
        >
          {/* 头像 */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "1.5rem",
            }}
          >
            <div
              style={{
                width: "clamp(80px, 20vw, 100px)",
                height: "clamp(80px, 20vw, 100px)",
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${colors.gold}30 0%, ${colors.accent}20 100%)`,
                border: `3px solid ${colors.gold}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "clamp(2.5rem, 7vw, 4rem)",
                boxShadow: `0 4px 15px ${colors.gold}30`,
              }}
            >
              <Star size={40} style={{ color: colors.darkGold }} />
            </div>
          </div>

          {/* 用户名 */}
          <div
            style={{
              textAlign: "center",
              marginBottom: "2rem",
            }}
          >
            <h2
              style={{
                fontSize: "clamp(1.3rem, 4vw, 1.8rem)",
                fontWeight: "600",
                color: colors.darkGold,
                marginBottom: "0.5rem",
                fontFamily: "Georgia, serif",
              }}
            >
              {user.username || "未设置昵称"}
            </h2>
            <p
              style={{
                fontSize: "0.95rem",
                color: colors.lightText,
                fontFamily: "Georgia, serif",
              }}
            >
              {user.email}
            </p>
          </div>

          {/* 信息列表 */}
          <div
            style={{
              display: "grid",
              gap: "1rem",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "1rem",
                background: `${colors.bg}80`,
                borderRadius: "10px",
              }}
            >
              <Mail size={20} style={{ color: colors.darkGold }} />
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: colors.lightText,
                    marginBottom: "0.25rem",
                    fontFamily: "Georgia, serif",
                  }}
                >
                  邮箱
                </p>
                <p
                  style={{
                    fontSize: "1rem",
                    color: colors.text,
                    fontFamily: "Georgia, serif",
                  }}
                >
                  {user.email}
                </p>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "1rem",
                background: `${colors.bg}80`,
                borderRadius: "10px",
              }}
            >
              <Calendar size={20} style={{ color: colors.darkGold }} />
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: colors.lightText,
                    marginBottom: "0.25rem",
                    fontFamily: "Georgia, serif",
                  }}
                >
                  注册时间
                </p>
                <p
                  style={{
                    fontSize: "1rem",
                    color: colors.text,
                    fontFamily: "Georgia, serif",
                  }}
                >
                  {formatDate(user.createdAt)}
                </p>
              </div>
            </div>
          </div>

          {/* 操作按钮 */}
          <div
            style={{
              marginTop: "2rem",
              display: "flex",
              gap: "1rem",
            }}
          >
            <button
              onClick={() => alert("编辑功能即将上线（阶段3）")}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                padding: "0.8rem 1.5rem",
                background: `${colors.gold}15`,
                border: `1px solid ${colors.gold}`,
                borderRadius: "30px",
                color: colors.darkGold,
                fontSize: "0.95rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
                fontFamily: "Georgia, serif",
              }}
              onMouseEnter={(e) => {
                const target = e.currentTarget as HTMLButtonElement;
                target.style.background = `${colors.gold}25`;
              }}
              onMouseLeave={(e) => {
                const target = e.currentTarget as HTMLButtonElement;
                target.style.background = `${colors.gold}15`;
              }}
            >
              <Edit size={18} />
              编辑资料
            </button>

            <button
              onClick={handleLogout}
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                padding: "0.8rem 1.5rem",
                background: `${colors.darkGold}15`,
                border: `1px solid ${colors.darkGold}50`,
                borderRadius: "30px",
                color: colors.darkGold,
                fontSize: "0.95rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
                fontFamily: "Georgia, serif",
              }}
              onMouseEnter={(e) => {
                const target = e.currentTarget as HTMLButtonElement;
                target.style.background = `${colors.darkGold}25`;
              }}
              onMouseLeave={(e) => {
                const target = e.currentTarget as HTMLButtonElement;
                target.style.background = `${colors.darkGold}15`;
              }}
            >
              <LogOut size={18} />
              退出登录
            </button>
          </div>
        </div>

        {/* 占卜历史记录（预留） */}
        <div
          style={{
            background: "white",
            borderRadius: "16px",
            padding: "clamp(1.5rem, 4vw, 2.5rem)",
            boxShadow: `0 4px 20px ${colors.darkBg}15`,
            border: `1px solid ${colors.gold}30`,
          }}
        >
          <h3
            style={{
              fontSize: "1.4rem",
              fontWeight: "600",
              color: colors.darkGold,
              marginBottom: "1.5rem",
              fontFamily: "Georgia, serif",
            }}
          >
            占卜历史记录
          </h3>

          {/* 占位内容 */}
          <div
            style={{
              textAlign: "center",
              padding: "2rem",
              color: colors.lightText,
            }}
          >
            <p
              style={{
                fontSize: "1rem",
                marginBottom: "0.5rem",
                fontFamily: "Georgia, serif",
              }}
            >
              🌟 历史记录功能即将上线
            </p>
            <p
              style={{
                fontSize: "0.9rem",
                fontFamily: "Georgia, serif",
              }}
            >
              阶段2将支持查看和管理您的占卜历史
            </p>
          </div>
        </div>

        {/* 底部提示 */}
        <div
          style={{
            textAlign: "center",
            marginTop: "2rem",
            color: colors.lightText,
            fontSize: "0.85rem",
            fontFamily: "Georgia, serif",
          }}
        >
          <p>✧ 愿星辰指引您的道路 ✧</p>
        </div>
      </div>
    </div>
  );
}
