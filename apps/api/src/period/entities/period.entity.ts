import { Base } from "src/common/entities/base.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class Period extends Base {
    @Column("text")
    period: string;

    @Column("numeric")
    year: number;

    @Column("numeric")
    semester: number;
}
