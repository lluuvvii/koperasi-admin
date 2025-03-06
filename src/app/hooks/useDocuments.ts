'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { DocumentType } from '@/app/types/document';

interface UseDocumentsParams {
  type?: DocumentType;
  search?: string;
  startDate?: string;
  endDate?: string;
}

export function useDocuments({
  type,
  search = '',
  startDate = '',
  endDate = '',
}: UseDocumentsParams = {}) {
  const { data: session } = useSession();
  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchDocuments = async () => {
    if (!session) return;

    setIsLoading(true);
    setIsError(false);

    try {
      // Build query params
      const params = new URLSearchParams();
      if (type) params.append('type', type);
      if (search) params.append('search', search);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await fetch(`/api/documents?${params.toString()}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch documents');
      }

      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      console.error('Error fetching documents:', error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [session, type, search]);

  return {
    documents,
    isLoading,
    isError,
    refetch: fetchDocuments,
  };
}