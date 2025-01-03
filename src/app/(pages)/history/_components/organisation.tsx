import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Building2 } from 'lucide-react';
import Link from "next/link";

type OrganizationProps = {
  id: string;
  name: string;
  email: string;
  phone: string;
  imageUrl: string;
};

export function Organization({ id, name, email, phone, imageUrl }: OrganizationProps) {
  return (
    <div className="flex flex-row items-start gap-4 w-full">
      <Avatar>
        <AvatarImage src={imageUrl} alt={name} />
        <AvatarFallback><Building2 /></AvatarFallback>
      </Avatar>
      <div>
        <h3 className="text-lg font-semibold">
          <Link href={`/volunteer/${id}`}>{name}</Link>
        </h3>
        <p className="text-sm text-muted-foreground">{email}</p>
        <p className="text-sm">Phone: {phone}</p>
      </div>
    </div>
  );
}


