/* CoffeesModule - FINAL CODE */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { Coffee } from './entities/coffee.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Coffee])], // 👈 Adding Coffee Entity here to TypeOrmModule.forFeature
  controllers: [CoffeesController],
  providers: [CoffeesService],
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