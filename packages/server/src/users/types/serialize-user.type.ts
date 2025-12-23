import { Exclude } from 'class-transformer';

export class SerializedUser {
  email!: string;
  name?: string | null;
  settings?: any;
  posts?: any[];
  role?: string;

  @Exclude()
  password!: string | null;

  constructor(partial: Partial<SerializedUser>) {
    Object.assign(this, partial);
  }
}
