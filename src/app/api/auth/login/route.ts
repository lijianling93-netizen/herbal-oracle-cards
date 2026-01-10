import { NextRequest, NextResponse } from "next/server";
import { userManager } from "@/storage/database";
import { signToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    console.log('[Login API] ========== 登录请求开始 ==========');

    const body = await request.json();
    console.log('[Login API] 请求体:', { email: body.email, hasPassword: !!body.password });

    // 基本验证
    if (!body.email || !body.password) {
      console.log('[Login API] 缺少邮箱或密码');
      return NextResponse.json(
        { error: "邮箱和密码不能为空" },
        { status: 400 }
      );
    }

    // 验证用户凭据
    const user = await userManager.verifyUser(body.email, body.password);
    if (!user) {
      console.log('[Login API] 用户验证失败：邮箱或密码错误');
      return NextResponse.json(
        { error: "邮箱或密码错误" },
        { status: 401 }
      );
    }

    console.log('[Login API] 用户验证成功:', { id: user.id, email: user.email });

    // 生成 JWT token
    const token = await signToken({
      userId: user.id,
      email: user.email,
      username: user.username,
    });

    console.log('[Login API] Token 生成成功，长度:', token.length);

    // 返回用户信息和 token
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
      token,
    });

    // 设置 httpOnly cookie
    console.log('[Login API] 设置 Cookie...');
    const cookieOptions = {
      httpOnly: true,
      secure: false, // 开发环境不使用 secure
      sameSite: "lax" as const,
      maxAge: 60 * 60 * 24 * 7, // 7天
      path: "/",
    };
    response.cookies.set("auth-token", token, cookieOptions);
    console.log('[Login API] Cookie 设置完成，选项:', cookieOptions);

    console.log('[Login API] ========== 登录请求完成 ==========');
    return response;
  } catch (error) {
    console.error('[Login API] 登录失败:', error);
    return NextResponse.json(
      { error: "登录失败，请稍后重试" },
      { status: 500 }
    );
  }
}
