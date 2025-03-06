'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export function useDocument(id: string) {
  const { data: session } = useSession();
  const [document, setDocument] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchDocument = async () => {
      if (!session || !id) return;
      
      setIsLoading(true);
      setIsError(false);
      
      try {
        const response = await fetch(`/api/documents/${id}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch document');
        }
        
        const data = await response.json();
        setDocument(data);
      } catch (error) {
        console.error('Error fetching document:', error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocument();
  }, [session, id]);

  return {
    document,
    isLoading,
    isError,
  };
}