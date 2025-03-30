// appwrite.d.ts
import { Models } from 'appwrite';

declare namespace Appwrite {
  // ================= Database Configuration =================
  interface DatabaseConfig {
    id: 'loan_applications';
    name: 'Loan Applications';
    collections: {
      applications: CollectionConfig;
    };
  }

  interface CollectionConfig {
    id: 'applications';
    name: 'Applications';
  }

  // ================= Data Types =================
  type LoanPurpose = 'debt' | 'home' | 'personal' | 'vehicle' | 'other';
  type EmploymentType = 'Full' | 'Part' | 'Self' | 'Retired';

  // Core document structure
  interface LoanApplicationBase {
    amount: number;
    term: number;
    all_active_acc: number;
    default_acc: number;
    acc_opened_12m: number;
    acc_age: number;
    balance: number;
    no_of_defaults: number;
    loan_purpose: LoanPurpose;
    employment_type: EmploymentType;
    name: string;
    email: string;
  }

  // ================= Document Types =================
  interface LoanApplicationCreate extends LoanApplicationBase {}
  
  interface LoanApplicationUpdate extends Partial<LoanApplicationBase> {
    $id: string; // Required for updates
  }

  interface LoanApplicationDocument extends LoanApplicationBase, Models.Document {}

  // ================= API Response Types =================
  interface ListResponse<T> {
    total: number;
    documents: T[];
  }

  // ================= Query Types =================
  interface QueryOptions {
    filters?: QueryFilters;
    orderBy?: string;
    orderType?: 'ASC' | 'DESC';
    limit?: number;
    offset?: number;
  }

  interface QueryFilters {
    amountRange?: [number, number];
    termRange?: [number, number];
    loanPurpose?: LoanPurpose[];
    employmentType?: EmploymentType[];
    searchQuery?: string;
  }
}

// ================= Appwrite SDK Extensions =================
declare module 'appwrite' {
  export namespace Models {
    interface Document {
      $id: string;
      $collectionId: string;
      $databaseId: string;
      $createdAt: string;
      $updatedAt: string;
      $permissions?: string[];
    }
  }

  export interface Databases {
    createLoanApplication(
      databaseId: string,
      collectionId: string,
      data: Appwrite.LoanApplicationCreate
    ): Promise<Appwrite.LoanApplicationDocument>;

    updateLoanApplication(
      databaseId: string,
      collectionId: string,
      documentId: string,
      data: Appwrite.LoanApplicationUpdate
    ): Promise<Appwrite.LoanApplicationDocument>;

    listLoanApplications(
      databaseId: string,
      collectionId: string,
      queries?: string[]
    ): Promise<Appwrite.ListResponse<Appwrite.LoanApplicationDocument>>;
  }
}