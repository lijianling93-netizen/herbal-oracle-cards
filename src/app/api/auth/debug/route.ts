import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  console.log('[Debug API] ========== 调试请求 ==========');
  console.log('[Debug API] 请求 URL:', request.url);
  console.log('[Debug API] 请求方法:', request.method);

  // 获取所有 Cookies
  const allCookies = request.cookies.getAll();
  console.log('[Debug API] 所有 Cookies:', allCookies);

  const authToken = request.cookies.get("auth-token");
  console.log('[Debug API] auth-token 存在:', !!authToken);
  if (authToken) {
    console.log('[Debug API] auth-token 长度:', authToken.value.length);
    console.log('[Debug API] auth-token 前缀:', authToken.value.substring(0, 20));
  }

  // 返回调试信息
  return NextResponse.json({
    success: true,
    message: authToken ? "找到 auth-token cookie" : "未找到 auth-token cookie",
    cookies: allCookies.map(c => ({
      name: c.name,
      value: c.value.substring(0, 20) + '...', // 只显示前 20 个字符
    })),
    documentCookie: request.headers.get('cookie')?.substring(0, 100),
  });
}
