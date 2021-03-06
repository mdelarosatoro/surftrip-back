import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Headers,
    Put,
    Query,
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

    @Get('search')
    searchPackages(
        @Query('price') price?: string,
        @Query('days') days?: string,
        @Query('location') location?: string,
        @Query('rating') rating?: string,
        @Query('skillBeginner') skillBeginner?: string,
        @Query('skillIntermediate') skillIntermediate?: string,
        @Query('skillAdvanced') skillAdvanced?: string,
        @Query('skillExpert') skillExpert?: string
    ) {
        const query = {
            price,
            days,
            location,
            rating,
            skillLevels: [],
        };
        JSON.parse(skillBeginner) && query.skillLevels.push('Beginner');
        JSON.parse(skillIntermediate) && query.skillLevels.push('Intermediate');
        JSON.parse(skillAdvanced) && query.skillLevels.push('Advanced');
        JSON.parse(skillExpert) && query.skillLevels.push('Expert');
        return this.packagesService.search(query);
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

    @Get(':id/book')
    book(@Param('id') id: string, @Headers('Authorization') token: string) {
        return this.packagesService.book(id, token);
    }
}
