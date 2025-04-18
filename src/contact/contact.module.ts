import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { Contact } from './contact.entity';
import { UserModule } from '../users/user.module'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([Contact]),
    UserModule, 
  ],
  controllers: [ContactController],
  providers: [ContactService],
})
export class ContactModule {}
