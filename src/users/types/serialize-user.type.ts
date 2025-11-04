import { Exclude } from 'class-transformer';

export class SerializedUser {
  email: string;
  name?: string | null;
  settings?: any;
  posts?: any[];

  @Exclude()
  password: string | null;

  constructor(partial: Partial<SerializedUser>) {
    Object.assign(this, partial);
  }
}
