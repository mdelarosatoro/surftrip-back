import { PartialType } from '@nestjs/mapped-types';
import { Package } from '../entities/package.entity';

export class UpdatePackageDto extends PartialType(Package) {}
