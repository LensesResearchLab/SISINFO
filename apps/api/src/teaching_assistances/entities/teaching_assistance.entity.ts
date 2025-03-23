import { Base } from "src/common/entities/base.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class TeachingAssistance extends Base {
  @Column("text")
  name: string;

  @Column("text")
  task: string;

  @Column("text")
  status: string;

  @Column("text")
  period_type_description: string;

  @Column("date")
  final_date: Date;

  @Column("date")
  initial_date: Date;

  @Column("numeric")
  weekly_hours: number;

  @Column("text")
  description: string;

  @Column("numeric")
  grade: number;
}
