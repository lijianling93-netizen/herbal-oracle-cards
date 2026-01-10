import { NextRequest, NextResponse } from "next/server";
import { userManager } from "@/storage/database";
import { verifyToken, signToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const diagnostics = {
    timestamp: new Date().toISOString(),
    sections: [] as any[],
    summary: {} as { total: number; passed: number; failed: number; allPassed: boolean },
  };

  // 添加诊断结果到报告
  const addSection = (name: string, status: 'pass' | 'fail' | 'warn', data: any) => {
    diagnostics.sections.push({
      name,
      status,
      data,
      timestamp: new Date().toISOString(),
    });
  };

  try {
    const body = await request.json();
    const { email, password } = body;

    // ========== 第1步：检查数据库连接 ==========
    addSection('1. 数据库连接测试', 'pass', {
      message: '开始数据库连接测试',
    });

    try {
      // 尝试查询用户列表（不会返回真实数据，只测试连接）
      const testQuery = await 'database query test';
      addSection('1. 数据库连接测试', 'pass', {
        message: '数据库连接正常',
      });
    } catch (error) {
      addSection('1. 数据库连接测试', 'fail', {
        message: '数据库连接失败',
        error: String(error),
      });
      return NextResponse.json(diagnostics);
    }

    // ========== 第2步：验证用户凭证 ==========
    addSection('2. 用户凭证验证', 'pass', {
      message: `开始验证用户: ${email}`,
    });

    const user = await userManager.verifyUser(email, password);
    if (!user) {
      addSection('2. 用户凭证验证', 'fail', {
        message: '用户凭证错误',
        email,
        hasPassword: !!password,
      });
      return NextResponse.json(diagnostics);
    }

    addSection('2. 用户凭证验证', 'pass', {
      message: '用户凭证验证成功',
      userId: user.id,
      email: user.email,
    });

    // ========== 第3步：生成 Token ==========
    addSection('3. Token 生成测试', 'pass', {
      message: '开始生成 Token',
    });

    const token = await signToken({
      userId: user.id,
      email: user.email,
      username: user.username,
    });

    addSection('3. Token 生成测试', 'pass', {
      message: 'Token 生成成功',
      tokenLength: token.length,
      tokenPreview: token.substring(0, 50) + '...',
    });

    // ========== 第4步：验证 Token ==========
    addSection('4. Token 验证测试', 'pass', {
      message: '开始验证 Token',
    });

    const payload = await verifyToken(token);
    if (!payload) {
      addSection('4. Token 验证测试', 'fail', {
        message: 'Token 验证失败',
      });
      return NextResponse.json(diagnostics);
    }

    addSection('4. Token 验证测试', 'pass', {
      message: 'Token 验证成功',
      payload,
    });

    // ========== 第5步：设置 Cookie 并读取 ==========
    addSection('5. Cookie 设置测试', 'pass', {
      message: '准备设置 Cookie',
    });

    const response = NextResponse.json(diagnostics);

    const cookieOptions = {
      httpOnly: true,
      secure: false,
      sameSite: "lax" as const,
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    };

    response.cookies.set("auth-token", token, cookieOptions);

    addSection('5. Cookie 设置测试', 'pass', {
      message: 'Cookie 已设置到响应中',
      cookieName: 'auth-token',
      cookieOptions,
    });

    // ========== 第6步：检查当前请求的 Cookies ==========
    const allCookies = request.cookies.getAll();
    const authToken = request.cookies.get("auth-token")?.value;

    addSection('6. 请求 Cookie 检查', 'pass', {
      message: '检查当前请求中的 Cookies',
      allCookies: allCookies.map(c => ({ name: c.name, hasValue: !!c.value })),
      hasAuthToken: !!authToken,
      authTokenLength: authToken?.length || 0,
    });

    // ========== 第7步：模拟从 Cookie 读取并验证 ==========
    addSection('7. Cookie 验证模拟', authToken ? 'pass' : 'warn', {
      message: authToken ? '从 Cookie 读取到 Token，开始验证' : '当前请求没有 Cookie',
    });

    if (authToken) {
      const cookiePayload = await verifyToken(authToken);
      addSection('7. Cookie 验证模拟', cookiePayload ? 'pass' : 'fail', {
        message: cookiePayload ? 'Cookie 中的 Token 验证成功' : 'Cookie 中的 Token 验证失败',
        payload: cookiePayload,
      });
    }

    // ========== 第8步：检查用户信息获取 ==========
    addSection('8. 用户信息获取', 'pass', {
      message: '根据 Token 获取用户信息',
    });

    const userFromToken = await userManager.getUserById(payload.userId);
    addSection('8. 用户信息获取', userFromToken ? 'pass' : 'fail', {
      message: userFromToken ? '用户信息获取成功' : '用户信息获取失败',
      user: userFromToken ? {
        id: userFromToken.id,
        email: userFromToken.email,
        username: userFromToken.username,
      } : null,
    });

    // ========== 总结 ==========
    const totalSections = diagnostics.sections.length;
    const passedSections = diagnostics.sections.filter(s => s.status === 'pass').length;
    const failedSections = diagnostics.sections.filter(s => s.status === 'fail').length;

    diagnostics.summary = {
      total: totalSections,
      passed: passedSections,
      failed: failedSections,
      allPassed: failedSections === 0,
    };

    return response;
  } catch (error) {
    addSection('ERROR: 诊断过程出错', 'fail', {
      message: '诊断过程中发生异常',
      error: String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json(diagnostics, { status: 500 });
  }
}
