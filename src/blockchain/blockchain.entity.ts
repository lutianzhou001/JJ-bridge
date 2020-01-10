import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Blockchain {
  @PrimaryGeneratedColumn()
  blockHash: string;

  @Column({ type : 'integer', nullable: false})
  blockNumber: number;

  @Column({ type : 'varchar', length: 255, nullable: false})
  from: string;

  @Column({ type : 'varchar', length: 255, nullable: false})
  to: string;

  @Column({ type : 'double', nullable: false})
  amount: number;

  @Column({ type: 'integer', nullable: false})
  isERC20: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true})
  contractAddress: string;

}
