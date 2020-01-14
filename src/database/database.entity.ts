import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Blockchain {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer', nullable: false })
  blockNumber: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  from: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  to: string;

  @Column({ type: 'double', nullable: false })
  value: number;

  @Column({ type: 'integer', nullable: false })
  isERC20: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  contractAddress: string;

  @Column({ type: 'varchar', nullable: false })
  transactionHash: string;

  @Column({ type: 'integer', nullable: false })
  isChecked: number;

  @Column({ type: 'integer', nullable: false })
  isUpdated: number;
}

@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  btcAddress: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  ethAddress: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  btcPrivateKey: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  ethPrivateKey: string;

  @Column({ type: 'integer', nullable: false })
  isAllocated: number;

  @Column({ type: 'integer', nullable: false })
  isAvailable: number;

}

