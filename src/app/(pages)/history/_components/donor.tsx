import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2 } from 'lucide-react';
import Link from "next/link";

type OrganizationProps = {
  id: string;
  name: string;
  email: string;
  phone: string;
  imageUrl: string;
};

export function Donor({ id, name, email, phone, imageUrl }: OrganizationProps) {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar>
          <AvatarImage src={imageUrl} alt={name} />
          <AvatarFallback><Building2 /></AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-lg">{name}
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

