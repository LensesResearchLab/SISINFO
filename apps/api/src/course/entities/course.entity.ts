import { Base } from "src/common/entities/base.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class Course extends Base {
    @Column("text")
    code: string;

    @Column("text")
    departament: string;

    @Column("text")
    name: string;

    @Column("numeric")
    credits: number;



}
