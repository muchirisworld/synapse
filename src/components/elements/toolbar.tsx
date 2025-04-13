import React from 'react';
import { Button } from '../ui/button';
import { Pencil } from 'lucide-react';
import { TrashIcon, ChatBubbleIcon } from '@radix-ui/react-icons';
import EmojiPicker from './emoji-picker';
import useConfirm from '@/hooks/use-confirm';

type ToolbarProps = {
    isAuthor: boolean;
    isPending: boolean;
    handleEdit: () => void;
    handleThread: () => void;
    handleDelete: () => void;
    handleReaction: (value: string) => void;
    hideThreadButton?: boolean;
};

const Toolbar = ({
    isAuthor,
    isPending,
    handleEdit,
    handleThread,
    handleDelete,
    handleReaction,
    hideThreadButton,
}: ToolbarProps) => {
    const [ConfirmDialog, confirm] = useConfirm({
        title: "Are you sure?",
        message: "Are you sure you want to delete this message? This action cannot be undone.",
    });

    const handleDeleteMessage = async () => {
        const ok = await confirm();
        if (!ok) return;
        handleDelete();
    };
  return (
    <div className='absolute top-0 right-5'>
        <ConfirmDialog />

        <div className="group-hover:opacity-100 opacity-0 transition-opacity bg-background border rounded-md shadow-sm p-1">
            <EmojiPicker
                onEmojiSelect={(value) => handleReaction(value.native) }
                className='size-7'
                side='left'
                align='start'
            />

            {!hideThreadButton &&
            <Button
                variant={'ghost'}
                size='icon'
                className='size-7'
                disabled={isPending}
                onClick={handleThread}
            >
                <ChatBubbleIcon className='size-2' />
            </Button>}

            {isAuthor &&
            <Button
                variant={'ghost'}
                size='icon'
                className='size-7'
                disabled={isPending}
                onClick={handleEdit}
            >
                <Pencil className='size-2' />
            </Button>}

            {isAuthor &&
            <Button
                variant={'ghost'}
                size='icon'
                className='size-7'
                disabled={isPending}
                onClick={handleDeleteMessage}
            >
                <TrashIcon className='size-2' />
            </Button>}
        </div>
    </div>
  )
}

export default Toolbar