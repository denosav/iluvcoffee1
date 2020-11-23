import { Controller, Get, Param, Post, Body, HttpCode, HttpStatus, Res, Patch, Delete, Query, Inject, UsePipes, ValidationPipe, SetMetadata, Req } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { response } from 'express';
import { Coffee } from "./entities/coffee.entity";
import { CoffeesService } from "./coffees.service";
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { ParseIntPipe } from 'src/common/pipes/parse-int.pipe';
import { Protocol } from 'src/common/decorators/protocol.decorator';
import { ApiForbiddenResponse, ApiResponse, ApiTags } from '@nestjs/swagger';

//@UsePipes(ValidationPipe)
@ApiTags('coffees')
@Controller('coffees')
export class CoffeesController {
    constructor(
        private readonly coffeesService: CoffeesService,
        @Inject(REQUEST) private readonly request: Request,
    ) {
        console.log('CoffeesController created');
    }

//    @SetMetadata('isPublic', true)
//    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @Public()
    @UsePipes(ValidationPipe)
    @Get("")
//    async findAll (@Query() paginationQuery: PaginationQueryDto) {
//    findAll (@Query() paginationQuery: PaginationQueryDto) {
    findAll (@Protocol('https') protocol: string, @Query() paginationQuery: PaginationQueryDto) {
            //   const { limit, offset } = paginationQuery;
//        await new Promise(resolve => setTimeout(resolve, 5000));
        console.log(protocol);
        return this.coffeesService.findAll(paginationQuery);
    }

    @Get(":id")
    findOne (@Param("id", ParseIntPipe) id: number) {
//        console.log(typeof id);
        console.log(id);
        return this.coffeesService.findOne(''+id);
    }

    @Post()
    create (@Body() createCoffeeDto: CreateCoffeeDto){
        console.log(createCoffeeDto instanceof CreateCoffeeDto);
        return this.coffeesService.create(createCoffeeDto);
    } 

    @Patch(':id')
//    update (@Req() request, @Param('id') id: string, @Body (ValidationPipe) updateCoffeeDto: UpdateCoffeeDto) {
    update (@Param('id') id: string, @Body (ValidationPipe) updateCoffeeDto: UpdateCoffeeDto) {
        return this.coffeesService.update(id, updateCoffeeDto);
    }

    @Delete(':id')
    remove (@Param('id') id: string) {
        return this.coffeesService.remove(id);
    }
}
