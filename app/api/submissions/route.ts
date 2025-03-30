import { NextResponse } from 'next/server';
import { databases, databaseId, collectionId } from '@/app/lib/appwrite';
import { FormSubmission } from '@/app/types/form';
import { ID } from 'appwrite';

export async function GET() {
  try {
    const response = await databases.listDocuments<FormSubmission>(
      databaseId,
      collectionId
    );
    return NextResponse.json(response.documents);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const response = await databases.createDocument<FormSubmission>(
      databaseId,
      collectionId,
      ID.unique(),
      data
    );
    return NextResponse.json(response);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}