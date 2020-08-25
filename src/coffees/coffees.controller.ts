import { Controller, Get, Param, Post, Body, HttpCode, HttpStatus, Res } from '@nestjs/common';
import { response } from 'express';

@Controller('coffees')
export class CoffeesController {
    @Get("")
    findAll (@Res() response) {
        response.status(200).send(`This action returns all coffees`);
    }

    @Get(":id")
    findOne (@Param("id") id: string) {
        return `This action returns #${id} coffee`;
    }

    @Post()
    @HttpCode(HttpStatus.GONE)
    create (@Body() body){
        return body;
    } 
}
