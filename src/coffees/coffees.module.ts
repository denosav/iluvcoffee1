/* CoffeesModule - FINAL CODE */
import { Injectable, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';
import { Event } from '../events/entities/event.entity';
import { COFFEE_BRANDS } from './coffees-constants';

//class MockCoffeesService{}
//class ConfigServiceP{}
//class DevelopmentConfigService{}
//class ProductionConfigService{}

@Injectable()
export class CoffeeBrandsFactory {
  create() {
    /* - do something - */
    return ['buddy brew', 'nescafe'];
  }
}

@Module({
  imports: [TypeOrmModule.forFeature([Coffee, Flavor, Event])], // 👈 Adding Coffee Entity here to TypeOrmModule.forFeature
  controllers: [CoffeesController],
  providers: [
    CoffeesService,
    CoffeeBrandsFactory,
/*    {
      provide: ConfigService,
      useClass: process.env.NODE_ENV === 'development' 
        ? DevelopmentConfigService : ProductionConfigService
    }
*/
    { provide: COFFEE_BRANDS,
      useFactory: (brandsFactory: CoffeeBrandsFactory) => brandsFactory.create(), 
      inject: [CoffeeBrandsFactory] 
    }],
  exports: [CoffeesService],
})
export class CoffeesModule {}

/*
Generated Coffee table in PostgreSQL Database

+-------------+--------------+----------------------------+
|                          coffee                         |
+-------------+--------------+----------------------------+
| id          | int(11)      | PRIMARY KEY AUTO_INCREMENT |
| name   	    | varchar      |                            |
| brand       | varchar      |                            |
| flavors     | json         |                            |
+-------------+--------------+----------------------------+
*/