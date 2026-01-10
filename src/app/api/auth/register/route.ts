import { NextRequest, NextResponse } from "next/server";
import { userManager, type InsertUser } from "@/storage/database";
import { signToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 基本验证
    if (!body.email || !body.password) {
      return NextResponse.json(
        { error: "邮箱和密码不能为空" },
        { status: 400 }
      );
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: "请输入有效的邮箱地址" },
        { status: 400 }
      );
    }

    // 验证密码长度
    if (body.password.length < 6) {
      return NextResponse.json(
        { error: "密码至少6位" },
        { status: 400 }
      );
    }

    // 检查邮箱是否已注册
    const existingUser = await userManager.getUserByEmail(body.email);
    if (existingUser) {
      return NextResponse.json(
        { error: "该邮箱已被注册" },
        { status: 409 }
      );
    }

    // 创建用户
    const userData: InsertUser = {
      email: body.email,
      password: body.password,
      username: body.username || null,
      avatar: body.avatar || null,
    };

    const user = await userManager.createUser(userData);

    // 生成 JWT token
    const token = await signToken({
      userId: user.id,
      email: user.email,
      username: user.username,
    });

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
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: false, // 开发环境不使用 secure
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7天
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("注册失败:", error);
    return NextResponse.json(
      { error: "注册失败，请稍后重试" },
      { status: 500 }
    );
  }
}
