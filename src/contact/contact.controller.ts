import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { Contact } from './contact.entity';
import { Roles } from '../auth/roles/roles.decorator';
import { RolesGuard } from '../auth/roles/roles.guard';
import { JwtAuthGuard } from '../auth/auth.guard';
import { UserRole } from '../users/user.entity';

@UseGuards(JwtAuthGuard, RolesGuard) 
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @Roles(UserRole.User, UserRole.Admin) 
  async create(@Body() createContactDto: CreateContactDto): Promise<Contact> {
    return this.contactService.create(createContactDto);
  }

  @Get()
  @Roles(UserRole.Admin, UserRole.User) 
  async findAll(): Promise<Contact[]> {
    return this.contactService.findAll();
  }
}
