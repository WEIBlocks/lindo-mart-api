import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ContactService } from './contact.service';
import { Contact } from '../schemas/contact.schema';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  async create(@Body() contactData: Partial<Contact>): Promise<Contact> {
    return this.contactService.create(contactData);
  }

  @Get()
  async findAll(): Promise<Contact[]> {
    return this.contactService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Contact> {
    return this.contactService.findById(id);
  }

  @Put(':id/resolve')
  async markAsResolved(@Param('id') id: string): Promise<Contact> {
    return this.contactService.markAsResolved(id);
  }
}
