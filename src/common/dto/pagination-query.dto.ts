import { Type } from "class-transformer";
import { IsOptional, IsPositive } from "class-validator";

export class PaginationQueryDto {

    @IsOptional()
    @IsPositive()
//    @Type(() => Number) // Removed as transformoptions was added to main.ts
    limit: number;

    @IsOptional()
    @IsPositive()
//    @Type(() => Number) // Removed as transformoptions was added to main.ts
    offset: number;
}

