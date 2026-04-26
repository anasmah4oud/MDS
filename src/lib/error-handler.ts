/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { supabase } from './supabase';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface DatabaseErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
  };
}

export async function handleDatabaseError(error: unknown, operationType: OperationType, path: string | null) {
  const { data: { session } } = await supabase.auth.getSession();
  const currentUser = session?.user;
  
  const errInfo: DatabaseErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: currentUser?.id,
      email: currentUser?.email,
    },
    operationType,
    path
  }
  console.error('Database Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}
