import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    Header,
    Headers,
} from '@nestjs/common';
import { SurfcampsService } from './surfcamps.service';
import { UpdateSurfcampDto } from './dto/update-surfcamp.dto';

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
        @Query('rating') rating?: string
    ) {
        const query = {
            location,
            rating,
        };
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
    addPhoto(@Param('id') id: string, @Body() newPhoto: { photoUrl: string }) {
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
}
