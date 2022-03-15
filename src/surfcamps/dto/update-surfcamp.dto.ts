import { PartialType } from '@nestjs/mapped-types';
import { CreateSurfcampDto } from './create-surfcamp.dto';

export class UpdateSurfcampDto extends PartialType(CreateSurfcampDto) {}
