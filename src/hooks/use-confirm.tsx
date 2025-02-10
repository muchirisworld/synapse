"use client";

import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';

type ConfirmProps = {
    title: string;
    message: string;
}

const useConfirm = (
    { title, message }: ConfirmProps
) => {
    const [promise, setPromise] = useState<{ resolve: (value: boolean) => void } | null>(null);

    const confirm = () => new Promise((resolve, reject) => {
        setPromise({ resolve });
    })

    const hanldeClose = () => {
        setPromise(null);
    }

    const handleCancel = () => {
        promise?.resolve(false);
        hanldeClose();
    }

    const handleConfirm = () => {
        promise?.resolve(true);
        hanldeClose();
    }

    const ConfirmDialog = () => (
        <Dialog open={promise !== null}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{message}</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        onClick={handleConfirm}
                    >
                        Confirm
                    </Button>
                    <Button
                        onClick={handleCancel}
                        variant={'secondary'}
                    >
                        Cancel
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )

  return [ConfirmDialog, confirm]
}

export default useConfirm
