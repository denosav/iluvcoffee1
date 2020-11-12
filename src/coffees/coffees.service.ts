import { Injectable, HttpException, HttpStatus, NotFoundException, Inject, Scope } from '@nestjs/common';
//import { INSTANCE_ID_SYMBOL } from '@nestjs/core/injector/instance-wrapper';
import { Coffee } from "./entities/coffee.entity";
import { Flavor } from './entities/flavor.entity';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Connection, Repository } from 'typeorm';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Event } from 'src/events/entities/event.entity';
import { COFFEE_BRANDS } from './coffees-constants';
import { ConfigService } from '@nestjs/config';

@Injectable({ scope: Scope.DEFAULT })
export class CoffeesService {

    constructor (
        @InjectRepository(Coffee)
        private readonly coffeeRepository: Repository<Coffee>,
        @InjectRepository(Flavor)
        private readonly flavorRepository: Repository<Flavor>,
        private readonly connection: Connection,
        @Inject(COFFEE_BRANDS) coffeeBrands: string[],
        private readonly configService: ConfigService,
    ) {
//        console.log('CoffeesService instantiated');
        const databaseHost = this.configService.get(
            'database.host',
            'localhost',
        );
        console.log(databaseHost);
    }

    findAll (paginationQuery: PaginationQueryDto) {
        const { limit, offset} = paginationQuery;
        return this.coffeeRepository.find({
            relations: ['flavors'],
            skip: offset,
            take: limit,
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
    
    async create(createCoffeeDto: CreateCoffeeDto) {
        const flavors = await Promise.all(
          createCoffeeDto.flavors.map(name => this.preloadFlavorByName(name)),
        );
    
        const coffee = this.coffeeRepository.create({
          ...createCoffeeDto,
          flavors,
        });
        return this.coffeeRepository.save(coffee);
      }
    
    async update (id: string, updateCoffeeDto: UpdateCoffeeDto) {
        const flavors =
            updateCoffeeDto.flavors &&
            (await Promise.all(
                updateCoffeeDto.flavors.map(name => this.preloadFlavorByName(name)),
            ));      
        const coffee = await this.coffeeRepository.preload({
            id: +id,
            ...updateCoffeeDto,
            flavors,
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

    async recommendCoffee (coffee: Coffee) {
        const queryRunner = this.connection.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();
        try{
            coffee.recommendations++;

            const recommendEvent = new Event();
            recommendEvent.name = 'recommend_coffee';
            recommendEvent.type = 'coffee';
            recommendEvent.payload = {coffeeId: coffee.id};

            await queryRunner.manager.save(coffee);
            await queryRunner.manager.save(recommendEvent);

            await queryRunner.commitTransaction();
        } catch (err) {
            await queryRunner.rollbackTransaction();
        } finally {
            await queryRunner.release();
        }
    }

    private async preloadFlavorByName(name: string): Promise<Flavor>{
        const existingFlavor = await this.flavorRepository.findOne({name});
        if (existingFlavor) {
            return existingFlavor;
        }
        return this.flavorRepository.create({name});
    }
}

