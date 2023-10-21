import { Company } from '@/lib/types';

export interface ActionsContext {
  company: Company;
  funded: boolean;
  completed: boolean;
}
