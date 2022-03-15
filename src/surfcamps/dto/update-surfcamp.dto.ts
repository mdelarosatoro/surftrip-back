import { PartialType } from '@nestjs/mapped-types';
import { Surfcamp } from '../entities/surfcamp.schema';

export class UpdateSurfcampDto extends PartialType(Surfcamp) {}
