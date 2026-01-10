'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { OracleCard } from '@/types/oracle-card';
import { getDetailedInterpretation } from '@/data/oracle-interpretations';
import { getPlanetGroupInterpretation } from '@/data/planet-group-interpretations';
import { useAuth } from '@/context/AuthContext';
import { Save, CheckCircle, AlertCircle, Download, AlertTriangle } from 'lucide-react';
import html2canvas from 'html2canvas';

interface CardInterpretationProps {
  card: OracleCard;
  isReversed?: boolean;
  onBack: () => void;
  onBackToHome?: () => void;
  intention?: string;
}

export default function CardInterpretation({
  card,
  isReversed = false,
  onBack,
  onBackToHome,
  intention,
}: CardInterpretationProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [saveStatus, setSaveStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // 检测是否在微信浏览器中
  const isWeChat = /micromessenger/i.test(navigator.userAgent);

  const displayReversed = isReversed;

  // 获取详细解读
  const detailedInterpretation = getDetailedInterpretation(card.id);

  // 获取行星组解读
  const planetGroup = card.planet ? getPlanetGroupInterpretation(card.planet) : undefined;

  // 颜色系统
  const colors = {
    bg: '#f5f1ed',
    darkBg: '#3d3528',
    darkGreen: '#4a7c59',
    darkerGreen: '#3a6348',
    gold: '#c9a961',
    darkGold: '#a0845a',
    text: '#4a4139',
    lightText: '#8b8176',
    accent: '#6b8e5f',
    lightAccent: '#9db88b'
  };

  const handleBackClick = () => {
    console.log('Back button clicked');
    onBack();
  };

  const handleBackToHomeClick = () => {
    console.log('Back to home button clicked');
    if (onBackToHome) {
      onBackToHome();
    } else {
      onBack();
    }
  };

  // 保存到历史记录
  const handleSaveHistory = async (retryCount = 0) => {
    console.log('[CardInterpretation] ========== 开始保存历史记录 ==========');
    console.log('[CardInterpretation] 用户状态:', user);
    console.log('[CardInterpretation] 意图:', intention);
    console.log('[CardInterpretation] 卡牌ID:', card.id);
    console.log('[CardInterpretation] 重试次数:', retryCount);

    if (!user) {
      console.error('[CardInterpretation] 保存失败: 用户未登录');
      alert('请先登录后再保存占卜记录');
      return;
    }

    if (!intention) {
      console.error('[CardInterpretation] 保存失败: 缺少占卜意图');
      alert('无法保存：缺少占卜意图');
      return;
    }

    setSaveStatus('loading');

    try {
      // 获取 localStorage 中的 token（用于 Coze 环境）
      const token = localStorage.getItem('auth-token');

      console.log('[CardInterpretation] ========== 开始验证用户状态 ==========');
      console.log('[CardInterpretation] 重试次数:', retryCount);
      console.log('[CardInterpretation] 当前用户状态（本地）:', user);
      console.log('[CardInterpretation] document.cookie (前50字符):', document.cookie.substring(0, 50));
      console.log('[CardInterpretation] localStorage token 存在:', !!token);

      // 构建请求头，同时发送 Cookie 和 Authorization header
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      // 如果 localStorage 中有 token，添加到 Authorization header
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const verifyResponse = await fetch('/api/auth/me', {
        credentials: 'include', // 确保发送 Cookie
        headers,
      });

      console.log('[CardInterpretation] 验证响应状态码:', verifyResponse.status);
      console.log('[CardInterpretation] 验证响应 Content-Type:', verifyResponse.headers.get('content-type'));

      // 解析 JSON
      let verifyData;
      try {
        verifyData = await verifyResponse.json();
        console.log('[CardInterpretation] 用户状态验证结果:', verifyData);
      } catch (parseError) {
        console.error('[CardInterpretation] JSON 解析失败:', parseError);
        const responseText = await verifyResponse.text();
        console.error('[CardInterpretation] 响应文本:', responseText.substring(0, 500));

        // 如果是第一次失败，尝试等待后重试
        if (retryCount === 0) {
          console.log('[CardInterpretation] 首次验证失败，等待 500ms 后重试...');
          setSaveStatus('idle');
          await new Promise(resolve => setTimeout(resolve, 500));
          return handleSaveHistory(1);
        }

        setSaveStatus('error');
        alert('服务器响应异常，请稍后重试');
        return;
      }

      // 详细记录验证失败的原因
      if (!verifyData || verifyData.success !== true || !verifyData.user) {
        console.error('[CardInterpretation] 验证失败详情:');
        console.error('  - verifyData:', verifyData);
        console.error('  - verifyData.success:', verifyData?.success);
        console.error('  - verifyData.user:', verifyData?.user);
        console.error('  - verifyData.error:', verifyData?.error);
      }

      // 使用更清晰的判断条件：success 必须明确为 true
      if (verifyData.success !== true || !verifyData.user) {
        console.error('[CardInterpretation] 用户状态验证失败');

        // 如果是第一次验证失败，尝试等待后重试
        if (retryCount === 0) {
          console.log('[CardInterpretation] 首次验证失败，等待 500ms 后重试...');
          setSaveStatus('idle');
          await new Promise(resolve => setTimeout(resolve, 500));
          return handleSaveHistory(1); // 重试一次
        }

        // 第二次仍然失败，提示用户重新登录
        setSaveStatus('error');
        alert('登录已过期，请重新登录');
        router.push('/?refresh=1');
        return;
      }

      console.log('[CardInterpretation] 用户状态验证成功，开始保存...');

      // 获取 localStorage 中的 token（用于 Coze 环境）
      const saveToken = localStorage.getItem('auth-token');

      // 构建请求头，同时发送 Cookie 和 Authorization header
      const saveHeaders: HeadersInit = {
        'Content-Type': 'application/json',
      };

      // 如果 localStorage 中有 token，添加到 Authorization header
      if (saveToken) {
        saveHeaders['Authorization'] = `Bearer ${saveToken}`;
      }

      // 将 card.id 转换为数字（API 期望数字数组）
      const cardIdNumber = parseInt(card.id, 10);

      const response = await fetch('/api/history', {
        method: 'POST',
        headers: saveHeaders,
        credentials: 'include', // 确保发送 Cookie
        body: JSON.stringify({
          cards: [cardIdNumber],
          intention: intention,
        }),
      });

      const data = await response.json();
      console.log('[CardInterpretation] 保存 API 响应:', data);
      console.log('[CardInterpretation] 响应状态码:', response.status);

      if (data.success) {
        console.log('[CardInterpretation] 保存成功！');
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        console.error('[CardInterpretation] 保存失败:', data.error);
        setSaveStatus('error');

        if (response.status === 401) {
          alert('登录已过期，请重新登录');
          router.push('/?refresh=1');
        } else {
          alert('保存失败: ' + (data.error || '未知错误'));
        }
      }
    } catch (error) {
      console.error('[CardInterpretation] 保存过程出错:', error);

      // 如果是网络错误且是第一次尝试，重试一次
      if (retryCount === 0) {
        console.log('[CardInterpretation] 网络错误，等待 500ms 后重试...');
        setSaveStatus('idle');
        await new Promise(resolve => setTimeout(resolve, 500));
        return handleSaveHistory(1);
      }

      setSaveStatus('error');
      alert('保存失败，请稍后重试');
    }

    console.log('[CardInterpretation] ========== 保存流程结束 ==========');
  };

  // 导出为图片
  const handleExportImage = async () => {
    console.log('[CardInterpretation] 开始导出图片...');

    try {
      const element = document.getElementById('card-interpretation-export');
      if (!element) {
        console.error('[CardInterpretation] 导出失败：找不到容器元素');
        alert('导出失败，请稍后重试');
        return;
      }

      // 等待图片加载完成
      const images = element.querySelectorAll('img');
      const imageLoadPromises = Array.from(images).map((img) => {
        return new Promise((resolve) => {
          if (img.complete) {
            resolve(true);
          } else {
            img.onload = () => resolve(true);
            img.onerror = () => resolve(true);
          }
        });
      });

      await Promise.all(imageLoadPromises);

      // 保存原始样式
      const originalStyles = {
        width: element.style.width,
        maxWidth: element.style.maxWidth,
        padding: element.style.padding,
        fontSize: element.style.fontSize,
      };

      // 临时设置导出样式（适配手机）
      const screenWidth = window.innerWidth;
      const isMobile = screenWidth < 768;
      const exportWidth = isMobile ? screenWidth - 32 : 600; // 手机使用全宽，桌面使用 600px

      // 设置导出样式
      element.style.width = `${exportWidth}px`;
      element.style.maxWidth = `${exportWidth}px`;
      element.style.padding = '16px';
      element.style.fontSize = isMobile ? '14px' : '16px';

      try {
        // 使用 html2canvas 生成图片
        const canvas = await html2canvas(element, {
          scale: 1.5, // 适度提高分辨率，避免文件过大
          useCORS: true, // 支持跨域图片
          backgroundColor: '#f5f1ed', // 背景色
          logging: false,
          allowTaint: true,
          windowWidth: exportWidth, // 设置窗口宽度
          scrollX: 0,
          scrollY: 0,
        });

        // 下载图片
        const link = document.createElement('a');
        const cardName = card.name.split(' ')[0]; // 提取中文名
        link.download = `神谕卡-${cardName}-${isReversed ? '逆位' : '正位'}.png`;
        link.href = canvas.toDataURL('image/png', 0.9); // 稍微降低质量以减小文件大小
        link.click();

        console.log('[CardInterpretation] 导出图片成功，尺寸:', exportWidth, 'x', canvas.height);
      } finally {
        // 恢复原始样式
        element.style.width = originalStyles.width;
        element.style.maxWidth = originalStyles.maxWidth;
        element.style.padding = originalStyles.padding;
        element.style.fontSize = originalStyles.fontSize;
      }
    } catch (error) {
      console.error('[CardInterpretation] 导出图片失败:', error);
      alert('导出失败，请稍后重试');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(135deg, #ebe6dd 0%, ${colors.bg} 50%, #e8e2d9 100%)`,
      position: 'relative',
      overflow: 'auto',
      padding: 'clamp(1rem, 4vw, 2rem)'
    }}>
      {/* 背景纹理 */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'url("data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noise"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" /%3E%3C/filter%3E%3Crect width="100" height="100" filter="url(%23noise)" opacity="0.03"/%3E%3C/svg%3E") repeat',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      {/* 微信浏览器提示 */}
      {isWeChat && (
        <div style={{
          position: 'fixed',
          top: '0',
          left: '0',
          right: '0',
          background: 'linear-gradient(135deg, #fff8e1 0%, #fff3cd 100%)',
          borderBottom: '2px solid #ffc107',
          padding: '1rem clamp(0.8rem, 2vw, 1.2rem)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          boxShadow: '0 2px 8px rgba(255, 193, 7, 0.3)',
        }}>
          <AlertTriangle size={20} style={{ color: '#f57c00', flexShrink: 0 }} />
          <div style={{
            flex: 1,
            fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
            color: '#5d4037',
            lineHeight: '1.5',
            fontFamily: 'Georgia, serif',
          }}>
            <span style={{ fontWeight: '700', color: '#e65100' }}>提示：</span>
            如需导出结果图片，请在外部浏览器中进行占卜
          </div>
        </div>
      )}

      {/* 返回按钮 */}
      <button
        onClick={handleBackClick}
        style={{
          position: 'fixed',
          top: isWeChat ? 'clamp(4rem, 10vw, 5rem)' : 'clamp(1rem, 3vw, 2rem)',
          left: 'clamp(1rem, 3vw, 2rem)',
          padding: 'clamp(0.5rem, 1.5vw, 0.75rem) clamp(1rem, 3vw, 1.5rem)',
          background: colors.bg,
          border: `1px solid ${colors.gold}`,
          color: colors.darkGold,
          borderRadius: '40px',
          cursor: 'pointer',
          fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
          zIndex: 50,
          boxShadow: `0 2px 8px ${colors.gold}15`,
          fontWeight: '500',
          transition: 'all 0.3s',
          fontFamily: 'Georgia, serif'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = colors.gold + '15';
          e.currentTarget.style.boxShadow = `0 4px 12px ${colors.gold}25`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = colors.bg;
          e.currentTarget.style.boxShadow = `0 2px 8px ${colors.gold}15`;
        }}
      >
        ← 返回结果
      </button>

      {/* 重新洗牌按钮 */}
      <button
        onClick={handleBackToHomeClick}
        style={{
          position: 'fixed',
          top: isWeChat ? 'clamp(4rem, 10vw, 5rem)' : 'clamp(1rem, 3vw, 2rem)',
          right: user && intention ? 'clamp(11rem, 25vw, 16rem)' : 'clamp(1rem, 3vw, 2rem)',
          padding: 'clamp(0.5rem, 1.5vw, 0.75rem) clamp(1rem, 3vw, 1.5rem)',
          background: colors.bg,
          border: `1px solid ${colors.gold}`,
          color: colors.darkGold,
          borderRadius: '40px',
          cursor: 'pointer',
          fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
          zIndex: 50,
          boxShadow: `0 2px 8px ${colors.gold}15`,
          fontWeight: '500',
          transition: 'all 0.3s',
          fontFamily: 'Georgia, serif'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = colors.gold + '15';
          e.currentTarget.style.boxShadow = `0 4px 12px ${colors.gold}25`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = colors.bg;
          e.currentTarget.style.boxShadow = `0 2px 8px ${colors.gold}15`;
        }}
      >
        🔄 重新洗牌
      </button>

      {/* 保存历史按钮（已隐藏） */}
      {false && user && intention && (
        <button
          onClick={() => handleSaveHistory()}
          disabled={saveStatus === 'loading' || saveStatus === 'success'}
          style={{
            position: 'fixed',
            top: 'clamp(1rem, 3vw, 2rem)',
            right: 'clamp(1rem, 3vw, 2rem)',
            padding: 'clamp(0.5rem, 1.5vw, 0.75rem) clamp(1rem, 3vw, 1.5rem)',
            background: saveStatus === 'success' ? colors.accent : colors.darkGreen,
            border: saveStatus === 'success' ? `1px solid ${colors.accent}` : `1px solid ${colors.darkGreen}`,
            color: 'white',
            borderRadius: '40px',
            cursor: saveStatus === 'loading' || saveStatus === 'success' ? 'default' : 'pointer',
            fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
            zIndex: 50,
            boxShadow: `0 2px 8px ${colors.darkGreen}15`,
            fontWeight: '500',
            transition: 'all 0.3s',
            fontFamily: 'Georgia, serif',
            opacity: saveStatus === 'loading' || saveStatus === 'success' ? 1 : undefined,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
          onMouseEnter={(e) => {
            if (saveStatus === 'idle' || saveStatus === 'error') {
              e.currentTarget.style.background = colors.darkerGreen;
              e.currentTarget.style.boxShadow = `0 4px 12px ${colors.darkGreen}25`;
            }
          }}
          onMouseLeave={(e) => {
            if (saveStatus === 'idle' || saveStatus === 'error') {
              e.currentTarget.style.background = colors.darkGreen;
              e.currentTarget.style.boxShadow = `0 2px 8px ${colors.darkGreen}15`;
            }
          }}
        >
          {saveStatus === 'loading' && <span>⏳</span>}
          {saveStatus === 'success' && <CheckCircle size={16} />}
          {saveStatus === 'error' && <AlertCircle size={16} />}
          {saveStatus === 'idle' && <Save size={16} />}
          {saveStatus === 'loading' && '保存中...'}
          {saveStatus === 'success' && '已保存'}
          {saveStatus === 'error' && '重试'}
          {saveStatus === 'idle' && '保存记录'}
        </button>
      )}

      <div style={{
        maxWidth: 'clamp(320px, 95vw, 1200px)',
        margin: '0 auto',
        paddingTop: isWeChat ? 'clamp(6rem, 12vw, 6rem)' : 'clamp(1.5rem, 4vw, 2rem)',
        paddingBottom: 'clamp(2rem, 5vw, 3rem)',
        position: 'relative',
        zIndex: 10
      }}>
        {/* 导出区域容器（用于图片导出） */}
        <div id="card-interpretation-export">
          {/* 标题 */}
          <div style={{
            textAlign: 'center',
            marginBottom: 'clamp(2rem, 5vw, 3rem)'
          }}>
            <h1 style={{
              fontSize: 'clamp(1.5rem, 5vw, 3rem)',
              fontWeight: '700',
              color: colors.darkGold,
              margin: '0 0 1rem',
              letterSpacing: '0.1em',
              fontFamily: 'Georgia, serif'
            }}>
              你的神谕
            </h1>
            <div style={{
              height: '2px',
              width: '80px',
              background: `linear-gradient(90deg, transparent, ${colors.gold}, transparent)`,
              margin: '0 auto',
              opacity: 0.6
            }} />
          </div>

        {/* 卡牌图片展示 */}
        <div style={{
          textAlign: 'center',
          marginBottom: 'clamp(2rem, 5vw, 3rem)'
        }}>
          <div style={{
            display: 'inline-block',
            background: colors.bg,
            border: `4px solid ${colors.gold}`,
            borderRadius: '16px',
            padding: 'clamp(0.8rem, 2vw, 1.5rem)',
            boxShadow: `0 12px 32px ${colors.gold}20`,
            maxWidth: 'clamp(260px, 70vw, 400px)',
            width: '100%'
          }}>
            <div
              style={{
                position: 'relative',
                background: 'white',
                borderRadius: '12px',
                overflow: 'hidden',
                aspectRatio: '2/3',
                boxShadow: `0 4px 16px ${colors.gold}15`,
                transform: displayReversed ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.5s ease'
              }}
            >
              {card.imageUrl && !card.imageUrl.includes('placeholder.url') ? (
                <img
                  src={card.imageUrl}
                  alt={card.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <div style={{
                  width: '100%',
                  height: '100%',
                  background: `linear-gradient(135deg, ${colors.gold}20, ${colors.accent}20)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{ fontSize: '4rem' }}>🌿</span>
                </div>
              )}
            </div>

            {/* 正逆位标签 */}
            <div style={{
              marginTop: '1.5rem',
              display: 'inline-block'
            }}>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1.5rem',
                borderRadius: '20px',
                fontSize: '0.95rem',
                fontWeight: '700',
                color: displayReversed ? '#92400e' : '#065f46',
                background: displayReversed ? '#fef3c7' : '#d1fae5',
                border: `2px solid ${displayReversed ? '#f59e0b' : '#10b981'}`,
                fontFamily: 'Georgia, serif'
              }}>
                {displayReversed ? '⚠️' : '✨'}
                {displayReversed ? '逆位' : '正位'}
              </span>
            </div>
          </div>
        </div>

        {/* 卡牌头部信息 */}
        <div style={{
          background: colors.bg,
          border: `3px solid ${colors.gold}`,
          borderRadius: '12px',
          padding: 'clamp(1.2rem, 3vw, 2.5rem)',
          marginBottom: 'clamp(2rem, 5vw, 3rem)',
          boxShadow: `0 8px 24px ${colors.gold}15`
        }}>
          {/* 顶部基础信息 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: 'clamp(1rem, 3vw, 2rem)',
            marginBottom: 'clamp(1.5rem, 4vw, 2rem)',
            paddingBottom: 'clamp(1.5rem, 4vw, 2rem)',
            borderBottom: `1px solid ${colors.gold}40`
          }}>
            {/* 卡号 */}
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: colors.lightText, fontSize: '0.85rem', margin: '0 0 0.5rem', fontWeight: '600' }}>
                卡牌编号
              </p>
              <p style={{
                fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
                color: colors.gold,
                fontWeight: '700',
                margin: 0,
                fontFamily: 'Georgia, serif'
              }}>
                No.{String(card.id).padStart(2, '0')}
              </p>
            </div>

            {/* 草药名 */}
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: colors.lightText, fontSize: '0.85rem', margin: '0 0 0.5rem', fontWeight: '600' }}>
                中文名
              </p>
              {/* 解析中文名和核心关键词 */}
              {(() => {
                const nameParts = (card.displayName || card.name).split(' ');
                const chineseName = nameParts.slice(1).join(' ').split(' ')[0];
                const keyword = nameParts.slice(1).join(' ').split(' ').slice(1).join(' ');
                return (
                  <>
                    <h2 style={{
                      fontSize: 'clamp(1.3rem, 4vw, 2rem)',
                      color: colors.darkGold,
                      margin: 0,
                      fontFamily: 'Georgia, serif'
                    }}>
                      {chineseName || card.name}
                    </h2>
                    <p style={{
                      fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
                      color: colors.accent,
                      margin: '0.5rem 0 0',
                      fontWeight: '600'
                    }}>
                      {keyword}
                    </p>
                  </>
                );
              })()}
              <p style={{
                fontSize: '0.85rem',
                color: colors.lightText,
                margin: '0.5rem 0 0',
                fontStyle: 'italic'
              }}>
                {card.latinName}
              </p>
            </div>

            {/* 行星位置 */}
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: colors.lightText, fontSize: '0.85rem', margin: '0 0 0.5rem', fontWeight: '600' }}>
                行星 / 位置
              </p>
              <p style={{
                fontSize: 'clamp(1rem, 3vw, 1.3rem)',
                color: colors.accent,
                fontWeight: '700',
                margin: 0
              }}>
                {card.planet}
              </p>
              <p style={{
                fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)',
                color: displayReversed ? '#d97706' : '#10b981',
                fontWeight: '700',
                margin: '0.5rem 0 0'
              }}>
                {displayReversed ? '逆位' : '正位'}
              </p>
            </div>
          </div>

          {/* 占星原型 */}
          <div>
            <p style={{
              color: colors.lightText,
              fontSize: '0.85rem',
              margin: '0 0 0.75rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}>
              占星原型
            </p>
            <p style={{
              color: colors.text,
              fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)',
              margin: 0,
              fontWeight: '600',
              fontFamily: 'Georgia, serif'
            }}>
              {card.archetype}
            </p>
          </div>
        </div>

        {/* 行星能量描述 */}
        {planetGroup && (
          <div style={{
            background: `linear-gradient(135deg, ${colors.gold}12 0%, transparent 100%)`,
            border: `2px solid ${colors.gold}`,
            borderRadius: '12px',
            padding: 'clamp(1rem, 3vw, 2rem)',
            marginBottom: 'clamp(2rem, 5vw, 3rem)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1rem'
            }}>
              <span style={{ fontSize: '2rem', minWidth: '2rem' }}>🌟</span>
              <div>
                <h3 style={{
                  color: colors.accent,
                  fontSize: 'clamp(1rem, 3vw, 1.2rem)',
                  fontWeight: '700',
                  margin: '0 0 0.75rem',
                  fontFamily: 'Georgia, serif'
                }}>
                  {planetGroup.planet}能量指引
                </h3>
                <p style={{
                  color: colors.text,
                  fontSize: '0.95rem',
                  lineHeight: '1.8',
                  margin: 0
                }}>
                  {planetGroup.description}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 关键词 */}
        {planetGroup && (
          <div style={{ marginBottom: 'clamp(2rem, 5vw, 3rem)' }}>
            <h3 style={{
              color: colors.accent,
              fontSize: 'clamp(1rem, 3vw, 1.3rem)',
              fontWeight: '700',
              marginBottom: '1.5rem',
              letterSpacing: '0.05em',
              fontFamily: 'Georgia, serif'
            }}>
              ✧ 核心关键词
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: 'clamp(0.8rem, 2vw, 1.5rem)'
            }}>
              {planetGroup.keywords.map((keyword, idx) => (
                <div
                  key={idx}
                  style={{
                    background: colors.bg,
                    border: `2px solid ${colors.gold}`,
                    borderRadius: '8px',
                    padding: 'clamp(0.8rem, 2vw, 1.5rem)',
                    textAlign: 'center',
                    transition: 'all 0.3s',
                    cursor: 'default'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = colors.darkGold;
                    e.currentTarget.style.boxShadow = `0 4px 12px ${colors.gold}20`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = colors.gold;
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <p style={{
                    color: colors.darkGold,
                    fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)',
                    fontWeight: '700',
                    margin: '0 0 0.5rem',
                    fontFamily: 'Georgia, serif'
                  }}>
                    {keyword}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 医疗属性 */}
        {detailedInterpretation && (
          <div style={{ marginBottom: 'clamp(2rem, 5vw, 3rem)' }}>
            <h3 style={{
              color: colors.accent,
              fontSize: 'clamp(1rem, 3vw, 1.3rem)',
              fontWeight: '700',
              marginBottom: '1.5rem',
              letterSpacing: '0.05em',
              fontFamily: 'Georgia, serif'
            }}>
              ✧ 医疗属性
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 'clamp(1rem, 3vw, 1.5rem)'
            }}>
              {/* 身体 */}
              <div style={{
                background: colors.bg,
                border: `2px solid ${colors.gold}`,
                borderRadius: '8px',
                padding: 'clamp(0.8rem, 2vw, 1.5rem)',
                boxShadow: `0 4px 12px ${colors.gold}10`
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '1rem',
                  paddingBottom: '1rem',
                  borderBottom: `1px solid ${colors.gold}40`
                }}>
                  <span style={{ fontSize: '1.5rem' }}>💪</span>
                  <h4 style={{
                    color: colors.darkGold,
                    fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)',
                    fontWeight: '700',
                    margin: 0,
                    fontFamily: 'Georgia, serif'
                  }}>
                    身体
                  </h4>
                </div>
                <p style={{
                  color: colors.text,
                  fontSize: '0.9rem',
                  lineHeight: '1.6',
                  fontWeight: '600',
                  margin: '0 0 0.75rem'
                }}>
                  {detailedInterpretation.body}
                </p>
              </div>

              {/* 心理 */}
              <div style={{
                background: colors.bg,
                border: `2px solid ${colors.gold}`,
                borderRadius: '8px',
                padding: 'clamp(0.8rem, 2vw, 1.5rem)',
                boxShadow: `0 4px 12px ${colors.gold}10`
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '1rem',
                  paddingBottom: '1rem',
                  borderBottom: `1px solid ${colors.gold}40`
                }}>
                  <span style={{ fontSize: '1.5rem' }}>🧠</span>
                  <h4 style={{
                    color: colors.darkGold,
                    fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)',
                    fontWeight: '700',
                    margin: 0,
                    fontFamily: 'Georgia, serif'
                  }}>
                    心理
                  </h4>
                </div>
                <p style={{
                  color: colors.text,
                  fontSize: '0.9rem',
                  lineHeight: '1.6',
                  fontWeight: '600',
                  margin: '0 0 0.75rem',
                  whiteSpace: 'pre-line'
                }}>
                  {detailedInterpretation.psychology}
                </p>
              </div>

              {/* 心灵 */}
              <div style={{
                background: colors.bg,
                border: `2px solid ${colors.gold}`,
                borderRadius: '8px',
                padding: 'clamp(0.8rem, 2vw, 1.5rem)',
                boxShadow: `0 4px 12px ${colors.gold}10`
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '1rem',
                  paddingBottom: '1rem',
                  borderBottom: `1px solid ${colors.gold}40`
                }}>
                  <span style={{ fontSize: '1.5rem' }}>✨</span>
                  <h4 style={{
                    color: colors.darkGold,
                    fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)',
                    fontWeight: '700',
                    margin: 0,
                    fontFamily: 'Georgia, serif'
                  }}>
                    心灵
                  </h4>
                </div>
                <p style={{
                  color: colors.text,
                  fontSize: '0.9rem',
                  lineHeight: '1.6',
                  fontWeight: '600',
                  margin: '0 0 0.75rem'
                }}>
                  {detailedInterpretation.spirit}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 逆位含义 */}
        {displayReversed && detailedInterpretation && (
          <div style={{
            background: 'linear-gradient(135deg, #d97706 8%, transparent)',
            border: '3px solid #d97706',
            borderRadius: '12px',
            padding: 'clamp(1rem, 3vw, 2rem)',
            marginBottom: 'clamp(2rem, 5vw, 3rem)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1rem'
            }}>
              <span style={{ fontSize: '2rem', minWidth: '2rem' }}>✗</span>
              <div>
                <h3 style={{
                  color: '#92400e',
                  fontSize: 'clamp(1rem, 3vw, 1.2rem)',
                  fontWeight: '700',
                  margin: '0 0 0.75rem',
                  fontFamily: 'Georgia, serif'
                }}>
                  逆位含义 - 关键提醒
                </h3>
                <p style={{
                  color: '#78350f',
                  fontSize: '0.95rem',
                  lineHeight: '1.8',
                  margin: 0,
                  fontWeight: '500'
                }}>
                  你可能陷入了能量的阻滞中。逆位提醒你需要通过特定的草药行动（如泻下、润滑或加热）来寻找内在平衡。疗愈始于面对，允许能量流动，而非压抑它们。
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 核心指引 */}
        {detailedInterpretation && (
          <div style={{
            background: `linear-gradient(135deg, ${colors.accent}12 0%, transparent 100%)`,
            border: `2px solid ${colors.accent}`,
            borderRadius: '12px',
            padding: 'clamp(1.2rem, 3vw, 2.5rem)',
            textAlign: 'center',
            marginBottom: 'clamp(2rem, 5vw, 3rem)'
          }}>
            <p style={{
              color: colors.lightText,
              fontSize: '0.85rem',
              margin: '0 0 1rem',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}>
              核心指引
            </p>
            <p style={{
              color: colors.darkGold,
              fontSize: 'clamp(1rem, 3vw, 1.3rem)',
              lineHeight: '1.9',
              margin: 0,
              fontStyle: 'italic',
              fontFamily: 'Georgia, serif',
              fontWeight: '600'
            }}>
              "{detailedInterpretation.guidance}"
            </p>
          </div>
        )}
        </div>
        {/* 导出区域结束 */}

        {/* 底部操作按钮 */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap',
          paddingTop: '2rem',
          borderTop: `1px solid ${colors.gold}40`
        }}>
          <button
            onClick={handleBackClick}
            style={{
              padding: 'clamp(0.7rem, 2vw, 1rem) clamp(1.5rem, 4vw, 2rem)',
              fontSize: 'clamp(0.85rem, 2.5vw, 0.95rem)',
              fontWeight: '700',
              borderRadius: '40px',
              border: `2px solid ${colors.gold}`,
              background: `linear-gradient(135deg, ${colors.gold}15 0%, ${colors.accent}08 100%)`,
              color: colors.darkGold,
              cursor: 'pointer',
              transition: 'all 0.3s',
              fontFamily: 'Georgia, serif'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = `linear-gradient(135deg, ${colors.gold}25 0%, ${colors.accent}15 100%)`;
              e.currentTarget.style.boxShadow = `0 4px 12px ${colors.gold}25`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = `linear-gradient(135deg, ${colors.gold}15 0%, ${colors.accent}08 100%)`;
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            ← 返回其他卡牌
          </button>

          <button
            onClick={() => {
              if (isWeChat) {
                alert('导出图片功能在外部浏览器中可用。\n\n请在浏览器中打开链接进行占卜和导出。');
              } else {
                handleExportImage();
              }
            }}
            style={{
              padding: 'clamp(0.7rem, 2vw, 1rem) clamp(1.5rem, 4vw, 2rem)',
              fontSize: 'clamp(0.85rem, 2.5vw, 0.95rem)',
              fontWeight: '700',
              borderRadius: '40px',
              border: `2px solid ${isWeChat ? colors.lightText : colors.gold}`,
              background: isWeChat
                ? `linear-gradient(135deg, #e0e0e0 0%, #d0d0d0 100%)`
                : `linear-gradient(135deg, ${colors.gold}25 0%, ${colors.darkGold}15 100%)`,
              color: isWeChat ? colors.lightText : colors.darkGold,
              cursor: isWeChat ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s',
              fontFamily: 'Georgia, serif',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
            onMouseEnter={(e) => {
              if (!isWeChat) {
                e.currentTarget.style.background = `linear-gradient(135deg, ${colors.gold}35 0%, ${colors.darkGold}25 100%)`;
                e.currentTarget.style.boxShadow = `0 4px 12px ${colors.gold}25`;
              }
            }}
            onMouseLeave={(e) => {
              if (!isWeChat) {
                e.currentTarget.style.background = `linear-gradient(135deg, ${colors.gold}25 0%, ${colors.darkGold}15 100%)`;
                e.currentTarget.style.boxShadow = 'none';
              }
            }}
          >
            <Download size={18} />
            导出图片
          </button>

          <button
            onClick={handleBackToHomeClick}
            style={{
              padding: 'clamp(0.7rem, 2vw, 1rem) clamp(1.5rem, 4vw, 2rem)',
              fontSize: 'clamp(0.85rem, 2.5vw, 0.95rem)',
              fontWeight: '700',
              borderRadius: '40px',
              border: `2px solid ${colors.accent}`,
              background: colors.accent,
              color: colors.bg,
              cursor: 'pointer',
              transition: 'all 0.3s',
              fontFamily: 'Georgia, serif'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = colors.lightAccent;
              e.currentTarget.style.boxShadow = `0 4px 12px ${colors.accent}35`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = colors.accent;
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            🔄 重新开始占卜
          </button>
        </div>
      </div>
    </div>
  );
}
