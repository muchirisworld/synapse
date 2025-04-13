"use client";

import React, { ReactNode } from 'react';
import CreateWorkspace from '@/components/elements/create-workspace';
import Toolbar from '@/components/layouts/toolbar';
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import Sidebar from '@/components/layouts/sidebar';
import CreateChannel from '@/components/elements/create-channel';
import { usePanel } from '@/hooks/use-panel';
import { Loader } from 'lucide-react';
import Thread from '@/components/elements/thread';
import { Id } from '../../../convex/_generated/dataModel';

const WorspaceLayout = ({ children }: { children: ReactNode }) => {
    const { parentMessageId, onClose } = usePanel();

    const showPanel = !!parentMessageId;

  return (
    <div className='bg-muted/50'>
        <CreateWorkspace />
        <CreateChannel />

        <div className="grid gap-4 grid-cols-[3rem_1fr] p-2">
            <Toolbar />

            <div className="bg-background shadow min-h-[calc(100vh-2rem)] grid grid-cols-[15rem_1fr]">
                <Sidebar />

                <ResizablePanelGroup
                    direction='horizontal'
                    autoSaveId={"gre8i-workspace-layout"}
                >
                    <ResizablePanel minSize={20}>
                        {children}
                    </ResizablePanel>

                    {showPanel && (
                        <>
                            <ResizableHandle className="bg-muted/50" />
                            <ResizablePanel
                                defaultSize={29}
                                minSize={20}
                            >
                            {parentMessageId ? (
                                <Thread
                                    messageId={parentMessageId as Id<"messages">}
                                    onClose={onClose}
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center">
                                    <Loader className='shrink-0 animate-spin size-5 text-muted-foreground' />
                                </div>
                            )}
                            </ResizablePanel>
                        </>
                    )}

                </ResizablePanelGroup>
            </div>
        </div>
      
    </div>
  )
}

export default WorspaceLayout
