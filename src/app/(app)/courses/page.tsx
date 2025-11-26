import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { courses } from '@/lib/data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CoursesPage() {
  const getImage = (id: string) => {
    return PlaceHolderImages.find((img) => img.id === id);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => {
        const image = getImage(course.image);
        return (
          <Card key={course.id} className="flex flex-col">
            <CardHeader>
              <div className="relative h-40 w-full mb-4">
                {image && (
                  <Image
                    src={image.imageUrl}
                    alt={course.title}
                    fill
                    className="rounded-lg object-cover"
                    data-ai-hint={image.imageHint}
                  />
                )}
              </div>
              <Badge variant="secondary" className="w-fit">{course.category}</Badge>
              <CardTitle>{course.title}</CardTitle>
              <CardDescription className="line-clamp-2">{course.description}</CardDescription>
            </CardHeader>
            <CardFooter className="mt-auto">
              <Button asChild className="w-full">
                <Link href="#">
                  View Course <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
