'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface GoogleDrivePdfViewerProps {
  url: string;
}

const getGoogleDriveEmbedUrl = (url: string): string | null => {
  let fileId = null;

  try {
    const urlObj = new URL(url);
    if (urlObj.hostname.includes('drive.google.com')) {
      const pathParts = urlObj.pathname.split('/');
      const fileIdIndex = pathParts.findIndex(part => part === 'd');
      if (fileIdIndex !== -1 && pathParts.length > fileIdIndex + 1) {
        fileId = pathParts[fileIdIndex + 1];
      }
    }
  } catch (error) {
    console.error('Invalid URL for PDF viewer', error);
    return null;
  }
  
  if (fileId) {
    return `https://drive.google.com/file/d/${fileId}/preview`;
  }
  
  // Fallback for direct links or other formats
  return url;
};

export function GoogleDrivePdfViewer({ url }: GoogleDrivePdfViewerProps) {
  const [embedUrl, setEmbedUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const processedUrl = getGoogleDriveEmbedUrl(url);
    setEmbedUrl(processedUrl);
  }, [url]);

  if (!embedUrl) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Document PDF</CardTitle>
            </CardHeader>
            <CardContent>
                <p className='text-destructive'>Le lien vers le PDF est invalide ou n'est pas supporté.</p>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Document PDF</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="aspect-[4/3] w-full relative">
            {isLoading && (
                 <Skeleton className="absolute inset-0 w-full h-full rounded-lg" />
            )}
            <iframe
                src={embedUrl}
                className={`w-full h-full rounded-lg border transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                title="Lecteur PDF Google Drive"
                onLoad={() => setIsLoading(false)}
            />
        </div>
      </CardContent>
    </Card>
  );
}
