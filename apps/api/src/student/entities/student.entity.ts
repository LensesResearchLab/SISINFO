import { User } from "src/common/entities/user.entity";
import { Project } from "src/project/entities/project.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity()
export class Student extends User {
    @Column("numeric")
    semester: number;

    @Column("boolean")
    isUndergraduate: boolean;

    @Column("boolean")
    isTeachingAssistant: boolean;

    @Column("text")
    code: string;
}

