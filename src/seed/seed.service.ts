import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CardTypeEntity } from 'src/card_type/entities/card_type.entity';
import { CardSubTypeEntity } from 'src/card_sub_type/entities/card_subtype.entity';
import { CardEntity } from 'src/card/entities/card.entity';
import { CardStatisticsEntity } from 'src/card_statistics/entities/card_statistics.entity';

type RawCard = {
  name: string;
  code: string;
  description: string;
  typeName: string;
  subTypeName: string;
  attack?: number | null;
  defense?: number | null;
  stars?: number | null;
};

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(CardStatisticsEntity)
    private readonly cardStatisticsRepository: Repository<CardStatisticsEntity>,

    @InjectRepository(CardEntity)
    private readonly cardRepository: Repository<CardEntity>,

    @InjectRepository(CardSubTypeEntity)
    private readonly cardSubTypeRepository: Repository<CardSubTypeEntity>,

    @InjectRepository(CardTypeEntity)
    private readonly cardTypeRepository: Repository<CardTypeEntity>,
  ) {}

  async runSeed() {
    this.logger.log('🔄 Ejecutando seed manualmente...');
    await this.clearDatabase();
    await this.insertSeedData();
    this.logger.log('✅ Seed manual completado');
    return true;
  }

  private async clearDatabase() {
    this.logger.log(
      '🧹 Limpiando tablas con FOREIGN_KEY_CHECKS desactivado (MySQL)',
    );

    await this.cardRepository.query('SET FOREIGN_KEY_CHECKS = 0');
    await this.cardStatisticsRepository.query('TRUNCATE TABLE card_statistics');
    await this.cardRepository.query('TRUNCATE TABLE cards');
    await this.cardSubTypeRepository.query('TRUNCATE TABLE card_sub_types');
    await this.cardTypeRepository.query('TRUNCATE TABLE card_types');
    await this.cardRepository.query('SET FOREIGN_KEY_CHECKS = 1');
  }

  private async insertSeedData() {
    const typeNames = ['Monster', 'Spell', 'Trap'];
    const savedTypes: Record<string, CardTypeEntity> = {};

    for (const t of typeNames) {
      const entity = this.cardTypeRepository.create({ name: t });
      savedTypes[t] = await this.cardTypeRepository.save(entity);
    }

    const subTypesByType: Record<string, string[]> = {
      Monster: [
        'Normal Monster',
        'Effect Monster',
        'Ritual Monster',
        'Fusion Monster',
      ],
      Spell: [
        'Normal Spell',
        'Quick-Play Spell',
        'Continuous Spell',
        'Field Spell',
        'Equip Spell',
        'Ritual Spell',
      ],
      Trap: ['Normal Trap', 'Continuous Trap', 'Counter Trap'],
    };

    const savedSubTypes: Record<string, CardSubTypeEntity> = {};
    for (const typeName of Object.keys(subTypesByType)) {
      const parent = savedTypes[typeName];
      for (const sname of subTypesByType[typeName]) {
        const s = this.cardSubTypeRepository.create({
          name: sname,
          card_type: parent,
        });
        const saved = await this.cardSubTypeRepository.save(s);
        savedSubTypes[`${typeName}::${sname}`] = saved;
      }
    }

    const rawCards: RawCard[] = [
      {
        name: 'Azure Dragon Whelp',
        code: 'YG-001',
        description: 'A young dragon with swift strikes.',
        typeName: 'Monster',
        subTypeName: 'Normal Monster',
        attack: 1400,
        defense: 1200,
        stars: 4,
      },
      {
        name: 'Azure Dragon Elder',
        code: 'YG-002',
        description: 'Elder of the Azure line, breathes lightning.',
        typeName: 'Monster',
        subTypeName: 'Effect Monster',
        attack: 2300,
        defense: 1600,
        stars: 6,
      },
      {
        name: 'Obsidian Ritualist',
        code: 'YG-003',
        description: 'Requires a ritual to summon; draws power from darkness.',
        typeName: 'Monster',
        subTypeName: 'Ritual Monster',
        attack: 2500,
        defense: 2000,
        stars: 8,
      },
      {
        name: 'Mirror Chimera',
        code: 'YG-004',
        description: 'Fusion of three mirror beasts.',
        typeName: 'Monster',
        subTypeName: 'Fusion Monster',
        attack: 2800,
        defense: 2400,
        stars: 8,
      },
      {
        name: 'Celestial Tuner',
        code: 'YG-005',
        description: 'Tuner used for synchro calls.',
        typeName: 'Monster',
        subTypeName: 'Normal Monster',
        attack: 2100,
        defense: 1500,
        stars: 6,
      },
      {
        name: 'Void Carrier',
        code: 'YG-006',
        description: 'An XYZ monster summoned by overlaying.',
        typeName: 'Monster',
        subTypeName: 'Normal Monster',
        attack: 2600,
        defense: 2200,
        stars: 0,
      },
      {
        name: 'Nether Linker',
        code: 'YG-007',
        description: 'Link monster that connects extra deck zones.',
        typeName: 'Monster',
        subTypeName: 'Normal Monster',
        attack: 1800,
        defense: 0,
        stars: 0,
      },
      {
        name: 'Pendulum Sorcerer',
        code: 'YG-008',
        description: 'Can be placed in pendulum zone to scale.',
        typeName: 'Monster',
        subTypeName: 'Normal Monster',
        attack: 1600,
        defense: 1400,
        stars: 4,
      },
      {
        name: 'Iron Sentinel',
        code: 'YG-009',
        description: 'Armored guardian with high defense.',
        typeName: 'Monster',
        subTypeName: 'Normal Monster',
        attack: 1000,
        defense: 2600,
        stars: 4,
      },
      {
        name: 'Blight Harbinger',
        code: 'YG-010',
        description: 'Effect monster that drains opponent life.',
        typeName: 'Monster',
        subTypeName: 'Effect Monster',
        attack: 1900,
        defense: 1300,
        stars: 4,
      },
      {
        name: 'Ritual of Dawn',
        code: 'YG-011',
        description: 'Ritual monster of the morning cult.',
        typeName: 'Monster',
        subTypeName: 'Ritual Monster',
        attack: 2400,
        defense: 1800,
        stars: 7,
      },
      {
        name: 'Chromatic Dragon',
        code: 'YG-012',
        description: 'Fusion of multi-element drakes.',
        typeName: 'Monster',
        subTypeName: 'Fusion Monster',
        attack: 3000,
        defense: 2500,
        stars: 9,
      },
      {
        name: 'Harmony Tuner',
        code: 'YG-013',
        description: 'Tuner that balances scales.',
        typeName: 'Monster',
        subTypeName: 'Normal Monster',
        attack: 2200,
        defense: 1600,
        stars: 7,
      },
      {
        name: 'Abyss Overlay',
        code: 'YG-014',
        description: 'XYZ born of abyssal energy.',
        typeName: 'Monster',
        subTypeName: 'Normal Monster',
        attack: 2700,
        defense: 2100,
        stars: 0,
      },
      {
        name: 'Link Vanguard',
        code: 'YG-015',
        description: 'Link arrow points to frontline allies.',
        typeName: 'Monster',
        subTypeName: 'Normal Monster',
        attack: 2000,
        defense: 0,
        stars: 0,
      },
      {
        name: 'Pendulum Archer',
        code: 'YG-016',
        description: 'Pendulum range strikes from distance.',
        typeName: 'Monster',
        subTypeName: 'Normal Monster',
        attack: 1500,
        defense: 1000,
        stars: 3,
      },
      {
        name: 'Golem of Ages',
        code: 'YG-017',
        description: 'Ancient golem with immense durability.',
        typeName: 'Monster',
        subTypeName: 'Normal Monster',
        attack: 1600,
        defense: 3000,
        stars: 8,
      },
      {
        name: 'Spectral Assassin',
        code: 'YG-018',
        description: 'Effect monster that bypasses defenses.',
        typeName: 'Monster',
        subTypeName: 'Effect Monster',
        attack: 2100,
        defense: 1200,
        stars: 5,
      },
      {
        name: 'Ritual Binder',
        code: 'YG-019',
        description: 'Ritual monster that manipulates graveyard.',
        typeName: 'Monster',
        subTypeName: 'Ritual Monster',
        attack: 2000,
        defense: 2200,
        stars: 6,
      },
      {
        name: 'Chromatic Sphinx',
        code: 'YG-020',
        description: 'Fusion guardian of hidden knowledge.',
        typeName: 'Monster',
        subTypeName: 'Fusion Monster',
        attack: 2600,
        defense: 2400,
        stars: 8,
      },

      {
        name: 'Revival Spring',
        code: 'YG-021',
        description: 'Special Summon 1 monster from your GY.',
        typeName: 'Spell',
        subTypeName: 'Normal Spell',
      },
      {
        name: 'Rapid Shift',
        code: 'YG-022',
        description: 'Quickly change a monster position and grant speed.',
        typeName: 'Spell',
        subTypeName: 'Quick-Play Spell',
      },
      {
        name: 'Endless Field',
        code: 'YG-023',
        description: 'Continuous magic that benefits plant archetypes.',
        typeName: 'Spell',
        subTypeName: 'Continuous Spell',
      },
      {
        name: 'Temple Grounds',
        code: 'YG-024',
        description: 'Field spell that empowers ritual summons.',
        typeName: 'Spell',
        subTypeName: 'Field Spell',
      },
      {
        name: 'Blade of Bond',
        code: 'YG-025',
        description: 'Equip: increases ATK when equipped to a dragon.',
        typeName: 'Spell',
        subTypeName: 'Equip Spell',
      },
      {
        name: 'Ancient Rite',
        code: 'YG-026',
        description: 'Ritual spell to call ancient guardians.',
        typeName: 'Spell',
        subTypeName: 'Ritual Spell',
      },
      {
        name: 'Echo of Speed',
        code: 'YG-027',
        description: 'Quick-Play that grants extra attacks.',
        typeName: 'Spell',
        subTypeName: 'Quick-Play Spell',
      },
      {
        name: 'Sustaining Wind',
        code: 'YG-028',
        description: 'Continuous spell that heals each turn.',
        typeName: 'Spell',
        subTypeName: 'Continuous Spell',
      },
      {
        name: 'Mirror Field',
        code: 'YG-029',
        description: 'Field spell that reflects damage.',
        typeName: 'Spell',
        subTypeName: 'Field Spell',
      },
      {
        name: 'Ritebound Chain',
        code: 'YG-030',
        description: 'Ritual Spell: reduces materials needed.',
        typeName: 'Spell',
        subTypeName: 'Ritual Spell',
      },

      {
        name: 'Counterweb',
        code: 'YG-031',
        description: 'Counter trap that negates a spell activation.',
        typeName: 'Trap',
        subTypeName: 'Counter Trap',
      },
      {
        name: 'Shattered Guard',
        code: 'YG-032',
        description: 'Normal trap that destroys attacking monster.',
        typeName: 'Trap',
        subTypeName: 'Normal Trap',
      },
      {
        name: 'Eternal Cage',
        code: 'YG-033',
        description: 'Continuous trap that restricts summons.',
        typeName: 'Trap',
        subTypeName: 'Continuous Trap',
      },
      {
        name: 'Nullifying Rip',
        code: 'YG-034',
        description: 'Counter trap that cancels effects targeting you.',
        typeName: 'Trap',
        subTypeName: 'Counter Trap',
      },
      {
        name: 'Spike Bind',
        code: 'YG-035',
        description: 'Normal trap that traps opponent monsters.',
        typeName: 'Trap',
        subTypeName: 'Normal Trap',
      },
      {
        name: 'Reflective Shell',
        code: 'YG-036',
        description: 'Continuous trap that boosts defense when attacked.',
        typeName: 'Trap',
        subTypeName: 'Continuous Trap',
      },
      {
        name: 'Timing Break',
        code: 'YG-037',
        description: 'Counter trap that reverses activation timing.',
        typeName: 'Trap',
        subTypeName: 'Counter Trap',
      },
      {
        name: 'Ember Snare',
        code: 'YG-038',
        description: 'Normal trap that deals burn damage.',
        typeName: 'Trap',
        subTypeName: 'Normal Trap',
      },
      {
        name: 'Anchor Net',
        code: 'YG-039',
        description: 'Continuous trap: prevents fleeing monsters.',
        typeName: 'Trap',
        subTypeName: 'Continuous Trap',
      },
      {
        name: 'Last Stand',
        code: 'YG-040',
        description:
          'Counter trap that sacrifices resources to save a monster.',
        typeName: 'Trap',
        subTypeName: 'Counter Trap',
      },
    ];

    let count = 0;
    for (const rc of rawCards) {
      count++;
      const type = savedTypes[rc.typeName];
      const sub = savedSubTypes[`${rc.typeName}::${rc.subTypeName}`];

      if (!type || !sub) {
        this.logger.warn(
          `Skipping card ${rc.name} because type/subtype no existe`,
        );
        continue;
      }

      const card = this.cardRepository.create({
        name: rc.name,
        code: rc.code,
        description: rc.description,
        image_url: `https://example.com/images/${rc.code}.jpg`,
        card_type: type,
        card_sub_type: sub,
      });

      const savedCard = await this.cardRepository.save(card);

      // Si es monster, crear CardStatistics apuntando al card (CardStatistics es el owner con JoinColumn card_id)
      if (rc.typeName === 'Monster') {
        const stats = new CardStatisticsEntity();
        stats.card = savedCard;
        stats.attack = rc.attack ?? Math.floor(Math.random() * 2001) + 1000;
        stats.defense = rc.defense ?? Math.floor(Math.random() * 2001) + 1000;
        stats.stars = rc.stars ?? Math.floor(Math.random() * 6) + 3;

        await this.cardStatisticsRepository.save(stats);
      }
    }

    this.logger.log(`🧩 Insertadas ${count} cartas (datos semilla).`);
  }
}
