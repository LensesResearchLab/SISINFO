import { Base } from "src/common/entities/base.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class GraduatedAssistance extends Base {
    @Column("text")
    title: string;

    @Column("text")
    clasification: string;

    @Column("text")
    description: string;
}
