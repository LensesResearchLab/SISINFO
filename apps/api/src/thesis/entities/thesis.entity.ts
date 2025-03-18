import { Base } from "src/common/entities/base.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class Thesis extends Base {
  @Column("text")
  title: string;

  @Column("text")
  description: string;

  @Column("text")
  investigation_subarea: string;
}
