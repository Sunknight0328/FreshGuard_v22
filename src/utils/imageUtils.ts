/**
 * 图片压缩工具
 * 移动端（Capacitor）相机照片通常 2-8MB，需压缩后才能上传
 */

/**
 * 将图片压缩到指定大小以内
 * @param file - 原始图片文件
 * @param maxSizeKB - 最大体积（KB），默认 900KB
 * @param maxWidth - 最大宽度（px），默认 1920
 * @returns 压缩后的 File 对象
 */
export async function compressImage(
  file: File,
  maxSizeKB = 900,
  maxWidth = 1920
): Promise<File> {
  const maxBytes = maxSizeKB * 1024;

  // 已经在限制内，直接返回
  if (file.size <= maxBytes) return file;

  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      const canvas = document.createElement('canvas');
      let { width, height } = img;

      // 按比例缩小尺寸
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) { resolve(file); return; }
      ctx.drawImage(img, 0, 0, width, height);

      // 逐步降低质量，直到满足体积要求
      const tryCompress = (quality: number) => {
        canvas.toBlob(
          (blob) => {
            if (!blob) { resolve(file); return; }
            if (blob.size <= maxBytes || quality <= 0.1) {
              resolve(new File([blob], file.name, { type: 'image/jpeg', lastModified: Date.now() }));
            } else {
              tryCompress(Math.max(quality - 0.1, 0.1));
            }
          },
          'image/jpeg',
          quality
        );
      };

      tryCompress(0.85);
    };

    img.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
    img.src = url;
  });
}
