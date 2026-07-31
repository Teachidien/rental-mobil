// Cloudinary Direct Unsigned Upload Helper & Image Canvas Compressor

export const compressImage = (file, maxWidth = 800, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".webp", {
                type: 'image/webp',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              reject(new Error('Canvas compression failed'));
            }
          },
          'image/webp',
          quality
        );
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

export const uploadToCloudinary = async (file) => {
  try {
    const compressedFile = await compressImage(file);
    const formData = new FormData();
    formData.append('file', compressedFile);
    formData.append('upload_preset', 'bosauto_preset'); // Cloudinary Unsigned Preset Pengguna

    // Endpoint Cloudinary Asli Pengguna (Cloud Name: rcbiidrc)
    const res = await fetch('https://api.cloudinary.com/v1_1/rcbiidrc/image/upload', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      throw new Error('Cloudinary upload status non-200');
    }

    const data = await res.json();
    return data.secure_url;
  } catch (error) {
    console.warn('Gagal upload ke Cloudinary, menggunakan URL lokal/preview:', error);
    return URL.createObjectURL(file);
  }
};
