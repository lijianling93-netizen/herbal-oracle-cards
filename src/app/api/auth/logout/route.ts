import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "退出登录成功",
  });

  // 清除 cookie
  response.cookies.delete("auth-token");

  return response;
}
