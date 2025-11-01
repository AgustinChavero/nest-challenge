import { ModelEntity } from 'src/common/entities/model.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { CardTypeEntity } from 'src/card_type/entities/card_type.entity';
import { CardSubTypeEntity } from 'src/card_sub_type/entities/card_subtype.entity';
import { CardStatisticsEntity } from 'src/card_statistics/entities/card_statistics.entity';

@Entity({ name: 'cards' })
export class CardEntity extends ModelEntity {
  @ManyToOne(() => CardTypeEntity, (type) => type.cards, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'card_type_id' })
  card_type: CardTypeEntity;

  @ManyToOne(() => CardSubTypeEntity, (subtype) => subtype.cards, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'card_sub_type_id' })
  card_sub_type: CardSubTypeEntity;

  @OneToOne(() => CardStatisticsEntity, (stats) => stats.card, {
    nullable: true,
    cascade: true,
  })
  statistics?: CardStatisticsEntity;

  @Column('varchar', { length: 50, unique: true })
  name: string;

  @Column('varchar', { length: 7, unique: true })
  code: string;

  @Column('varchar', { length: 255 })
  description: string;

  @Column('varchar', { length: 255 })
  image_url?: string;
}
