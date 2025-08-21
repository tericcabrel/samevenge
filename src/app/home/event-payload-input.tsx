import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Service } from '@/constants/aws-services';

type Props = {
  selectedEvent: string | null;
  selectedService: Service | null;
  jsonBody: string;
  isValid: boolean;
  error: string | null;
  onJsonBodyChange: (jsonBody: string) => void;
};

export const EventPayloadInput = ({
  selectedEvent,
  selectedService,
  jsonBody,
  isValid,
  error,
  onJsonBodyChange,
}: Props) => {
  return (
    <div>
      <Label htmlFor="event-payload-input" className="leading-none font-semibold mb-1 block">
        JSON payload
      </Label>
      <p className="text-sm text-muted-foreground mb-2">
        The event body will be merged with the event template
        {selectedEvent && selectedService?.eventsBodyPath[selectedEvent] && (
          <span>
            in the path:{' '}
            <span className="font-bold bg-gray-900 text-white px-1 py-0.5 rounded-sm">
              {selectedService?.eventsBodyPath[selectedEvent]?.path}
            </span>
          </span>
        )}
      </p>
      <Textarea
        placeholder='{"key": "value"}'
        className="min-h-[200px] font-mono"
        value={jsonBody}
        onChange={(e) => onJsonBodyChange(e.target.value)}
      />
      {!isValid && error && <p className="text-sm text-destructive mt-2">{error}</p>}
    </div>
  );
};
