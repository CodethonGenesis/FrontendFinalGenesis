import { EventEmitter, Injectable } from '@angular/core';
import { User } from '../interfaces/user';
import { LoginCredentials } from '../interfaces/auth.types';


export interface PageEvent {
  page: number;
  size: number;
}

export interface UserFormErrors {
  field: string;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class SharingDataService {
  private readonly newUser = new EventEmitter<User>();
  private readonly userId = new EventEmitter<number>();
  private readonly findUserById = new EventEmitter<number>();
  private readonly selectedUser = new EventEmitter<User>();
  private readonly userFormErrors = new EventEmitter<UserFormErrors[]>();
  private readonly pageUsers = new EventEmitter<PageEvent>();
  private readonly handlerLogin = new EventEmitter<LoginCredentials>();

  // Getters with proper return types
  get handlerLoginEventEmitter(): EventEmitter<LoginCredentials> {
    return this.handlerLogin;
  }

  get pageUsersEventEmitter(): EventEmitter<PageEvent> {
    return this.pageUsers;
  }

  get errorsUserFormEventEmitter(): EventEmitter<UserFormErrors[]> {
    return this.userFormErrors;
  }

  get selectUserEventEmitter(): EventEmitter<User> {
    return this.selectedUser;
  }

  get findUserByIdEventEmitter(): EventEmitter<number> {
    return this.findUserById;
  }

  get newUserEventEmitter(): EventEmitter<User> {
    return this.newUser;
  }

  get idUserEventEmitter(): EventEmitter<number> {
    return this.userId;
  }
}
