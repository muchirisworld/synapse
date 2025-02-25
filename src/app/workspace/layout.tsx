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

const WorspaceLayout = ({ children }: { children: ReactNode }) => {
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
                </ResizablePanelGroup>
            </div>
        </div>
      
    </div>
  )
}

export default WorspaceLayout
