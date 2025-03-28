"use client"

import React, { HTMLAttributes } from "react"
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { SmileIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type EmojiPickerProps = HTMLAttributes<HTMLDivElement> & {
    onEmojiSelect: (emoji: any) => void;
    triggerClassName?: string;
    align?: "start" | "center" | "end";
    side?: "top" | "bottom" | "left" | "right";
}

const EmojiPicker = ({
    onEmojiSelect,
    className,
    triggerClassName,
    align = "start",
    side = "bottom"
}: EmojiPickerProps) => {
  return (
    <Popover>
        <PopoverTrigger asChild>
            <button
                type="button"
                className={cn(
                    "p-2 hover:bg-muted rounded-md transition-colors",
                    triggerClassName
                )}
            >
                <SmileIcon className="h-4 w-4" />
            </button>
        </PopoverTrigger>
        <PopoverContent 
            className={"w-full h-full p-0"}
            align={align}
            side={side}
        >
            <Picker
                data={data}
                onEmojiSelect={onEmojiSelect}
                theme="light"
                previewPosition="none"
            />
        </PopoverContent>
    </Popover>
  )
}

export default EmojiPicker;
