import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { CoffeesModule } from '../coffees/coffees.module';
import { CoffeeRatingService } from './coffee-rating.service';

@Module({
    imports: [
        DatabaseModule.register({
            type: 'postgres',
            host: 'localhost',
            password: 'pass123',
            database: 'postgres',
            username: 'postgres',
            port: 5432,
        }),
        CoffeesModule],
    providers: [CoffeeRatingService]
})
export class CoffeeRatingModule {}
