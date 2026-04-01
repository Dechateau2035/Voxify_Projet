import { PartialType } from '@nestjs/swagger';
import { CreateChantDto } from './create-chant.dto';

export class UpdateChantDto extends PartialType(CreateChantDto) {}
