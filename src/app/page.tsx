'use client';

import { useState, useEffect } from 'react';
import { OracleCard } from '@/types/oracle-card';
import { getOracleCards } from '@/data/oracle-cards-csv';
import CardInterpretation from '@/components/CardInterpretation';
import AuthModal from '@/components/AuthModal';
import { useAuth } from '@/context/AuthContext';
import { User, LogOut, Menu, X, AlertTriangle } from 'lucide-react';

type ViewState = 'home' | 'intention' | 'reading' | 'card-interpretation';

export default function Home() {
  const [viewState, setViewState] = useState<ViewState>('home');
  const [selectedCard, setSelectedCard] = useState<OracleCard | null>(null);
  const [isCardReversed, setIsCardReversed] = useState<boolean>(false);
  const [intention, setIntention] = useState('');
  const [selectedIntention, setSelectedIntention] = useState<string | null>(null);
  const { user, logout, loading } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');

  // 检查是否使用正确的域名
  const [isWrongDomain, setIsWrongDomain] = useState(false);
  const [currentHostname, setCurrentHostname] = useState('');

  useEffect(() => {
    // 检查域名（仅在开发环境显示警告）
    const hostname = window.location.hostname;
    setCurrentHostname(hostname);

    // 检查是否使用 localhost 或 127.0.0.1
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
    const isDevCoze = hostname.includes('dev.coze.site');
    const isProdCoze = hostname.includes('coze.site');

    // 只有在非 localhost、非 coze 预览环境时才显示警告
    setIsWrongDomain(!isLocalhost && !isDevCoze && !isProdCoze);

    console.log('[Page] 当前域名:', hostname, '是否异常:', !isLocalhost && !isDevCoze && !isProdCoze);
  }, []);

  // 监控用户状态变化
  useEffect(() => {
    console.log('[Page] 用户状态变化:', { user, loading });
  }, [user, loading]);

  // 意图选项
  const intentionOptions = [
    { emoji: '❤️', title: '爱与关系', desc: '感情中的行星能量' },
    { emoji: '💼', title: '事业与财富', desc: '职业与资源流动' },
    { emoji: '🌱', title: '健康与疗愈', desc: '身心灵之道' },
    { emoji: '🔮', title: '灵性与成长', desc: '灵魂进化' },
    { emoji: '💪', title: '勇气与力量', desc: '内在火焰' },
    { emoji: '🌙', title: '梦想与目标', desc: '宇宙共鸣' }
  ];

  // 颜色系统
  const colors = {
    bg: '#f5f1ed',           // 米色背景
    darkBg: '#3d3528',       // 深棕色背景
    gold: '#c9a961',         // 淡金色
    darkGold: '#a0845a',     // 深金色
    text: '#4a4139',         // 深棕文本
    lightText: '#8b8176',    // 浅棕文本
    accent: '#6b8e5f',       // 深绿
    lightAccent: '#9db88b'   // 浅绿
  };

  const StarField = () => {
    const [stars, setStars] = useState<Array<{id: number, width: number, height: number, opacity: number, left: number, top: number}>>([]);

    useEffect(() => {
      // 只在客户端生成随机星点，避免 SSR hydration 错误
      const generatedStars = Array.from({ length: 40 }).map((_, i) => ({
        id: i,
        width: Math.random() * 1.5 + 0.5,
        height: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.3 + 0.1,
        left: Math.random() * 100,
        top: Math.random() * 100
      }));
      setStars(generatedStars);
    }, []);

    return (
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0
      }}>
        {stars.map((star) => (
          <div
            key={star.id}
            style={{
              position: 'absolute',
              width: star.width + 'px',
              height: star.height + 'px',
              background: colors.gold,
              borderRadius: '50%',
              opacity: star.opacity,
              left: star.left + '%',
              top: star.top + '%'
            }}
          />
        ))}
      </div>
    );
  };

  // ========== 微信浏览器提示框 ==========
  const WeChatAlert = () => {
    const [isWeChat, setIsWeChat] = useState(false);
    const [showForTesting, setShowForTesting] = useState(true); // 临时开启用于测试

    useEffect(() => {
      // 检测是否在微信浏览器中
      const isWeChatBrowser = /micromessenger/i.test(navigator.userAgent);
      setIsWeChat(isWeChatBrowser);
      console.log('[WeChatAlert] 检测微信浏览器:', isWeChatBrowser);
      console.log('[WeChatAlert] userAgent:', navigator.userAgent);
    }, []);

    // 临时：所有浏览器都显示（用于测试）
    if (!isWeChat && !showForTesting) return null;

    console.log('[WeChatAlert] 渲染提示框');

    return (
      <div style={{
        position: 'fixed',
        top: '0',
        left: '0',
        right: '0',
        background: 'linear-gradient(135deg, #fff8e1 0%, #fff3cd 100%)',
        borderBottom: '3px solid #ffc107',
        padding: '1rem clamp(0.8rem, 2vw, 1.2rem)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        boxShadow: '0 4px 12px rgba(255, 193, 7, 0.4)',
      }}>
        <AlertTriangle size={24} style={{ color: '#f57c00', flexShrink: 0 }} />
        <div style={{
          flex: 1,
          fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
          color: '#5d4037',
          lineHeight: '1.6',
          fontFamily: 'Georgia, serif',
        }}>
          <span style={{ fontWeight: '700', color: '#e65100' }}>提示：</span>
          如需导出结果图片，请在外部浏览器中进行占卜
        </div>
      </div>
    );
  };

  // ========== 首页 ==========
  const HomePage = () => (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${colors.bg} 0%, #ebe6dd 50%, #f5f1ed 100%)`,
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <WeChatAlert />

      {/* 导航栏 */}
      <nav style={{
        position: 'relative',
        zIndex: 20,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 'clamp(0.8rem, 3vw, 1.5rem)',
        background: `${colors.bg}CC`,
        backdropFilter: 'blur(10px)',
        borderBottom: `1px solid ${colors.gold}30`,
      }}>
        {/* Logo */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span style={{ fontSize: '1.5rem' }}>🌿</span>
          <span style={{
            fontSize: 'clamp(1rem, 3vw, 1.2rem)',
            fontWeight: '600',
            color: colors.darkGold,
            fontFamily: 'Georgia, serif',
            letterSpacing: '0.05em'
          }}>
            草药卡占卜
          </span>
        </div>

        {/* 用户信息 / 登录按钮 - 已隐藏 */}
        <div style={{
          display: 'none',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          {/* 诊断按钮 */}
          <button
            onClick={async () => {
              console.log('========== 登录状态诊断 ==========');
              console.log('1. AuthContext 用户状态:', user);
              console.log('2. AuthContext loading:', loading);
              console.log('3. 浏览器 Cookies:', document.cookie);
              console.log('4. 包含 auth-token:', document.cookie.includes('auth-token'));

              // 测试 /api/auth/me
              try {
                const response = await fetch('/api/auth/me', {
                  credentials: 'include',
                });
                const data = await response.json();
                console.log('5. /api/auth/me 响应:', { status: response.status, data });
                console.log('===========================================');

                if (response.status === 401 && data.error === '未登录') {
                  alert(`❌ Cookie 未生效！\n\n当前用户: ${user ? user.email : '(未登录)'}\n浏览器有 auth-token: ${document.cookie.includes('auth-token')}\n\n可能原因：\n1. 用了 IP 地址访问（请用 localhost）\n2. 浏览器阻止了 Cookie`);
                } else if (data.success) {
                  alert(`✅ 登录状态正常！\n\n用户: ${data.user.email}\nUser ID: ${data.user.id}`);
                }
              } catch (error) {
                console.error('诊断出错:', error);
                alert('诊断出错，请查看浏览器控制台');
              }
            }}
            style={{
              padding: '0.4rem 0.8rem',
              background: '#6c757d',
              border: 'none',
              borderRadius: '20px',
              color: 'white',
              fontSize: '0.75rem',
              fontWeight: '600',
              cursor: 'pointer',
              opacity: 0.8
            }}
            title="测试登录状态"
          >
            🔍
          </button>

          {user ? (
            <div style={{ position: 'relative' }}>
              {/* 桌面端用户菜单 */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  background: `${colors.gold}15`,
                  border: `1px solid ${colors.gold}40`,
                  borderRadius: '30px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={() => setIsMobileMenuOpen(true)}
                onMouseLeave={() => setIsMobileMenuOpen(false)}
              >
                <User size={18} style={{ color: colors.darkGold }} />
                <span style={{
                  fontSize: '0.9rem',
                  color: colors.darkGold,
                  fontFamily: 'Georgia, serif'
                }}>
                  {user.username || user.email}
                </span>
              </button>

              {/* 下拉菜单 */}
              {isMobileMenuOpen && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 0.5rem)',
                  right: 0,
                  background: 'white',
                  borderRadius: '10px',
                  boxShadow: `0 4px 20px ${colors.darkBg}20`,
                  border: `1px solid ${colors.gold}30`,
                  padding: '0.5rem',
                  minWidth: '160px',
                  zIndex: 30
                }}>
                  <a
                    href="/profile"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.75rem 1rem',
                      color: colors.text,
                      textDecoration: 'none',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      fontFamily: 'Georgia, serif',
                      cursor: 'pointer'
                    }}
                  >
                    <User size={16} />
                    个人中心
                  </a>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      width: '100%',
                      padding: '0.75rem 1rem',
                      background: 'transparent',
                      border: 'none',
                      color: colors.lightText,
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      fontFamily: 'Georgia, serif',
                      cursor: 'pointer',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = `${colors.gold}10`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <LogOut size={16} />
                    退出登录
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => {
                setAuthModalTab('login');
                setIsAuthModalOpen(true);
              }}
              style={{
                padding: '0.5rem 1.5rem',
                background: colors.gold,
                border: 'none',
                borderRadius: '30px',
                color: 'white',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontFamily: 'Georgia, serif',
                boxShadow: `0 2px 10px ${colors.gold}30`
              }}
              onMouseEnter={(e) => {
                const target = e.currentTarget as HTMLButtonElement;
                target.style.background = colors.darkGold;
                target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                const target = e.currentTarget as HTMLButtonElement;
                target.style.background = colors.gold;
                target.style.transform = 'translateY(0)';
              }}
            >
              登录 / 注册
            </button>
          )}
        </div>
      </nav>

      {/* 域名警告横幅 */}
      {isWrongDomain && (
        <div style={{
          position: 'relative',
          zIndex: 100,
          background: '#fee2e2',
          borderBottom: '2px solid #ef4444',
          padding: '1rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          <span style={{ fontSize: '1.5rem' }}>⚠️</span>
          <div style={{ flex: 1, minWidth: '300px' }}>
            <p style={{ margin: 0, color: '#991b1b', fontWeight: '600', fontSize: '1rem' }}>
              检测到域名异常：{currentHostname}
            </p>
            <p style={{ margin: '0.25rem 0 0', color: '#991b1b', fontSize: '0.9rem' }}>
              Cookie 可能无法正常工作，请使用 <a href="http://localhost:5000" target="_blank" style={{ fontWeight: 'bold', textDecoration: 'underline' }}>http://localhost:5000</a> 访问
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => window.location.href = 'http://localhost:5000'}
              style={{
                padding: '0.5rem 1rem',
                background: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '600'
              }}
            >
              跳转到 localhost
            </button>
            <button
              onClick={() => window.location.href = '/diagnose-domain'}
              style={{
                padding: '0.5rem 1rem',
                background: 'white',
                color: '#991b1b',
                border: '1px solid #dc2626',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '600'
              }}
            >
              诊断详情
            </button>
            <button
              onClick={() => setIsWrongDomain(false)}
              style={{
                padding: '0.5rem 1rem',
                background: 'transparent',
                color: '#991b1b',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                textDecoration: 'underline'
              }}
            >
              暂时忽略
            </button>
          </div>
        </div>
      )}

      {/* 首页内容 */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(1rem, 4vw, 2rem)',
        position: 'relative'
      }}>
      {/* 纹理背景 */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" /%3E%3C/filter%3E%3Crect width="100" height="100" filter="url(%23noise)" opacity="0.03"/%3E%3C/svg%3E") repeat',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      {/* 星点装饰 */}
      <StarField />

      <style>{`
        @keyframes softFloat {
          0%, 100% { transform: translateY(0px); opacity: 0.6; }
          50% { transform: translateY(-10px); opacity: 0.8; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* 内容容器 */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        textAlign: 'center',
        maxWidth: 'clamp(320px, 90vw, 850px)',
        animation: 'fadeIn 1s ease-out'
      }}>
        {/* 装饰圆框 */}
        <div style={{
          width: 'clamp(180px, 45vw, 280px)',
          height: 'clamp(180px, 45vw, 280px)',
          margin: '0 auto 2rem',
          borderRadius: '50%',
          border: `4px solid ${colors.gold}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '5rem',
          background: `radial-gradient(circle at 30% 30%, ${colors.lightAccent}15, transparent)`,
          boxShadow: `inset 0 0 30px ${colors.gold}25, 0 0 30px ${colors.gold}15`,
          position: 'relative'
        }}>
          {/* 内层装饰 */}
          <div style={{
            position: 'absolute',
            inset: '15px',
            borderRadius: '50%',
            border: `1px dashed ${colors.gold}`,
            opacity: 0.4
          }} />
          <span style={{ animation: 'softFloat 3s ease-in-out infinite' }}>🌿</span>
        </div>

        {/* 标题 */}
        <h1 style={{
          fontSize: 'clamp(1.5rem, 5vw, 2.8rem)',
          fontWeight: '700',
          color: colors.darkGold,
          marginBottom: '0.5rem',
          letterSpacing: '0.08em',
          textShadow: `0 2px 4px ${colors.gold}20`,
          fontFamily: 'Georgia, serif'
        }}>
          草药占星神谕卡
        </h1>

        {/* 符号装饰 */}
        <div style={{
          fontSize: 'clamp(0.9rem, 3vw, 1.2rem)',
          color: colors.accent,
          letterSpacing: '0.6em',
          marginBottom: '1rem',
          opacity: 0.8
        }}>
          ☀️ 🌙 ♀️ ♂️ ☿️
        </div>

        {/* 副标题 */}
        <p style={{
          fontSize: 'clamp(0.85rem, 2.5vw, 1.1rem)',
          color: colors.lightText,
          fontStyle: 'italic',
          marginBottom: '2.5rem',
          letterSpacing: '0.05em',
          fontWeight: '300'
        }}>
          占星医学与草本智慧的古老融合
        </p>

        {/* 引言框 */}
        <div style={{
          maxWidth: 'clamp(280px, 85vw, 700px)',
          margin: '0 auto 2rem',
          padding: 'clamp(1rem, 3vw, 2rem) clamp(1.2rem, 4vw, 2.5rem)',
          borderTop: `2px solid ${colors.gold}`,
          borderBottom: `2px solid ${colors.gold}`,
          background: `linear-gradient(90deg, ${colors.gold}08 0%, transparent 20%, transparent 80%, ${colors.gold}08 100%)`,
          color: colors.text,
          lineHeight: '1.9',
          fontSize: '0.95rem'
        }}>
          <p style={{ marginBottom: '1rem' }}>
            <span style={{ color: colors.darkGold, fontWeight: '700' }}>占星草药学是"灵魂的投射"。</span>
          </p>
          <p style={{ marginBottom: '1rem', color: colors.lightText }}>
            当你面对这些卡牌时，请记住：你不是被行星的变幻所主宰，而是正在学习如何有意识地引导能量。
          </p>
          <p style={{ marginBottom: '1rem', color: colors.lightText, fontSize: '0.9rem' }}>
            如果抽到了逆位牌，那只是提醒你当前频率可能受阻，需要通过特定的草药行动（如泻下、润滑或加热）来寻找内在平衡。
          </p>
          <p style={{
            color: colors.accent,
            fontSize: '0.9rem',
            fontStyle: 'italic',
            marginTop: '1rem'
          }}>
            "守护你的心（太阳），因为它是所有生命力的源泉。"
          </p>
        </div>

        {/* 按钮 */}
        <button
          onClick={() => setViewState('intention')}
          type="button"
          style={{
            padding: 'clamp(0.8rem, 2.5vw, 1.2rem) clamp(1.5rem, 6vw, 3rem)',
            fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
            fontWeight: '600',
            borderRadius: '40px',
            border: `2px solid ${colors.gold}`,
            background: `linear-gradient(135deg, ${colors.gold}15 0%, ${colors.accent}08 100%)`,
            color: colors.darkGold,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            letterSpacing: '0.05em',
            boxShadow: `0 4px 15px ${colors.gold}20`,
            fontFamily: 'Georgia, serif'
          }}
          onMouseEnter={(e) => {
            const target = e.currentTarget as HTMLButtonElement;
            target.style.background = `linear-gradient(135deg, ${colors.gold}25 0%, ${colors.accent}15 100%)`;
            target.style.boxShadow = `0 6px 20px ${colors.gold}35`;
            target.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            const target = e.currentTarget as HTMLButtonElement;
            target.style.background = `linear-gradient(135deg, ${colors.gold}15 0%, ${colors.accent}08 100%)`;
            target.style.boxShadow = `0 4px 15px ${colors.gold}20`;
            target.style.transform = 'translateY(0)';
          }}
        >
          ✨ 开启占卜之旅 →
        </button>

        {/* 底部引言 */}
        <div style={{
          marginTop: '3rem',
          color: colors.lightText,
          fontSize: '0.85rem',
          letterSpacing: '0.1em',
          opacity: 0.7
        }}>
          ✧ 闭上眼，听从你内在的声音 ✧
        </div>
      </div>
      </div>
    </div>
  );

  // ========== 意图页面 ==========
  const IntentionPage = () => (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(135deg, #ebe6dd 0%, ${colors.bg} 50%, #e8e2d9 100%)`,
      position: 'relative',
      overflow: 'hidden',
      padding: 'clamp(1rem, 4vw, 2rem)',
      display: 'flex',
      flexDirection: 'column',
      paddingTop: '2rem'
    }}>
      <WeChatAlert />

      {/* 纹理背景 */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" /%3E%3C/filter%3E%3Crect width="100" height="100" filter="url(%23noise)" opacity="0.04"/%3E%3C/svg%3E") repeat',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      <StarField />

      {/* 返回按钮 */}
      <button
        onClick={() => setViewState('home')}
        type="button"
        style={{
          position: 'absolute',
          top: 'clamp(1rem, 3vw, 2rem)',
          left: 'clamp(1rem, 3vw, 2rem)',
          padding: 'clamp(0.5rem, 1.5vw, 0.75rem) clamp(1rem, 3vw, 1.5rem)',
          background: `${colors.bg}`,
          border: `1px solid ${colors.gold}`,
          color: colors.darkGold,
          borderRadius: '40px',
          cursor: 'pointer',
          fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
          transition: 'all 0.3s',
          zIndex: 50,
          boxShadow: `0 2px 8px ${colors.gold}15`,
          fontWeight: '500'
        }}
        onMouseEnter={(e) => {
          const target = e.currentTarget as HTMLButtonElement;
          target.style.background = colors.gold + '15';
          target.style.boxShadow = `0 4px 12px ${colors.gold}25`;
        }}
        onMouseLeave={(e) => {
          const target = e.currentTarget as HTMLButtonElement;
          target.style.background = colors.bg;
          target.style.boxShadow = `0 2px 8px ${colors.gold}15`;
        }}
      >
        ← 返回
      </button>

      {/* 主容器 */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: 'clamp(320px, 90vw, 950px)',
        margin: '0 auto',
        width: '100%',
        padding: 'clamp(1rem, 4vw, 2rem)',
        position: 'relative',
        zIndex: 10
      }}>
        {/* 标题 */}
        <h2 style={{
          fontSize: 'clamp(1.3rem, 4.5vw, 2.5rem)',
          fontWeight: '700',
          color: colors.accent,
          marginBottom: '2rem',
          letterSpacing: '0.05em',
          fontFamily: 'Georgia, serif'
        }}>
          在触碰神谕之前
        </h2>

        {/* 冥想指南卡片 */}
        <div style={{
          maxWidth: 'clamp(280px, 85vw, 800px)',
          margin: '0 auto 2rem',
          padding: 'clamp(1.2rem, 3vw, 2.5rem)',
          borderTop: `3px solid ${colors.gold}`,
          borderBottom: `3px solid ${colors.gold}`,
          background: `linear-gradient(90deg, ${colors.gold}12 0%, transparent 15%, transparent 85%, ${colors.gold}12 100%)`,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: 'clamp(1rem, 3vw, 2rem)'
        }}>
          {[
            { num: '1', text: '闭上双眼，进行三次深长的呼吸' },
            { num: '2', text: '放下心中繁杂的噪音，感受大地' },
            { num: '3', text: '感知星空的浩瀚与宇宙的指引' },
            { num: '4', text: '带着清晰的意图开启占卜' }
          ].map((step, idx) => (
            <div key={idx} style={{ textAlign: 'center' }}>
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                border: `2px solid ${colors.gold}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
                background: `${colors.gold}12`,
                fontSize: '1.3rem',
                fontWeight: '700',
                color: colors.darkGold
              }}>
                {step.num}
              </div>
              <p style={{
                color: colors.text,
                fontSize: '0.9rem',
                lineHeight: '1.6',
                fontWeight: '500'
              }}>
                {step.text}
              </p>
            </div>
          ))}
        </div>

        {/* 分割线 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          margin: '2rem 0',
          width: '100%',
          maxWidth: 'clamp(280px, 80vw, 600px)'
        }}>
          <div style={{
            flex: 1,
            height: '1px',
            background: `linear-gradient(90deg, transparent, ${colors.gold}40)`
          }} />
          <span style={{
            color: colors.accent,
            fontSize: '0.75rem',
            letterSpacing: '0.2em',
            whiteSpace: 'nowrap',
            fontWeight: '600'
          }}>
            ✧ 设定意图 · 开启占卜 ✧
          </span>
          <div style={{
            flex: 1,
            height: '1px',
            background: `linear-gradient(90deg, ${colors.gold}40, transparent)`
          }} />
        </div>

        {/* 意图选择区域 */}
        <div style={{
          maxWidth: 'clamp(300px, 90vw, 900px)',
          width: '100%',
          marginBottom: 'clamp(1.5rem, 4vw, 2rem)'
        }}>
          <label style={{
            display: 'block',
            color: colors.accent,
            fontSize: '0.95rem',
            fontWeight: '600',
            marginBottom: '1.5rem',
            textAlign: 'center',
            letterSpacing: '0.05em'
          }}>
            💫 请选择或输入你的查询意图 💫
          </label>

          {/* 意图卡片网格 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
            gap: 'clamp(0.5rem, 2vw, 1rem)',
            marginBottom: 'clamp(1.5rem, 4vw, 2rem)'
          }}>
            {intentionOptions.map((option, idx) => (
              <button
                key={idx}
                onClick={() => {
                  console.log('Option clicked:', option.title, option.desc);
                  setSelectedIntention(option.title);
                  setIntention(option.desc);
                }}
                type="button"
                style={{
                  padding: 'clamp(0.6rem, 2vw, 1.2rem)',
                  borderRadius: '8px',
                  border: `2px solid`,
                  borderColor: selectedIntention === option.title ? colors.darkGold : colors.gold,
                  background: selectedIntention === option.title
                    ? `${colors.gold}25`
                    : `${colors.gold}08`,
                  color: colors.text,
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.9rem',
                  fontWeight: selectedIntention === option.title ? '700' : '600'
                }}
                onMouseEnter={(e) => {
                  if (selectedIntention !== option.title) {
                    const target = e.currentTarget as HTMLButtonElement;
                    target.style.borderColor = colors.darkGold;
                    target.style.background = `${colors.gold}15`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedIntention !== option.title) {
                    const target = e.currentTarget as HTMLButtonElement;
                    target.style.borderColor = colors.gold;
                    target.style.background = `${colors.gold}08`;
                  }
                }}
              >
                <span style={{ fontSize: '1.8rem' }}>{option.emoji}</span>
                <span>{option.title}</span>
                <span style={{ fontSize: '0.7rem', color: colors.lightText, fontWeight: '400' }}>
                  {option.desc}
                </span>
              </button>
            ))}
          </div>

          {/* 分割 */}
          <div style={{
            textAlign: 'center',
            margin: 'clamp(1.5rem, 4vw, 2rem) 0',
            color: colors.lightText,
            fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)'
          }}>
            ——— 或输入你的个性化意图 ———
          </div>

          {/* 输入框 */}
          <textarea
            value={intention}
            onChange={(e) => {
              console.log('Textarea changed:', e.target.value);
              setIntention(e.target.value);
              setSelectedIntention(null);
            }}
            placeholder="例如：我想深入理解我目前面临的人生转折点，寻求草药与行星的智慧指引..."
            style={{
              width: '100%',
              padding: 'clamp(0.8rem, 2.5vw, 1.5rem)',
              borderRadius: '8px',
              border: `2px solid ${colors.gold}`,
              background: `${colors.gold}08`,
              color: colors.text,
              fontSize: 'clamp(0.85rem, 2.5vw, 0.95rem)',
              lineHeight: '1.6',
              resize: 'vertical',
              minHeight: 'clamp(80px, 20vw, 120px)',
              boxSizing: 'border-box',
              transition: 'all 0.3s',
              fontFamily: 'inherit'
            }}
            onFocus={(e) => {
              const target = e.currentTarget;
              target.style.borderColor = colors.darkGold;
              target.style.background = `${colors.gold}15`;
              target.style.boxShadow = `0 0 15px ${colors.gold}20`;
            }}
            onBlur={(e) => {
              const target = e.currentTarget;
              target.style.borderColor = colors.gold;
              target.style.background = `${colors.gold}08`;
              target.style.boxShadow = 'none';
            }}
          />

          {/* 清除按钮 */}
          {intention && (
            <button
              onClick={() => {
                setIntention('');
                setSelectedIntention(null);
              }}
              type="button"
              style={{
                marginTop: '0.75rem',
                fontSize: '0.85rem',
                color: colors.accent,
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                transition: 'color 0.3s',
                fontWeight: '500'
              }}
              onMouseEnter={(e) => {
                const target = e.currentTarget;
                target.style.color = colors.darkGold;
              }}
              onMouseLeave={(e) => {
                const target = e.currentTarget;
                target.style.color = colors.accent;
              }}
            >
              ✕ 清除意图
            </button>
          )}
        </div>

        {/* 确认框 */}
        {intention && (
          <div style={{
            maxWidth: 'clamp(280px, 85vw, 800px)',
            width: '100%',
            marginBottom: 'clamp(1.5rem, 4vw, 2rem)',
            padding: 'clamp(0.8rem, 2vw, 1.5rem)',
            borderLeft: `4px solid ${colors.darkGold}`,
            background: `linear-gradient(90deg, ${colors.gold}15 0%, transparent 100%)`,
            borderRadius: '0',
            border: `1px solid ${colors.gold}`,
            borderLeftWidth: '4px'
          }}>
            <p style={{
              color: colors.accent,
              fontSize: '0.875rem',
              marginBottom: '0.5rem',
              fontWeight: '600'
            }}>
              ✓ 你的意图已设定
            </p>
            <p style={{
              color: colors.text,
              fontSize: '1rem',
              lineHeight: '1.6',
              fontStyle: 'italic'
            }}>
              "{intention}"
            </p>
          </div>
        )}

        {/* 开始抽卡按钮 */}
        <button
          onClick={() => {
            const trimmedIntention = intention.trim();
            console.log('Button clicked, intention:', trimmedIntention);
            if (trimmedIntention) {
              handleDrawCard();
            } else {
              alert('请先选择或输入你的查询意图');
            }
          }}
          disabled={!intention.trim()}
          type="button"
          style={{
            padding: 'clamp(0.8rem, 2.5vw, 1.3rem) clamp(2rem, 7vw, 3.5rem)',
            fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
            fontWeight: '700',
            borderRadius: '40px',
            border: `2px solid`,
            borderColor: intention ? colors.gold : colors.lightText,
            background: intention
              ? `linear-gradient(135deg, ${colors.gold}20 0%, ${colors.accent}10 100%)`
              : `${colors.lightText}15`,
            color: intention ? colors.darkGold : colors.lightText,
            cursor: intention ? 'pointer' : 'not-allowed',
            transition: 'all 0.3s',
            opacity: intention ? 1 : 0.6,
            boxShadow: intention ? `0 4px 15px ${colors.gold}20` : 'none',
            letterSpacing: '0.05em',
            fontFamily: 'Georgia, serif'
          }}
          onMouseEnter={(e) => {
            if (intention) {
              const target = e.currentTarget as HTMLButtonElement;
              target.style.background = `linear-gradient(135deg, ${colors.gold}30 0%, ${colors.accent}15 100%)`;
              target.style.boxShadow = `0 6px 20px ${colors.gold}30`;
              target.style.transform = 'translateY(-2px)';
            }
          }}
          onMouseLeave={(e) => {
            if (intention) {
              const target = e.currentTarget as HTMLButtonElement;
              target.style.background = `linear-gradient(135deg, ${colors.gold}20 0%, ${colors.accent}10 100%)`;
              target.style.boxShadow = `0 4px 15px ${colors.gold}20`;
              target.style.transform = 'translateY(0)';
            }
          }}
        >
          ❤️ 开始抽卡 →
        </button>
      </div>
    </div>
  );

  // 抽卡处理函数
  const handleDrawCard = () => {
    const trimmedIntention = intention.trim();
    console.log('handleDrawCard called, intention:', trimmedIntention);

    if (!trimmedIntention) {
      console.error('Intention is empty');
      alert('请先选择或输入你的查询意图');
      return;
    }

    setViewState('reading');
    setTimeout(() => {
      try {
        // 获取所有卡牌并随机抽取一张
        const cards = getOracleCards();
        console.log('Cards loaded:', cards.length);
        const randomIndex = Math.floor(Math.random() * cards.length);
        const card = cards[randomIndex];
        console.log('Selected card:', card);

        // 随机决定正位或逆位（各50%概率）
        const reversed = Math.random() < 0.5;

        setSelectedCard(card);
        setIsCardReversed(reversed);
        setViewState('card-interpretation');
      } catch (error) {
        console.error('Error in handleDrawCard:', error);
        alert('抽卡过程中出现错误，请重试');
        setViewState('intention');
      }
    }, 2000);
  };

  // ========== 占卜进行中 ==========
  const ReadingPage = () => (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(135deg, #ebe6dd 0%, ${colors.bg} 50%, #e8e2d9 100%)`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'clamp(1rem, 4vw, 2rem)',
      position: 'relative'
    }}>
      <WeChatAlert />

      <StarField />

      <div style={{
        position: 'relative',
        zIndex: 10,
        textAlign: 'center',
        maxWidth: 'clamp(280px, 85vw, 600px)'
      }}>
        <h2 style={{
          fontSize: 'clamp(1.3rem, 4.5vw, 2.3rem)',
          fontWeight: '700',
          color: colors.darkGold,
          marginBottom: '1.5rem',
          fontFamily: 'Georgia, serif'
        }}>
          正在抽卡中...
        </h2>
        <p style={{
          color: colors.accent,
          marginBottom: '1.5rem',
          fontSize: '1rem',
          fontWeight: '600'
        }}>
          你的意图：
        </p>
        <p style={{
          color: colors.text,
          marginBottom: '2rem',
          fontStyle: 'italic',
          fontSize: '0.95rem',
          lineHeight: '1.7'
        }}>
          "{intention}"
        </p>
        <p style={{
          color: colors.lightText,
          marginBottom: '3rem',
          fontSize: '0.9rem',
          letterSpacing: '0.05em'
        }}>
          请稍等，神谕正在显现...
        </p>
        <button
          onClick={() => setViewState('intention')}
          type="button"
          style={{
            padding: 'clamp(0.7rem, 2vw, 1rem) clamp(1.5rem, 5vw, 2.5rem)',
            background: colors.accent,
            color: colors.bg,
            border: 'none',
            borderRadius: '40px',
            cursor: 'pointer',
            fontSize: 'clamp(0.85rem, 2.5vw, 0.95rem)',
            transition: 'all 0.3s',
            fontWeight: '600',
            boxShadow: `0 4px 12px ${colors.accent}30`,
            letterSpacing: '0.05em'
          }}
          onMouseEnter={(e) => {
            const target = e.currentTarget;
            target.style.background = colors.lightAccent;
            target.style.boxShadow = `0 6px 16px ${colors.accent}40`;
            target.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            const target = e.currentTarget;
            target.style.background = colors.accent;
            target.style.boxShadow = `0 4px 12px ${colors.accent}30`;
            target.style.transform = 'translateY(0)';
          }}
        >
          返回设置意图
        </button>
      </div>
    </div>
  );

  // 返回首页
  const handleBackToHome = () => {
    setSelectedCard(null);
    setIsCardReversed(false);
    setIntention('');
    setSelectedIntention(null);
    setViewState('home');
  };

  // 返回意图页
  const handleBackToIntention = () => {
    setSelectedCard(null);
    setIsCardReversed(false);
    setViewState('intention');
  };

  return (
    <div>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultTab={authModalTab}
      />
      {viewState === 'home' && <HomePage />}
      {viewState === 'intention' && <IntentionPage />}
      {viewState === 'reading' && <ReadingPage />}
      {viewState === 'card-interpretation' && selectedCard && (
        <CardInterpretation
          card={selectedCard}
          isReversed={isCardReversed}
          onBack={handleBackToIntention}
          onBackToHome={handleBackToHome}
          intention={intention}
        />
      )}
    </div>
  );
}
