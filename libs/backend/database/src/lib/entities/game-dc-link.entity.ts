import { Entity, PrimaryColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class GameDCLink {
    @PrimaryColumn({
        type: 'text',
        nullable: false
    })
    @ApiProperty({
        type: 'string',
        example: '873499120877305876',
        description: 'Discord id for the link'
    })
    discordId!: string;

    @Column({
        type: "text",
        array: true,
        default: "{}",
        nullable: false
    })
    @ApiProperty({
        type: 'string',
        isArray: true,
        example: ['uu-2131u-id123-one1', 'uu-2131u-id123-two2'],
        description: 'UUIDs of game accounts connected to this discord'
    })
    accounts!: string[];
}