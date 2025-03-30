export interface FormData {
    name: string;
    email: string;
    message: string;
  }
  
  export interface FormSubmission extends FormData {
    $id: string;
    $createdAt: string;
    $updatedAt: string;
    $permissions: string[];
    $databaseId: string;
    $collectionId: string;
  }