import { NextRequest, NextResponse } from "next/server";
import { getDb } from "coze-coding-dev-sdk";
import { users } from "@/storage/database/shared/schema";
import { eq } from "drizzle-orm";
import * as bcrypt from "bcryptjs";

export async function GET() {
  try {
    const db = await getDb();
    const allUsers = await db.select().from(users);

    return NextResponse.json({
      success: true,
      count: allUsers.length,
      users: allUsers.map(u => ({
        id: u.id,
        email: u.email,
        username: u.username,
        createdAt: u.createdAt,
        hasPassword: !!u.password,
        passwordLength: u.password?.length || 0,
      })),
    });
  } catch (error) {
    console.error('获取用户列表失败:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, email, password, username } = body;

    if (action === 'create') {
      // 创建测试用户
      const db = await getDb();
      const hashedPassword = await bcrypt.hash(password, 10);

      const [user] = await db.insert(users).values({
        email,
        password: hashedPassword,
        username: username || null,
        avatar: null,
      }).returning();

      const { password: _, ...userWithoutPassword } = user;
      return NextResponse.json({
        success: true,
        user: userWithoutPassword,
      });
    }

    if (action === 'test-login') {
      // 测试登录
      const db = await getDb();
      const [user] = await db.select().from(users).where(eq(users.email, email));

      if (!user) {
        return NextResponse.json({
          success: false,
          error: '用户不存在',
        });
      }

      const isValid = await bcrypt.compare(password, user.password);

      if (isValid) {
        return NextResponse.json({
          success: true,
          message: '密码正确',
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
          },
        });
      } else {
        return NextResponse.json({
          success: false,
          error: '密码错误',
        });
      }
    }

    return NextResponse.json(
      { error: '无效的操作' },
      { status: 400 }
    );
  } catch (error) {
    console.error('操作失败:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
