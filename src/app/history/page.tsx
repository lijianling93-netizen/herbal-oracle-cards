'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, ChevronLeft, Trash2, Leaf } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface HistoryItem {
  id: number;
  userId: string;
  cards: number[];
  intention: string;
  interpretation: string | null;
  createdAt: string;
  updatedAt: string;
}

interface HistoryResponse {
  success: boolean;
  histories: HistoryItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function HistoryPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [histories, setHistories] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);

  // 颜色系统
  const colors = {
    bg: '#f5f1ed',
    darkGreen: '#4a7c59',
    darkerGreen: '#3a6348',
    gold: '#c9a961',
    text: '#3a3a3a',
    lightText: '#8b8176',
  };

  // 加载历史记录
  const loadHistories = async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/history?page=${page}&limit=10`);
      const data: HistoryResponse = await response.json();

      if (data.success) {
        setHistories(data.histories);
        setTotalPages(data.pagination.totalPages);
        setTotal(data.pagination.total);
      } else {
        console.error('加载历史记录失败:', data);
      }
    } catch (error) {
      console.error('加载历史记录失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      router.push('/');
      return;
    }
    loadHistories(currentPage);
  }, [user, currentPage]);

  const handleCardClick = (id: number) => {
    router.push(`/history/${id}`);
  };

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();

    if (!confirm('确定要删除这条占卜记录吗？')) {
      return;
    }

    try {
      const response = await fetch(`/api/history/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        // 重新加载当前页
        loadHistories(currentPage);
      } else {
        alert('删除失败: ' + (data.error || '未知错误'));
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
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  const truncateText = (text: string, maxLength: number = 80) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: colors.bg,
      fontFamily: 'Georgia, serif',
    }}>
      {/* 顶部标题栏 */}
      <div style={{
        backgroundColor: colors.darkGreen,
        padding: '20px 0',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
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
              onClick={() => router.push('/')}
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
              返回
            </button>
            <h1 style={{
              color: 'white',
              margin: 0,
              fontSize: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}>
              <Leaf size={28} style={{ color: colors.gold }} />
              我的占卜记录
            </h1>
          </div>
          <div style={{
            color: 'rgba(255,255,255,0.9)',
            fontSize: '14px',
          }}>
            共 {total} 条记录
          </div>
        </div>
      </div>

      {/* 内容区域 */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '30px 20px',
      }}>
        {loading ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: colors.lightText,
          }}>
            加载中...
          </div>
        ) : histories.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: 'white',
            borderRadius: '10px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          }}>
            <p style={{
              color: colors.lightText,
              fontSize: '18px',
              marginBottom: '20px',
            }}>
              还没有占卜记录
            </p>
            <button
              onClick={() => router.push('/')}
              style={{
                backgroundColor: colors.darkGreen,
                color: 'white',
                padding: '12px 30px',
                border: 'none',
                borderRadius: '5px',
                fontSize: '16px',
                cursor: 'pointer',
                fontFamily: 'Georgia, serif',
                transition: 'background-color 0.2s',
              }}
            >
              开始占卜
            </button>
          </div>
        ) : (
          <>
            {/* 历史记录列表 */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '20px',
            }}>
              {histories.map((history) => (
                <div
                  key={history.id}
                  onClick={() => handleCardClick(history.id)}
                  style={{
                    background: 'white',
                    borderRadius: '10px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                    padding: '20px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: '1px solid #e5e5e5',
                    position: 'relative',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                  }}
                >
                  {/* 日期 */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '12px',
                    color: colors.lightText,
                    fontSize: '13px',
                  }}>
                    <Calendar size={16} />
                    {formatDate(history.createdAt)}
                  </div>

                  {/* 意图 */}
                  <div style={{
                    marginBottom: '12px',
                  }}>
                    <div style={{
                      fontSize: '14px',
                      color: colors.lightText,
                      marginBottom: '4px',
                    }}>
                      占卜意图
                    </div>
                    <div style={{
                      color: colors.text,
                      fontSize: '16px',
                      fontWeight: 500,
                      lineHeight: 1.4,
                    }}>
                      {truncateText(history.intention, 60)}
                    </div>
                  </div>

                  {/* 卡牌数量 */}
                  <div style={{
                    display: 'flex',
                    gap: '8px',
                    marginBottom: '12px',
                  }}>
                    <div style={{
                      background: colors.bg,
                      padding: '4px 10px',
                      borderRadius: '15px',
                      fontSize: '12px',
                      color: colors.lightText,
                    }}>
                      {history.cards.length} 张卡牌
                    </div>
                  </div>

                  {/* 解读预览 */}
                  {history.interpretation && (
                    <div style={{
                      fontSize: '14px',
                      color: colors.lightText,
                      lineHeight: 1.5,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>
                      {truncateText(history.interpretation, 80)}
                    </div>
                  )}

                  {/* 删除按钮 */}
                  <button
                    onClick={(e) => handleDelete(e, history.id)}
                    style={{
                      position: 'absolute',
                      top: '15px',
                      right: '15px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#ef4444',
                      padding: '5px',
                      borderRadius: '4px',
                      transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* 分页 */}
            {totalPages > 1 && (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '10px',
                marginTop: '40px',
              }}>
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  style={{
                    padding: '10px 20px',
                    background: currentPage === 1 ? '#e5e5e5' : colors.darkGreen,
                    color: currentPage === 1 ? '#999' : 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    fontFamily: 'Georgia, serif',
                    fontSize: '14px',
                  }}
                >
                  上一页
                </button>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        style={{
                          width: '40px',
                          height: '40px',
                          background: currentPage === pageNum ? colors.darkGreen : 'white',
                          color: currentPage === pageNum ? 'white' : colors.text,
                          border: currentPage === pageNum ? 'none' : '1px solid #e5e5e5',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          fontFamily: 'Georgia, serif',
                          fontSize: '14px',
                          transition: 'all 0.2s',
                        }}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  style={{
                    padding: '10px 20px',
                    background: currentPage === totalPages ? '#e5e5e5' : colors.darkGreen,
                    color: currentPage === totalPages ? '#999' : 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    fontFamily: 'Georgia, serif',
                    fontSize: '14px',
                  }}
                >
                  下一页
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
