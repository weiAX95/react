import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import GifEncoder from 'gif-encoder-2';
import { Image } from 'image-js';

export async function POST() {
  try {
    // 获取img目录的绝对路径
    const imgDirectory = path.join(process.cwd(), 'img');
    
    // 读取所有jpg文件并排序
    const files = await fs.readdir(imgDirectory);
    const jpgFiles = files
      .filter(file => file.endsWith('.png'))
      .sort((a, b) => a.localeCompare(b));

    // 读取第一张图片来获取尺寸
    const firstImage = await Image.load(path.join(imgDirectory, jpgFiles[0]));
    const { width, height } = firstImage;

    // 初始化GIF编码器
    const encoder = new GifEncoder(width, height);
    encoder.setDelay(500); // 500ms每帧
    encoder.start();

    // 处理每张图片
    for (const file of jpgFiles) {
      const image = await Image.load(path.join(imgDirectory, file));
      // 调整大小并转换为RGB格式
      const resized = image
        .resize({ width: width, height: height })
        .rgba8();
      
      // 添加帧到GIF
      encoder.addFrame(resized.data);
    }

    encoder.finish();

    // 获取生成的GIF数据
    const gifBuffer = encoder.out.getData();

    return new NextResponse(gifBuffer, {
      headers: {
        'Content-Type': 'image/gif',
      },
    });
  } catch (error) {
    console.error('Error creating GIF:', error);
    return NextResponse.json(
      { message: 'Error creating GIF', error: error.message },
      { status: 500 }
    );
  }
}