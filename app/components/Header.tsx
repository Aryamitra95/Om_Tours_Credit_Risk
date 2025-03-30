'use client';
import { account } from '@/app/lib/appwrite';

interface HeaderProps {
  onLogout: () => void;
}

export default function Header({ onLogout }: HeaderProps) {
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-black">OMM TOURS</h1>
        <button
          onClick={onLogout}
          className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </header>
  );
}