import { Editor } from "@tiptap/react";
import { Toggle } from "@/components/ui/toggle";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
    FontBoldIcon,
    FontItalicIcon,
    ListBulletIcon,
    QuoteIcon,
    StrikethroughIcon,
    CodeIcon
} from "@radix-ui/react-icons";
import { UndoIcon, RedoIcon, ListOrderedIcon, CodeSquareIcon } from "lucide-react";
import { ReactNode } from "react";

const toolbarItemGroups = [
    {
        id: 1,
        items: [
            {
                icon: FontBoldIcon,
                tooltip: "Bold",
                action: (editor: Editor) => editor.chain().focus().toggleBold().run(),
                isActive: (editor: Editor) => editor.isActive("bold"),
            },
            {
                icon: FontItalicIcon,
                tooltip: "Italic",
                shortcut: "⌘+I",
                action: (editor: Editor) => editor.chain().focus().toggleItalic().run(),
                isActive: (editor: Editor) => editor.isActive("italic"),
                canRun: (editor: Editor) => editor.can().chain().focus().toggleItalic().run(),
            },
            {
                icon: StrikethroughIcon,
                tooltip: "Strike",
                shortcut: "⌘+Shift+S",
                action: (editor: Editor) => editor.chain().focus().toggleStrike().run(),
                isActive: (editor: Editor) => editor.isActive("strike"),
                canRun: (editor: Editor) => editor.can().chain().focus().toggleStrike().run(),
            },
        ],
    },
    {
        id: 2,
        items: [
            {
                icon: ListBulletIcon,
                tooltip: "Bullet List",
                shortcut: "⌘+Shift+8",
                action: (editor: Editor) => editor.chain().focus().toggleBulletList().run(),
                isActive: (editor: Editor) => editor.isActive("bulletList"),
                canRun: (editor: Editor) => editor.can().chain().focus().toggleBulletList().run(),
            },
            {
                icon: ListOrderedIcon,
                tooltip: "Numbered List",
                shortcut: "⌘+Shift+7",
                action: (editor: Editor) => editor.chain().focus().toggleOrderedList().run(),
                isActive: (editor: Editor) => editor.isActive("orderedList"),
                canRun: (editor: Editor) => editor.can().chain().focus().toggleOrderedList().run(),
            },
            {
                icon: CodeIcon,
                tooltip: "Code",
                shortcut: "⌘+E",
                action: (editor: Editor) => editor.chain().focus().toggleCode().run(),
                isActive: (editor: Editor) => editor.isActive("code"),
                canRun: (editor: Editor) => editor.can().chain().focus().toggleCode().run(),
            },
            {
                icon: CodeSquareIcon,
                tooltip: "Code Block",
                action: (editor: Editor) => editor.chain().focus().toggleCodeBlock().run(),
                isActive: (editor: Editor) => editor.isActive("codeBlock"),
                canRun: (editor: Editor) => editor.can().chain().focus().toggleCodeBlock().run(),
            },
            {
                icon: QuoteIcon,
                tooltip: "Quote",
                shortcut: "⌘+Shift+B",
                action: (editor: Editor) => editor.chain().focus().toggleBlockquote().run(),
                isActive: (editor: Editor) => editor.isActive("blockquote"),
                canRun: (editor: Editor) => editor.can().chain().focus().toggleBlockquote().run(),
            },
        ],
    },
    {
        id: 3,
        items: [
            {
                icon: UndoIcon,
                tooltip: "Undo",
                shortcut: "⌘+Z",
                action: (editor: Editor) => editor.chain().focus().undo().run(),
                isActive: () => false,
                canRun: (editor: Editor) => editor.can().chain().focus().undo().run(),
            },
            {
                icon: RedoIcon,
                tooltip: "Redo",
                shortcut: "⌘+Shift+Z",
                action: (editor: Editor) => editor.chain().focus().redo().run(),
                isActive: () => false,
                canRun: (editor: Editor) => editor.can().chain().focus().redo().run(),
            },
        ],
    },
];

type ToolbarProps = {
    editor: Editor | null;
    children?: ReactNode;
}

const Toolbar = ({ editor, children }: ToolbarProps) => {
    if (!editor) return null;

    return (
        <div className="flex flex-wrap items-center gap-1 pt-1 pb-0 divide-x-1">
            {toolbarItemGroups.map((group) => (
                <div key={group.id} className="px-1 space-x-1">
                    <TooltipProvider>
                        {group.items.map((item) => (
                            <Tooltip key={item.tooltip}>
                                <TooltipTrigger asChild>
                                    <Toggle
                                        onPressedChange={() => item.action(editor)}
                                        disabled={item.canRun ? !item.canRun(editor) : false}
                                        size="sm"
                                        className={cn({
                                            "bg-accent": item.isActive(editor),
                                        })}
                                        pressed={item.isActive(editor)}
                                    >
                                        <item.icon />
                                    </Toggle>
                                </TooltipTrigger>
                                <TooltipContent>
                                    {item.tooltip}{" "}
                                    {item.shortcut && (
                                        <span className="text-xs text-muted-foreground">
                                            ({item.shortcut})
                                        </span>
                                    )}
                                </TooltipContent>
                            </Tooltip>
                        ))}
                    </TooltipProvider>
                </div>
            ))}
            <div className="px-1">
                {children}
            </div>
        </div>
    );
};

export default Toolbar;
