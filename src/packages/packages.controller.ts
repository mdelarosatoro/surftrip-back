import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Headers,
    Put,
} from '@nestjs/common';
import { PackagesService } from './packages.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';

@Controller('packages')
export class PackagesController {
    constructor(private readonly packagesService: PackagesService) {}

    @Post()
    create(
        @Body() createPackageDto: CreatePackageDto,
        @Headers('Authorization') token: string
    ) {
        return this.packagesService.create(createPackageDto, token);
    }

    @Get()
    findAll() {
        return this.packagesService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return await this.packagesService.findOne(id);
    }

    @Put(':id')
    update(
        @Param('id') id: string,
        @Body() updatePackageDto: UpdatePackageDto
    ) {
        return this.packagesService.update(id, updatePackageDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.packagesService.remove(id);
    }
}
