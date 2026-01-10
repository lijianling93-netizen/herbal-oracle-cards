import zipfile
import os
from pathlib import Path

def create_project_zip():
    # 源目录
    source_dir = '/workspace/projects'
    # 输出文件
    output_file = '/workspace/herbal-oracle-code.zip'

    # 需要排除的目录和文件
    exclude_dirs = {'node_modules', '.next', '.git', '.vercel', '__pycache__'}
    exclude_files = {'.DS_Store', '*.log'}

    print('[ZIP] 开始创建 ZIP 包...')

    with zipfile.ZipFile(output_file, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(source_dir):
            # 过滤掉不需要的目录
            dirs[:] = [d for d in dirs if d not in exclude_dirs]

            for file in files:
                # 过滤掉不需要的文件
                if file.startswith('.') or file.endswith('.log'):
                    continue

                file_path = os.path.join(root, file)
                # 计算相对路径
                arcname = os.path.relpath(file_path, source_dir)

                # 添加到 ZIP
                zipf.write(file_path, arcname)
                print(f'[ZIP] 添加: {arcname}')

    # 获取文件大小
    size_mb = os.path.getsize(output_file) / 1024 / 1024
    print(f'[ZIP] 创建完成！文件大小: {size_mb:.2f} MB')
    print(f'[ZIP] 保存位置: {output_file}')

    return output_file

if __name__ == '__main__':
    create_project_zip()
