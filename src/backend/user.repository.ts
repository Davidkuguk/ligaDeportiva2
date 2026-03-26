import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

import { MongoServerError } from 'mongodb';

import { ensureMongoCollections, getUsersCollection, UserDocument } from './mongo.service';

const scrypt = promisify(scryptCallback);

export interface RegisterUserInput {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  tipo: UserDocument['tipo'];
  teamName?: string;
  email?: string;
}

export interface RegisterUserResult {
  username: string;
  tipo: UserDocument['tipo'];
  teamName?: string;
  createdAt: string;
}

export interface LoginUserInput {
  username: string;
  password: string;
}

export interface LoginUserResult {
  username: string;
  tipo: UserDocument['tipo'];
  firstName: string;
  teamName?: string;
}

export class DuplicateUserError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DuplicateUserError';
  }
}

export async function registerUser(input: RegisterUserInput): Promise<RegisterUserResult> {
  await ensureMongoCollections();

  const usersCollection = await getUsersCollection();
  const username = input.username.trim().toLowerCase();
  const email = input.email?.trim().toLowerCase() || undefined;
  const teamName = input.teamName?.trim() || undefined;
  const now = new Date().toISOString();

  const userDocument: UserDocument = {
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    username,
    passwordHash: await hashPassword(input.password),
    tipo: input.tipo,
    role: input.tipo === 'admin' ? 'admin' : 'user',
    createdAt: now,
    updatedAt: now,
  };

  if (email) {
    userDocument.email = email;
  }

  if (teamName) {
    userDocument.teamName = teamName;
  }

  try {
    await usersCollection.insertOne(userDocument);
  } catch (error) {
    if (error instanceof MongoServerError && error.code === 11000) {
      const duplicatedField = getDuplicatedField(error);
      const message =
        duplicatedField === 'email'
          ? 'El correo electronico ya existe.'
          : 'El nombre de usuario ya existe.';

      throw new DuplicateUserError(message);
    }

    throw error;
  }

  return {
    username: userDocument.username,
    tipo: userDocument.tipo,
    teamName: userDocument.teamName,
    createdAt: userDocument.createdAt,
  };
}

export async function loginUser(input: LoginUserInput): Promise<LoginUserResult | null> {
  await ensureMongoCollections();

  const usersCollection = await getUsersCollection();
  const username = input.username.trim().toLowerCase();
  const user = await usersCollection.findOne({ username });

  if (!user) {
    return null;
  }

  const matches = await verifyPassword(input.password, user.passwordHash);

  if (!matches) {
    return null;
  }

  return {
    username: user.username,
    tipo: user.tipo,
    firstName: user.firstName,
    teamName: user.teamName,
  };
}

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = (await scrypt(password, salt, 64)) as Buffer;

  return `${salt}:${derivedKey.toString('hex')}`;
}

async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const [salt, hash] = storedHash.split(':');

  if (!salt || !hash) {
    return false;
  }

  const storedBuffer = Buffer.from(hash, 'hex');
  const derivedKey = (await scrypt(password, salt, storedBuffer.length)) as Buffer;

  return storedBuffer.length === derivedKey.length && timingSafeEqual(storedBuffer, derivedKey);
}

function getDuplicatedField(error: MongoServerError): string | null {
  const keyPattern = error['keyPattern'];

  if (typeof keyPattern === 'object' && keyPattern !== null) {
    const [field] = Object.keys(keyPattern);
    return field ?? null;
  }

  if (typeof error.message === 'string') {
    if (error.message.includes('email')) {
      return 'email';
    }

    if (error.message.includes('username')) {
      return 'username';
    }
  }

  return null;
}
