import { Metadata } from 'next';

export async function generateMetadata({ searchParams }: { searchParams: { og_image?: string } }): Promise<Metadata> {
  const ogImage = searchParams.og_image;

  if (ogImage) {
    return {
      openGraph: {
        images: [ogImage],
      },
      twitter: {
        card: 'summary_large_image',
        images: [ogImage],
      },
    };
  }

  return {};
} 