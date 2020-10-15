import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
//import { INSTANCE_ID_SYMBOL } from '@nestjs/core/injector/instance-wrapper';
import { Coffee } from "./entities/coffee.entity";
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Repository } from 'typeorm';

@Injectable()
export class CoffeesService {

    constructor (
        @InjectRepository(Coffee)
        private readonly coffeeRepository: Repository<Coffee>,
    ) {}

    findAll () {
        return this.coffeeRepository.find({
            relations: ['flavors']
        })
    }
    
    async findOne (id: string) {
//        throw `A random error`;
        const coffee = await this.coffeeRepository.findOne(id, {
            relations: ['flavors'],
        });
        if (!coffee) {
            throw new NotFoundException(`Coffee #${id} not found`);
        }
        return coffee;
    }
    
    create (createCoffeeDto: CreateCoffeeDto) {
        const coffee = this.coffeeRepository.create(createCoffeeDto);
        return this.coffeeRepository.save(coffee);
    }
    
    async update (id: string, updateCoffeeDto: UpdateCoffeeDto) {
        const coffee = await this.coffeeRepository.preload({
            id: +id,
            ...updateCoffeeDto,
        });
        if (!coffee){
            throw new NotFoundException(`Coffee #${id} not found`);
            // update this existing entity
        }
        return this.coffeeRepository.save(coffee);
    }
    
    async remove (id: string) {
        const coffee = await this.findOne(id);
        return this.coffeeRepository.remove(coffee);
    }
}

