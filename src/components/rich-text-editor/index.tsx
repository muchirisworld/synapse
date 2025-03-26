"use client";

import React, { useCallback, useRef, useState } from 'react';
import { EditorContent, useEditor } from "@tiptap/react";
import type { Editor } from "@tiptap/react";
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
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    onSend?: () => void;
    editorClassName?: string;
    maxHeight?: string;
    className?: string;
}

const TextEditor = ({
    value,
    onChange,
    onSend,
    className,
    editorClassName,
    maxHeight = "max-h-[400px]",
    placeholder = "Type your message..."
}: TextEditorProps) => {
    const [showToolbar, setShowToolbar] = useState(true);
    // Ref to store a timeout ID, initialized to null
    const editorUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    
    const onUpdate = useCallback(
        ({ editor }: { editor: Editor }) => {
            // If a timeout is already set, clear it to prevent multiple updates
            if (editorUpdateTimeoutRef.current) {
                clearTimeout(editorUpdateTimeoutRef.current);
            }
            // Set a new timeout to delay the execution of the onChange function
            editorUpdateTimeoutRef.current = setTimeout(() => {
                // Call the onChange function with the current HTML content of the editor
                onChange(editor.getHTML());
            }, 100); // Delay of 100ms to debounce rapid updates
        },
        [onChange]
    );
    
    const editor = useEditor({
        extensions: [
            ...extensions,
            Placeholder.configure({
                placeholder: placeholder,
                emptyEditorClass: 'is-editor-empty',
            })
        ],
        content: value,
        onUpdate: onUpdate,
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
        {onSend && (
            <Button
                size="icon"
                className="rounded-full"
                onClick={onSend}
                disabled={!editor?.getText().trim()}
            >
                <ArrowUpIcon className="h-4 w-4" />
            </Button>
        )}
      </div>
    </div>
  )
}

export default TextEditor;
