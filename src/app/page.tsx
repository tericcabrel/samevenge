import { MainLayout } from '@/components/layout/main-layout';
import { SamGeneratorContainer } from './home/sam-generator-container';

export default function Home() {
  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">Generate AWS SAM Events</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Select an AWS service, choose an event type, and generate event payloads for local testing with AWS SAM. SAM
            CLI version: {process.env.NEXT_PUBLIC_SAM_CLI_VERSION}
          </p>
        </div>
        <SamGeneratorContainer />
      </div>
    </MainLayout>
  );
}
