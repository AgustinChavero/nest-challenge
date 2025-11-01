import { CardEntity } from 'src/card/entities/card.entity';
import { CardSubTypeEntity } from 'src/card_sub_type/entities/card_subtype.entity';
import { ModelEntity } from 'src/common/entities/model.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity({ name: 'card_types' })
export class CardTypeEntity extends ModelEntity {
  @Column('varchar', { length: 50, unique: true })
  name: string;

  @OneToMany(() => CardSubTypeEntity, (card) => card.card_type)
  card_sub_types: CardSubTypeEntity[];

  @OneToMany(() => CardEntity, (card) => card.card_type)
  cards: CardEntity[];
}
