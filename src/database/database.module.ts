import { Module } from '@nestjs/common';

@Module({})
export class DatabaseModule {
    static register (options: ConnectionOptions): DynamicModule {
        return {
            module: DatabaseModule,
            providers: [
                {
                    provide: 'CONNECTION',
                    useValue: createConnection(options),
                },
            ],
        };
    }
}
