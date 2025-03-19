import { Base } from "src/common/entities/base.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class Section extends Base {
    @Column("numeric")
    NRC: number;

    @Column("numeric")
    section: number;
}
