import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from 'lucide-react';
import Link from "next/link";

type VolunteerProps = {
  id: string;
  name: string;
  email: string;
  phone: string;
  imageUrl: string;
};

export function Volunteer({ id, name, email, phone, imageUrl }: VolunteerProps) {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar>
          <AvatarImage src={imageUrl} alt={name} />
          <AvatarFallback><User /></AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-lg">
            <Link href={`/volunteer/${id}`}>{name}</Link>
          </CardTitle>
          <p className="text-sm text-muted-foreground">{email}</p>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm">Phone: {phone}</p>
      </CardContent>
    </Card>
  );
}

