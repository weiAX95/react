// app/api/create-gif/route.js
import { NextResponse } from 'next/server';
import { Image } from 'image-js';
import omggif from 'omggif';

export const runtime = 'edge';

export async function POST() {
  try {
    const imageUrls = [
      '/img/1.png',
      '/img/2.png',
      '/img/3.png'
    ];

    // 加载所有图片
    const images = await Promise.all(
      imageUrls.map(url => 
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}${url}`)
          .then(res => {
            if (!res.ok) throw new Error(`Failed to load image: ${url}`);
            return res.arrayBuffer();
          })
          .then(buffer => Image.load(buffer))
      )
    );

    const { width, height } = images[0];

    // 计算需要的总字节数
    const framePixels = width * height * 4;  // RGBA
    const framesCount = images.length;
    const bufferSize = 1024 + (framePixels * framesCount);  // 预估GIF文件大小

    // 创建输出buffer
    const buffer = new Uint8Array(bufferSize);
    
    // 创建GIF writer
    const gifWriter = new omggif.GifWriter(buffer, width, height, {
      palette: null,
      loop: 0  // 0 = 无限循环
    });

    // 处理每一帧
    let offset = 0;
    for (const image of images) {
      // 调整图片大小和格式
      const resized = image
        .resize({ 
          width, 
          height,
          fit: 'contain',
          background: [255, 255, 255, 255]
        })
        .rgba8();

      // 添加帧
      offset += gifWriter.addFrame(0, 0, width, height, 
        new Uint8Array(resized.data), {
          delay: 50,  // 50 = 500ms
          transparent: true,
          disposal: 2
        });
    }

    // 截取实际使用的buffer部分
    const finalBuffer = buffer.slice(0, offset);

    // 返回生成的GIF
    return new NextResponse(finalBuffer, {
      headers: {
        'Content-Type': 'image/gif',
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error) {
    console.error('Error creating GIF:', error);
    return NextResponse.json(
      { 
        message: 'Failed to create GIF', 
        error: error.message 
      }, 
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        }
      }
    );
  }
}