import { Column, Entity, ManyToMany } from 'typeorm';
import { Base } from '../../common/entities/base.entity';
import { Project } from 'src/projects/entities/project.entity';

@Entity()
export class AreasOfInterest extends Base {
  @Column('text')
  name: string;

  @Column('text')
  description: string;

  @ManyToMany(() => Project, (project) => project.areasOfInterest)
  projects: Project[];
}
