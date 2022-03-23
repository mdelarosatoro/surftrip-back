import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    Headers,
} from '@nestjs/common';
import { SurfcampsService } from './surfcamps.service';
import { UpdateSurfcampDto } from './dto/update-surfcamp.dto';
import { PhotoI } from 'src/interfaces/photos.interface';

@Controller('surfcamps')
export class SurfcampsController {
    constructor(private readonly surfcampsService: SurfcampsService) {}

    @Get()
    findAll() {
        return this.surfcampsService.findAll();
    }

    @Get('search')
    searchSurfcamps(
        @Query('location') location?: string,
        @Query('rating') rating?: string,
        @Query('skillBeginner') skillBeginner?: string,
        @Query('skillIntermediate') skillIntermediate?: string,
        @Query('skillAdvanced') skillAdvanced?: string,
        @Query('skillExpert') skillExpert?: string
    ) {
        const query = {
            location,
            rating,
            skillLevels: [],
        };
        JSON.parse(skillBeginner) && query.skillLevels.push('Beginner');
        JSON.parse(skillIntermediate) && query.skillLevels.push('Intermediate');
        JSON.parse(skillAdvanced) && query.skillLevels.push('Advanced');
        JSON.parse(skillExpert) && query.skillLevels.push('Expert');
        return this.surfcampsService.search(query);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.surfcampsService.findOne(id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateSurfcampDto: UpdateSurfcampDto
    ) {
        return this.surfcampsService.update(id, updateSurfcampDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.surfcampsService.remove(id);
    }

    @Get(':id/packages')
    findSurfcampPackages(@Param('id') id: string) {
        return this.surfcampsService.findSurfcampPackages(id);
    }

    @Post(':id/photos')
    addPhoto(@Param('id') id: string, @Body() newPhoto: PhotoI) {
        return this.surfcampsService.addPhoto(id, newPhoto);
    }

    @Patch(':id/photos')
    deletePhoto(
        @Param('id') id: string,
        @Body() deletePhoto: { deletePhotoUrl: string }
    ) {
        return this.surfcampsService.deletePhoto(id, deletePhoto);
    }

    @Post(':id/comments')
    addComment(
        @Headers('Authorization') token: string,
        @Param('id') id: string,
        @Body() newComment: { comment: string; rating: string }
    ) {
        return this.surfcampsService.addComment(id, newComment, token);
    }

    @Get(':id/comments')
    getSurfcampCommentsById(@Param('id') id: string) {
        return this.surfcampsService.getSurfcampCommentsById(id);
    }
}
