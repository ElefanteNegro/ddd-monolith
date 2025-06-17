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
import Logger from '@Shared/domain/Logger';
import WinstonLogger from '@Shared/infrastructure/WinstoneLogger';
import { GeneralConstants } from '@Shared/constants';
import { ControllerError } from '@Shared/domain/exceptions/ControllerException';
import { UserRepository } from '../repositories/UserRepository';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { UserService } from '@Modules/Users/application/services/UserService';

export class UserController {
  constructor(
    private readonly userService: UserService = new UserService(
      new UserRepository(new PrismaClient(), new WinstonLogger()), 
      new WinstonLogger()
    ),
    private readonly logger: Logger = new WinstonLogger()
  ) {
    this.handleError = this.handleError.bind(this);
  }

  private handleError = (error: unknown, res: Response): void => {
    this.logger.error(error);
    const status = error instanceof ControllerError
      ? HttpResponseCodes.BAD_REQUEST
      : HttpResponseCodes.INTERNAL_SERVER_ERROR;
    
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    res.status(status).json({ 
      success: false,
      message 
    });
  }

  createUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const uuid = new Uuid(uuidv4());
      const name = new Name(req.body.name);
      const lastName = new LastName(req.body.lastName);
      const userName = new UserName(req.body.userName);
      const email = new Email(req.body.email);
      const password = new UserPassword(req.body.password);
      const active = new Active(req.body.active);
      const createdAt = new CreatedAt(new Date());
      const phone = new Phone(req.body.phone);
      const hashedPassword = await bcrypt.hash(password.value, 10);

      const response = await this.userService.create(
        uuid.valueAsString,
        name,
        lastName,
        email,
        userName,
        hashedPassword,
        active,
        createdAt,
        phone.value
      );

      if (!response.success) {
        throw new ControllerError(response.message || 'Error creating new user', HttpResponseCodes.BAD_REQUEST);
      }

      res.status(HttpResponseCodes.CREATED).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const pageParam = req.query.page;
      const limitParam = req.query.limit;
      const page = new Page(parseInt(pageParam as string) || 1);
      const limit = parseInt(limitParam as string) || 10;
      const response = await this.userService.getAll(page, limit);

      if (!response.success) throw new ControllerError('Error getting all users', HttpResponseCodes.BAD_REQUEST);

      res.status(HttpResponseCodes.OK).send({
        status: GeneralConstants.STATUS_OK,
        users: response.data,
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.userId;
      const response = await this.userService.findById(id);

      if (!response.success) throw new ControllerError('Error getting user by id', HttpResponseCodes.BAD_REQUEST);

      res.status(HttpResponseCodes.OK).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.userId;
      const name = req.body.name ? new Name(req.body.name).value : undefined;
      const lastName = req.body.lastName ? new LastName(req.body.lastName).value : undefined;
      const password = req.body.password ? new UserPassword(req.body.password).value : undefined;

      const response = await this.userService.update(id, { name, lastName, password });

      if (!response.success) throw new ControllerError('Error updating user', HttpResponseCodes.BAD_REQUEST);

      res.status(HttpResponseCodes.OK).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = req.params.userId;
      const response = await this.userService.delete(id);

      if (!response.success) throw new ControllerError('Error deleting user', HttpResponseCodes.BAD_REQUEST);

      res.status(HttpResponseCodes.OK).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  authenticateUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const email = new Email(req.body.email);
      const password = req.body.password;
      const response = await this.userService.authenticate(email, password);

      if (!response.success) throw new ControllerError('Error authenticating user', HttpResponseCodes.BAD_REQUEST);

      res.status(HttpResponseCodes.OK).json(response);
    } catch (error) {
      this.handleError(error, res);
    }
  }
} 