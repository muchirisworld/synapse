import React, { HTMLAttributes } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { cn } from '@/lib/utils';

type AvatarButtonProps = HTMLAttributes<HTMLDivElement> & {
    imageUrl?: string;
    alt: string;
    fallback: string;
}

const AvatarButton = ({ imageUrl, alt, fallback, className }: AvatarButtonProps) => {
  return (
    <Avatar className={cn("rounded-lg", className)}>
        <AvatarImage src={imageUrl} alt={alt} />
        <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  )
}

export default AvatarButton;
