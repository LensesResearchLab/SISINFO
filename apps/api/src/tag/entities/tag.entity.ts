import { Base } from "src/common/entities/base.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class Tag extends Base {
    @Column("text")
    name: string;

    @Column("text")
    description: string;
}
