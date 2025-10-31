import { ModelEntity } from 'src/common/entities/model.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { CardTypeEntity } from 'src/card_type/entities/card_type.entity';
import { CardSubTypeEntity } from 'src/card_sub_type/entities/card_subtype.entity';
import { CardStatisticsEntity } from 'src/card_statistics/entities/card_statistics.entity';

@Entity({ name: 'cards' })
export class CardEntity extends ModelEntity {
  @ManyToOne(() => CardTypeEntity, {
    nullable: false,
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'card_type_id' })
  card_type: CardTypeEntity;

  @ManyToOne(() => CardSubTypeEntity, {
    nullable: false,
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'card_sub_type_id' })
  card_sub_type: CardSubTypeEntity;

  @OneToOne(() => CardStatisticsEntity, (stats) => stats.card, {
    nullable: true,
    eager: true,
    cascade: true,
  })
  statistics?: CardStatisticsEntity;

  @Column('text')
  name: string;

  @Column('text')
  code: string;

  @Column('text')
  description: string;

  @Column('text')
  image_url?: string;

  @Column('boolean', { default: true })
  enabled?: boolean;
}
