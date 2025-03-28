"use client";

import React, { useCallback, useRef, useState } from 'react';
import { EditorContent, useEditor } from "@tiptap/react";
import Placeholder from "@tiptap/extension-placeholder";
import StarterKit from "@tiptap/starter-kit";
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowUpIcon, LetterCaseCapitalizeIcon } from '@radix-ui/react-icons';
import { Button } from '../ui/button';
import Toolbar from './toolbar';
import { Toggle } from '../ui/toggle';
import EmojiPicker from '../elements/emoji-picker';

const extensions = [StarterKit];

type TextEditorProps = {
    initialValue?: string;
    handleCancel?: () => void;
    isEditing?: boolean;
    onSend?: (content: string) => void;
    editorClassName?: string;
    maxHeight?: string;
    className?: string;
    placeholder?: string;
}

const TextEditor = ({
    initialValue,
    handleCancel,
    isEditing,
    onSend,
    className,
    editorClassName,
    maxHeight = "max-h-[400px]",
    placeholder = "Type your message..."
}: TextEditorProps) => {
    const [showToolbar, setShowToolbar] = useState(true);
    
    const editor = useEditor({
        extensions: [
            ...extensions,
            Placeholder.configure({
                placeholder: placeholder,
                emptyEditorClass: 'is-editor-empty',
            })
        ],
        content: isEditing ? initialValue : "",
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: cn(
                    "focus:outline-none focus-visible:outline-none [&>*:first-child]:mt-0 w-full h-full prose prose-sm dark:prose-invert text-sm",
                    editorClassName
                ),
            },
        },
    });
    
    const insertEmoji = useCallback((emoji: any) => {
            if (editor) {
                editor.commands.insertContent(emoji.native)
            }
        }, [editor]
    );

    const handleSend = useCallback(() => {
        if (editor && onSend) {
            const content = editor.getHTML();
            onSend(content);
            editor.commands.clearContent();
        }
    }, [editor, onSend]);

  return (
    <div className={cn("rounded-lg border border-input flex flex-col overflow-hidden", className)}>
        {showToolbar && (
            <Toolbar editor={editor} />
        )}
      
        <div className="flex-1 min-h-0 overflow-hidden">
            <ScrollArea className="h-full">
                <EditorContent
                    className={cn(
                        "prose prose-sm dark:prose-invert w-full px-4 py-2"
                    )}
                    editor={editor}
                />
            </ScrollArea>
        </div>
        
      <div className="p-2 flex items-center gap-2 bg-background pt-0">
        <div className="flex-1">
            <div className="flex items-center gap-1">
                <Toggle
                    pressed={showToolbar}
                    onPressedChange={setShowToolbar}
                    size="sm"
                    className="h-8 w-8"
                >
                    <LetterCaseCapitalizeIcon className="h-4 w-4" />
                </Toggle>

                <EmojiPicker
                    triggerClassName="h-8 w-8" 
                    onEmojiSelect={insertEmoji}
                />
            </div>
        </div>
        <div className="flex items-center gap-2">
            {isEditing && (
                <Button
                    variant={"secondary"}
                    size={'sm'}
                    onClick={handleCancel}
                >
                    Cancel
                </Button>
            )}
            
            {onSend && (
                <Button
                    size="icon"
                    className="rounded-full"
                    onClick={handleSend}
                    disabled={!editor?.getText().trim()}
                >
                    <ArrowUpIcon className="h-4 w-4" />
                </Button>
            )}
        </div>
      </div>
    </div>
  )
}

export default TextEditor;
