'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ChevronLeft, Trash2, Calendar, Star } from 'lucide-react';
import { getOracleCards } from '@/data/oracle-cards-csv';
import { getDetailedInterpretation } from '@/data/oracle-interpretations';
import { getPlanetGroupInterpretation } from '@/data/planet-group-interpretations';

interface HistoryDetail {
  id: number;
  userId: string;
  cards: number[];
  intention: string;
  interpretation: string | null;
  createdAt: string;
  updatedAt: string;
}

interface HistoryDetailResponse {
  success: boolean;
  history: HistoryDetail;
}

export default function HistoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = useParams<{ id: string }>();
  const [history, setHistory] = useState<HistoryDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [cards, setCards] = useState<any[]>([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
    lightAccent: '#9db88b',
  };

  // 加载历史记录详情
  useEffect(() => {
    const loadHistoryDetail = async () => {
      try {
        const response = await fetch(`/api/history/${resolvedParams.id}`);
        const data: HistoryDetailResponse = await response.json();

        if (data.success) {
          setHistory(data.history);

          // 加载卡牌信息
          const allCards = await getOracleCards();
          const cardDetails = data.history.cards.map((cardId: number) =>
            allCards.find((card) => card.id === String(cardId))
          ).filter(Boolean);
          setCards(cardDetails);
        } else {
          alert('加载失败: ' + (data as any).error);
          router.push('/history');
        }
      } catch (error) {
        console.error('加载历史记录详情失败:', error);
        alert('加载失败，请稍后重试');
        router.push('/history');
      } finally {
        setLoading(false);
      }
    };

    loadHistoryDetail();
  }, [resolvedParams.id, router]);

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/history/${resolvedParams.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        router.push('/history');
      } else {
        alert('删除失败: ' + data.error);
      }
    } catch (error) {
      console.error('删除失败:', error);
      alert('删除失败，请稍后重试');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}年${month}月${day}日 ${hours}:${minutes}`;
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: colors.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Georgia, serif',
      }}>
        <div style={{ color: colors.lightText }}>加载中...</div>
      </div>
    );
  }

  if (!history) {
    return null;
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.bg,
      fontFamily: 'Georgia, serif',
      position: 'relative',
    }}>
      {/* 顶部导航 */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: colors.darkGreen,
        padding: '20px 0',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        zIndex: 50,
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
          }}>
            <button
              onClick={() => router.push('/history')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '8px 12px',
                borderRadius: '5px',
                fontFamily: 'Georgia, serif',
              }}
            >
              <ChevronLeft size={20} />
              返回列表
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'rgba(255,255,255,0.9)',
              fontSize: '14px',
            }}>
              <Calendar size={16} />
              {formatDate(history.createdAt)}
            </div>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                cursor: 'pointer',
                color: 'white',
                padding: '8px 15px',
                borderRadius: '5px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontFamily: 'Georgia, serif',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
              }}
            >
              <Trash2 size={16} />
              删除
            </button>
          </div>
        </div>
      </div>

      {/* 内容区域 */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '100px 20px 40px',
      }}>
        {/* 占卜意图 */}
        <div style={{
          background: 'white',
          border: `2px solid ${colors.gold}`,
          borderRadius: '12px',
          padding: '30px',
          marginBottom: '30px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '15px',
          }}>
            <Star size={32} style={{ color: colors.gold }} />
            <div style={{ flex: 1 }}>
              <h3 style={{
                color: colors.darkGold,
                fontSize: '18px',
                fontWeight: 700,
                margin: '0 0 10px',
                fontFamily: 'Georgia, serif',
              }}>
                占卜意图
              </h3>
              <p style={{
                color: colors.text,
                fontSize: '16px',
                lineHeight: 1.6,
                margin: 0,
              }}>
                {history.intention}
              </p>
            </div>
          </div>
        </div>

        {/* 卡牌展示 */}
        <h2 style={{
          fontSize: '24px',
          fontWeight: 700,
          color: colors.darkGold,
          margin: '0 0 20px',
          fontFamily: 'Georgia, serif',
        }}>
          占卜卡牌 ({cards.length}张)
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '30px',
          marginBottom: '40px',
        }}>
          {cards.map((card, index) => {
            const planetGroup = card.planet ? getPlanetGroupInterpretation(card.planet) : undefined;

            return (
              <div
                key={card.id}
                style={{
                  background: 'white',
                  border: `3px solid ${colors.gold}`,
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
              >
                {/* 卡牌图片 */}
                <div style={{
                  position: 'relative',
                  aspectRatio: '2/3',
                  overflow: 'hidden',
                  background: '#f5f5f5',
                }}>
                  {card.imageUrl && !card.imageUrl.includes('placeholder.url') ? (
                    <img
                      src={card.imageUrl}
                      alt={card.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '100%',
                      background: `linear-gradient(135deg, ${colors.gold}20, ${colors.accent}20)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <span style={{ fontSize: '4rem' }}>🌿</span>
                    </div>
                  )}
                </div>

                {/* 卡牌信息 */}
                <div style={{ padding: '20px' }}>
                  {/* 编号 */}
                  <div style={{
                    textAlign: 'center',
                    marginBottom: '15px',
                  }}>
                    <span style={{
                      background: colors.bg,
                      padding: '4px 15px',
                      borderRadius: '15px',
                      fontSize: '14px',
                      color: colors.darkGold,
                      fontWeight: 600,
                    }}>
                      No.{String(card.id).padStart(2, '0')}
                    </span>
                  </div>

                  {/* 中文名 */}
                  {(() => {
                    const nameParts = (card.displayName || card.name).split(' ');
                    const chineseName = nameParts.slice(1).join(' ').split(' ')[0];
                    const keyword = nameParts.slice(1).join(' ').split(' ').slice(1).join(' ');
                    return (
                      <>
                        <h3 style={{
                          fontSize: '20px',
                          color: colors.darkGold,
                          margin: '0 0 5px',
                          textAlign: 'center',
                          fontWeight: 700,
                          fontFamily: 'Georgia, serif',
                        }}>
                          {chineseName || card.name}
                        </h3>
                        {keyword && (
                          <p style={{
                            fontSize: '14px',
                            color: colors.accent,
                            margin: '0 0 10px',
                            textAlign: 'center',
                            fontWeight: 600,
                          }}>
                            {keyword}
                          </p>
                        )}
                      </>
                    );
                  })()}

                  {/* 行星 */}
                  <div style={{
                    textAlign: 'center',
                    marginBottom: '15px',
                    paddingBottom: '15px',
                    borderBottom: `1px solid ${colors.gold}40`,
                  }}>
                    <div style={{
                      fontSize: '16px',
                      color: colors.accent,
                      fontWeight: 600,
                    }}>
                      {card.planet}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: colors.lightText,
                      marginTop: '4px',
                      fontStyle: 'italic',
                    }}>
                      {card.latinName}
                    </div>
                  </div>

                  {/* 占星原型 */}
                  <div style={{ marginBottom: '15px' }}>
                    <div style={{
                      fontSize: '12px',
                      color: colors.lightText,
                      marginBottom: '5px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}>
                      占星原型
                    </div>
                    <div style={{
                      fontSize: '14px',
                      color: colors.text,
                      fontWeight: 600,
                      lineHeight: 1.4,
                    }}>
                      {card.archetype}
                    </div>
                  </div>

                  {/* 关键词 */}
                  {planetGroup && planetGroup.keywords && (
                    <div>
                      <div style={{
                        fontSize: '12px',
                        color: colors.lightText,
                        marginBottom: '8px',
                        fontWeight: 600,
                      }}>
                        关键词
                      </div>
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '6px',
                      }}>
                        {planetGroup.keywords.slice(0, 3).map((keyword, idx) => (
                          <span
                            key={idx}
                            style={{
                              background: colors.bg,
                              padding: '4px 10px',
                              borderRadius: '12px',
                              fontSize: '12px',
                              color: colors.darkGold,
                              fontWeight: 600,
                            }}
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* AI解读 */}
        {history.interpretation && (
          <div style={{
            background: 'white',
            border: `2px solid ${colors.gold}`,
            borderRadius: '12px',
            padding: '30px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: 700,
              color: colors.darkGold,
              margin: '0 0 20px',
              fontFamily: 'Georgia, serif',
            }}>
              AI解读
            </h2>
            <div
              style={{
                color: colors.text,
                fontSize: '16px',
                lineHeight: 1.8,
                whiteSpace: 'pre-wrap',
              }}
            >
              {history.interpretation}
            </div>
          </div>
        )}
      </div>

      {/* 删除确认弹窗 */}
      {showDeleteConfirm && (
        <div
          onClick={() => setShowDeleteConfirm(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'white',
              borderRadius: '10px',
              padding: '30px',
              maxWidth: '400px',
              width: '90%',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            }}
          >
            <h3 style={{
              fontSize: '20px',
              fontWeight: 700,
              color: colors.text,
              margin: '0 0 15px',
              fontFamily: 'Georgia, serif',
            }}>
              确认删除
            </h3>
            <p style={{
              fontSize: '15px',
              color: colors.lightText,
              lineHeight: 1.6,
              margin: '0 0 25px',
            }}>
              确定要删除这条占卜记录吗？删除后无法恢复。
            </p>
            <div style={{
              display: 'flex',
              gap: '15px',
              justifyContent: 'flex-end',
            }}>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                style={{
                  padding: '10px 25px',
                  background: 'white',
                  border: '1px solid #ddd',
                  color: colors.text,
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontFamily: 'Georgia, serif',
                  fontSize: '15px',
                }}
              >
                取消
              </button>
              <button
                onClick={handleDelete}
                style={{
                  padding: '10px 25px',
                  background: '#ef4444',
                  border: 'none',
                  color: 'white',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontFamily: 'Georgia, serif',
                  fontSize: '15px',
                }}
              >
                删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
