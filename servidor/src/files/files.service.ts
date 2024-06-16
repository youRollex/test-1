import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync } from 'fs';
import { join } from 'path';

@Injectable()
export class FilesService {
  getStaticCardImage(imageName: string) {
    const path = join(__dirname, '../../static/cards', imageName);

    if (!existsSync(path))
      throw new BadRequestException(`No card found with image ${imageName}`);

    return path;
  }
}
