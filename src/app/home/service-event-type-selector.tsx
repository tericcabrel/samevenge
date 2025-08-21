import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { EventType } from '@/hooks/use-event-generator';

type Props = {
  selectedEvent: string | null;
  onSelectedEventChange: (event: string | null) => void;
  isLoadingEvents: boolean;
  eventTypes: EventType[];
  canSelectEvent: boolean;
};

export const ServiceEventTypeSelector = ({
  selectedEvent,
  onSelectedEventChange,
  isLoadingEvents,
  eventTypes,
  canSelectEvent,
}: Props) => {
  return (
    <div>
      <Label htmlFor="service-event-type" className="leading-none font-semibold mb-1 block">
        Select Event Type
      </Label>
      <p className="text-sm text-muted-foreground mb-2">Choose the specific event type to generate</p>
      <Select disabled={!canSelectEvent} value={selectedEvent || ''} onValueChange={onSelectedEventChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select an event type..." />
        </SelectTrigger>
        <SelectContent>
          {(() => {
            if (isLoadingEvents) {
              return (
                <SelectItem value="loading" disabled>
                  Loading events...
                </SelectItem>
              );
            }

            if (!canSelectEvent) {
              return (
                <SelectItem value="no-service" disabled>
                  Select a service first
                </SelectItem>
              );
            }

            if (eventTypes.length === 0) {
              return (
                <SelectItem value="no-events" disabled>
                  No events available for this service
                </SelectItem>
              );
            }

            return eventTypes.map((eventType) => (
              <SelectItem key={eventType.eventName} value={eventType.eventName}>
                {eventType.eventName}
              </SelectItem>
            ));
          })()}
        </SelectContent>
      </Select>
    </div>
  );
};
