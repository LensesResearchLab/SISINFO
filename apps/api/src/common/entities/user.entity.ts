import { Column, Entity, PrimaryColumn } from "typeorm"

@Entity()
export class User {
    @PrimaryColumn("text")
    document: string

    @Column("text")
    name: string

    @Column("text")
    email: string
}
function PrimaryKey(): (target: User, propertyKey: "document") => void {
    throw new Error("Function not implemented.")
}

