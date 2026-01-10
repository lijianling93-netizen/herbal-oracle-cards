const { S3Storage } = require('coze-coding-dev-sdk');
const fs = require('fs');
const path = require('path');

async function uploadProject() {
  try {
    console.log('[上传] 开始上传项目代码包...');

    // 初始化 S3Storage
    const storage = new S3Storage({
      endpointUrl: process.env.COZE_BUCKET_ENDPOINT_URL,
      accessKey: "",
      secretKey: "",
      bucketName: process.env.COZE_BUCKET_NAME,
      region: "cn-beijing",
    });

    // 读取 tar 包
    const tarPath = '/workspace/herbal-oracle-code.tar.gz';
    if (!fs.existsSync(tarPath)) {
      throw new Error(`文件不存在: ${tarPath}`);
    }

    const fileContent = fs.readFileSync(tarPath);
    console.log('[上传] 文件大小:', (fileContent.length / 1024 / 1024).toFixed(2), 'MB');

    // 上传文件
    const key = await storage.uploadFile({
      fileContent: fileContent,
      fileName: 'herbal-oracle-code.tar.gz',
      contentType: 'application/gzip',
    });

    console.log('[上传] 上传成功，文件 key:', key);

    // 生成签名 URL（有效期 24 小时）
    const url = await storage.generatePresignedUrl({
      key: key,
      expireTime: 86400, // 24 小时
    });

    console.log('[上传] 下载 URL (有效期 24 小时):');
    console.log(url);

    return url;
  } catch (error) {
    console.error('[上传] 失败:', error);
    throw error;
  }
}

// 执行上传
uploadProject()
  .then(url => {
    console.log('\n✅ 上传完成！');
    console.log('请将以下 URL 发送给用户用于下载:');
    console.log(url);
  })
  .catch(err => {
    console.error('❌ 上传失败:', err);
    process.exit(1);
  });
