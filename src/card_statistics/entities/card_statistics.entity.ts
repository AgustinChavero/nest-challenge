import { CardEntity } from 'src/card/entities/card.entity';
import { ModelEntity } from 'src/common/entities/model.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

@Entity({ name: 'card_statistics' })
export class CardStatisticsEntity extends ModelEntity {
  @OneToOne(() => CardEntity, (card) => card.statistics, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'card_id' })
  card: CardEntity;

  @Column('int')
  attack: number;

  @Column('int')
  defense: number;

  @Column('int')
  stars?: number;
}
