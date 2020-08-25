import { Controller, Get, Param, Post, Body, HttpCode, HttpStatus, Res } from '@nestjs/common';
import { response } from 'express';

@Controller('coffees')
export class CoffeesController {
    @Get("")
    findAll () {
        return(`This action returns all coffees`);
    }

    @Get(":id")
    findOne (@Param("id") id: string) {
        return `This action returns #${id} coffee`;
    }

    @Post()
    create (@Body() body){
        return body;
    } 
}
