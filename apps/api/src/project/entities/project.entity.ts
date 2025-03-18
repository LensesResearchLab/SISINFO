
import { Base } from "src/common/entities/base.entity";
import { Student } from "src/student/entities/student.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity()
export class Project extends Base {
    @Column("text")
    title: string;

    @Column("text")
    description: string;

    @Column("text")
    category: string;

    @Column("numeric")
    max_students: number;
}
