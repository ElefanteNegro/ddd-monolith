import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Name } from '@Shared/domain/value-object/User/Name';
import { LastName } from '@Shared/domain/value-object/User/LastName';
import { Email } from '@Shared/domain/value-object/Email';
import { UserName } from '@Shared/domain/value-object/User/UserName';
import { UserPassword } from '@Shared/domain/value-object/User/UserPassword';
import { Active } from '@Shared/domain/value-object/User/Active';
import { Uuid } from '@Shared/domain/value-object/Uuid';
import { CreatedAt } from '@Shared/domain/value-object/CreatedAt';
import { Page } from '@Shared/domain/value-object/Page';
import { Phone } from '@Shared/domain/value-object/User/Phone';
import { HttpResponseCodes } from '@Shared/HttpResponseCodes';
import { Logger } from '@Shared/domain/interfaces/Logger';
import { UserService } from '@Modules/Users/application/services/UserService';
import { ValidationError, NotFoundError } from '@Shared/domain/exceptions/AppError';
import bcrypt from 'bcrypt';
import { UserRole } from '@Modules/Users/model/interfaces/UserInterface';
import { container } from '@Shared/infrastructure/container';

export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly logger: Logger = container.logger
  ) {}

  createUser = async (req: Request, res: Response): Promise<void> => {
    console.log('REQ.BODY:', req.body);
    this.logger.info('Valores recibidos en req.body:', req.body);
    const uuid = new Uuid(uuidv4());
    const name = new Name(req.body.name);
    const lastName = new LastName(req.body.lastName);
    const userName = new UserName(req.body.userName);
    const email = new Email(req.body.email);
    const password = new UserPassword(req.body.password);
    const active = new Active(req.body.active);
    const createdAt = new CreatedAt(new Date());
    const phone = new Phone(req.body.phone);
    const role = req.body.role || UserRole.PASSENGER;
    const hashedPassword = await bcrypt.hash(password.value, 10);

    const response = await this.userService.create({
      id: uuid.valueAsString,
      name: name.value,
      lastName: lastName.value,
      email: email.value,
      user: userName.value,
      password: hashedPassword,
      phone: phone.value,
      role,
      active: active.value,
      createdAt: createdAt.value
    });

    if (!response.success) {
      this.logger.error('User creation failed:', response.message);
      throw new ValidationError(response.message || 'Error creating new user');
    }

    res.status(HttpResponseCodes.CREATED).json(response);
  };

  getAllUsers = async (req: Request, res: Response): Promise<void> => {
    const pageParam = req.query.page;
    const limitParam = req.query.limit;
    const page = new Page(parseInt(pageParam as string) || 1);
    const limit = parseInt(limitParam as string) || 10;
    const response = await this.userService.getAll(page, limit);

    if (!response.success) {
      throw new ValidationError('Error getting all users');
    }

    res.status(HttpResponseCodes.OK).json(response);
  };

  getUserById = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.userId;
    const response = await this.userService.findById(id);

    if (!response.success) {
      throw new NotFoundError('User not found');
    }

    res.status(HttpResponseCodes.OK).json(response);
  };

  updateUser = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.userId;
    const name = req.body.name ? new Name(req.body.name).value : undefined;
    const lastName = req.body.lastName ? new LastName(req.body.lastName).value : undefined;
    const password = req.body.password ? new UserPassword(req.body.password).value : undefined;

    const response = await this.userService.update(id, { name, lastName, password });

    if (!response.success) {
      throw new ValidationError('Error updating user');
    }

    res.status(HttpResponseCodes.OK).json(response);
  };

  deleteUser = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.userId;
    const response = await this.userService.delete(id);

    if (!response.success) {
      throw new ValidationError('Error deleting user');
    }

    res.status(HttpResponseCodes.OK).json(response);
  };

  authenticateUser = async (req: Request, res: Response): Promise<void> => {
    const email = new Email(req.body.email);
    const password = req.body.password;
    const response = await this.userService.authenticate(email.value, password);

    if (!response.success) {
      throw new ValidationError('Invalid credentials');
    }

    res.status(HttpResponseCodes.OK).json(response);
  };
} 