'use client';

import { ServiceSelector } from '@/app/home/service-selector';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useEventGenerator } from '@/hooks/use-event-generator';
import { EventPayloadInput } from './event-payload-input';
import { ServiceEventTypeSelector } from './service-event-type-selector';

export const SamGeneratorContainer = () => {
  const { state, actions } = useEventGenerator();

  return (
    <>
      <div className="grid grid-cols-6 gap-4">
        <div className="space-y-6 col-span-2">
          <div className="space-y-6">
            <Card>
              <CardContent className="space-y-8">
                <ServiceSelector selectedService={state.selectedService} onServiceSelect={actions.setSelectedService} />

                <ServiceEventTypeSelector
                  selectedEvent={state.selectedEvent}
                  onSelectedEventChange={actions.setSelectedEvent}
                  isLoadingEvents={state.isLoadingEvents}
                  eventTypes={state.eventTypes}
                  canSelectEvent={!!state.selectedService && !state.isLoadingEvents}
                />

                <EventPayloadInput
                  selectedEvent={state.selectedEvent}
                  selectedService={state.selectedService}
                  jsonBody={state.jsonBody}
                  isValid={state.isValid}
                  error={state.error}
                  onJsonBodyChange={actions.setJsonBody}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Generated Event</CardTitle>
            <CardDescription>Your generated AWS SAM event payload will appear here</CardDescription>
          </CardHeader>
          <CardContent>
            {state.generatedEvent ? (
              <div className="space-y-4">
                <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm h-[400px] overflow-y-auto">
                  <code>{JSON.stringify(state.generatedEvent.mergedEvent, null, 2)}</code>
                </pre>
                <div className="flex gap-2">
                  <Button onClick={actions.copyToClipboard} variant="outline">
                    Copy to Clipboard
                  </Button>
                  <Button onClick={actions.downloadEvent} variant="outline">
                    Download JSON
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-muted p-4 rounded-md">
                <p className="text-muted-foreground text-center">
                  Select a service and event type, then click "Generate Event" to see the output
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-6">
        <div className="flex justify-center col-span-2">
          <Button size="lg" disabled={!state.selectedService || !state.selectedEvent} onClick={actions.generateEvent}>
            Generate Event
          </Button>
        </div>
      </div>
    </>
  );
};
