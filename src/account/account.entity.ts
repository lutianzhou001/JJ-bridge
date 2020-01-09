import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type : 'varchar', length: 255, nullable: true})
  btcAddress: string;

  @Column({ type : 'varchar', length: 255, nullable: true})
  ethAddress: string;

  @Column({ type : 'varchar', length: 255, nullable: true})
  btcPrivateKey: string;

  @Column({ type : 'varchar', length: 255, nullable: true})
  ethPrivateKey: string;
}
