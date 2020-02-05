import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Blockchain {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  transactionHash: string;

  @Column({ type: 'integer', nullable: false })
  blockNumber: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  from: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  to: string;

  @Column({ type: 'double', nullable: false })
  value: number;

  @Column({ type: 'integer', nullable: false })
  isERC20: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  contractAddress: string;

  @Column({ type: 'integer', nullable: false })
  isUpdated: number;

  @Column({ type: 'integer', nullable: false })
  isCollected: number;
}

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  transactionHash: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  from: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  to: string;

  @Column({ type: 'double', nullable: false })
  value: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  coin_name: string;

  @Column({ type: 'integer', nullable: true })
  isSuccess: number;

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

