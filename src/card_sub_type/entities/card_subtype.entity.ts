import { ModelEntity } from 'src/common/entities/model.entity';
import { CardTypeEntity } from 'src/card_type/entities/card_type.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { CardEntity } from 'src/card/entities/card.entity';

@Entity({ name: 'card_sub_types' })
export class CardSubTypeEntity extends ModelEntity {
  @ManyToOne(() => CardTypeEntity, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'card_type_id' })
  card_type: CardTypeEntity;

  @Column('varchar', { length: 50, unique: true })
  name: string;

  @OneToMany(() => CardEntity, (card) => card.card_sub_type)
  cards: CardEntity[];
}
