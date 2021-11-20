import sharp from 'sharp';

class ImageOptions {
  width: number
  quality: number
  format: string
  name: string
}

export default class AssetService {
  public static getAssetUrl(filename: string) {
    return `/img/${filename}`
  }

  public static getParamFilename(params: Array<string> | object): string {
    if (Array.isArray(params)) {
      return params['*'].join('/');
    }

    return Object.values(params).join('/');
  }

  public static getFileExtension(file): string {
    const contentType = file.headers['content-type'];
    const subtype = contentType.slice(contentType.lastIndexOf('/') + 1);
    let extension = subtype.split('+')[0];
    return extension;
  }

  public static getAlteredImage(file: Buffer | string, options: ImageOptions): Promise<Buffer> {
    let image = sharp(file);
    return image.metadata().then(metadata => {
      const toOptions = options.quality ? { quality: options.quality } : {};
      return image
        .resize(options.width || metadata.width)
        .toFormat(options.format, toOptions)
        .toBuffer()
    });
  }

  public static getImageOptions(queries: object, path: string): ImageOptions {
    const isSVG = path.endsWith('.svg');
    let options = new ImageOptions();

    for (let key in queries) {
      const value = queries[key];

      switch (key) {
        case 'w':
        case 'width':
          options.width = parseInt(value);
          break;
        case 'q':
        case 'quality':
          options.quality = parseInt(value);
          break;
        case 'f':
        case 'format':
          options.format = isSVG ? `svg+xml` : value;
          break;
      }
    }

    if (!options.format) {
      const [_, format] = path.split('.');
      options.format = isSVG ? 'svg+xml' : format;
    }

    options.name = `width_${options.width}__quality_${options.quality}.${options.format}`

    return options;
  }
}