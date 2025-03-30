'use client'
import { account } from '@/app/lib/appwrite';

import { ReactNode } from 'react';
export const handleLogout = async () => {
    try {
      await account.deleteSession('current');
      return true;
    } catch (error) {
      console.error('Error logging out:', error);
      return false
    }
  };
  export interface DashboardLayoutProps {
    children: React.ReactNode;
  }