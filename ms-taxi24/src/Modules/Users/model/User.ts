import { UserInterface } from './interfaces/UserInterface';
import bcrypt from 'bcrypt';

export class User implements UserInterface {
  id: string;
  name: string;
  lastName: string;
  email: string;
  phone: string;
  private password?: string;

  constructor(data: Partial<User>) {
    this.id = data.id || '';
    this.name = data.name || '';
    this.lastName = data.lastName || '';
    this.email = data.email || '';
    this.phone = data.phone || '';
    this.password = data.password;
  }

  async setPassword(password: string): Promise<void> {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(password, salt);
  }

  async comparePassword(candidatePassword: string): Promise<boolean> {
    if (!this.password) return false;
    return bcrypt.compare(candidatePassword, this.password);
  }

  toDTO(): UserInterface {
    return {
      id: this.id,
      name: this.name,
      lastName: this.lastName,
      email: this.email,
      phone: this.phone
    };
  }
} 