'use client';

import { useCallback, useState } from 'react';
import type { Service } from '@/constants/aws-services';
import { copyToClipboardWithFeedback } from '@/utils/clipboard';
import { downloadJsonFile } from '@/utils/file-download';
import { validateJson } from '@/utils/json-validation';
import { updateObjectByPath } from '@/utils/update-object-by-path';

export type EventType = {
  eventName: string;
  template: any;
};

export type EventGeneratorState = {
  selectedService: Service | null;
  selectedEvent: string | null;
  eventTypes: EventType[];
  isLoadingEvents: boolean;
  jsonBody: string;
  generatedEvent: any | null;
  isValid: boolean;
  error: string | null;
};

export const useEventGenerator = () => {
  const [state, setState] = useState<EventGeneratorState>({
    selectedService: null,
    selectedEvent: null,
    eventTypes: [],
    isLoadingEvents: false,
    jsonBody: '',
    generatedEvent: null,
    isValid: true,
    error: null,
  });

  const loadEventTypes = useCallback(async (serviceName: string) => {
    try {
      setState((prev) => ({ ...prev, isLoadingEvents: true, error: null }));

      const response = await fetch(`/data/templates/${serviceName}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load event types for ${serviceName}`);
      }

      const data = await response.json();
      const eventTypes: EventType[] = data.templates || [];

      setState((prev) => ({
        ...prev,
        eventTypes,
        isLoadingEvents: false,
        selectedEvent: null, // Reset selected event when loading new event types
        generatedEvent: null,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        eventTypes: [],
        isLoadingEvents: false,
        error: error instanceof Error ? error.message : 'Failed to load event types',
      }));
    }
  }, []);

  const setSelectedService = useCallback(
    (service: Service | null) => {
      setState((prev) => ({
        ...prev,
        selectedService: service,
        selectedEvent: null, // Reset event when service changes
        eventTypes: [], // Clear event types when service changes
        isLoadingEvents: false,
        generatedEvent: null,
        error: null,
      }));

      // Load event types if a service is selected
      if (service) {
        loadEventTypes(service.name).catch((error) => {
          console.error('Failed to load event types:', error);
        });
      }
    },
    [loadEventTypes],
  );

  const setSelectedEvent = useCallback((event: string | null) => {
    setState((prev) => ({
      ...prev,
      selectedEvent: event,
      generatedEvent: null,
      error: null,
    }));
  }, []);

  const setJsonBody = useCallback((jsonBody: string) => {
    const validation = validateJson(jsonBody);

    setState((prev) => ({
      ...prev,
      jsonBody,
      isValid: validation.isValid,
      error: validation.error || null,
      generatedEvent: null,
    }));
  }, []);

  const generateEvent = useCallback(() => {
    if (!state.selectedService || !state.selectedEvent || !state.isValid) {
      return;
    }

    try {
      // Find the selected event type template
      const selectedEventType = state.eventTypes.find((eventType) => eventType.eventName === state.selectedEvent);

      if (!selectedEventType) {
        setState((prev) => ({
          ...prev,
          error: 'Selected event type not found',
          generatedEvent: null,
        }));
        return;
      }

      const eventConfig = state.selectedService.eventsBodyPath[state.selectedEvent];

      let eventGenerator = selectedEventType.template;
      if (eventConfig) {
        if (eventConfig.type === 'json') {
          const userJsonData = state.jsonBody ? JSON.parse(state.jsonBody) : {};

          eventGenerator = updateObjectByPath(eventGenerator, eventConfig.path, userJsonData);
        } else {
          const userJsonData = JSON.stringify(JSON.parse(state.jsonBody));
          eventGenerator = updateObjectByPath(eventGenerator, eventConfig.path, userJsonData);
        }
      }

      // Create the final event structure
      const event = {
        service: state.selectedService.name,
        eventType: state.selectedEvent,
        template: selectedEventType.template,
        mergedEvent: eventGenerator,
        timestamp: new Date().toISOString(),
        metadata: {
          serviceDisplayName: state.selectedService.displayName,
          serviceCategory: state.selectedService.category,
          generatedAt: new Date().toISOString(),
          samVersion: '1.142.1', // This could be dynamic in the future
        },
      };

      setState((prev) => ({
        ...prev,
        generatedEvent: event,
        error: null,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to generate event',
        generatedEvent: null,
      }));
    }
  }, [state.selectedService, state.selectedEvent, state.eventTypes, state.jsonBody, state.isValid]);

  const copyToClipboard = useCallback(() => {
    if (!state.generatedEvent) {
      return false;
    }

    // Copy the merged event (the actual event payload)
    const eventString = JSON.stringify(state.generatedEvent.mergedEvent, null, 2);
    return copyToClipboardWithFeedback(eventString);
  }, [state.generatedEvent]);

  const downloadEvent = useCallback(() => {
    if (!state.generatedEvent) {
      return;
    }

    const filename = `${state.selectedService?.name}-${state.selectedEvent}-event`;
    // Download the merged event (the actual event payload)
    downloadJsonFile(state.generatedEvent.mergedEvent, filename);
  }, [state.generatedEvent, state.selectedService, state.selectedEvent]);

  const reset = useCallback(() => {
    setState({
      selectedService: null,
      selectedEvent: null,
      eventTypes: [],
      isLoadingEvents: false,
      jsonBody: '',
      generatedEvent: null,
      isValid: true,
      error: null,
    });
  }, []);

  return {
    state,
    actions: {
      setSelectedService,
      setSelectedEvent,
      setJsonBody,
      generateEvent,
      copyToClipboard,
      downloadEvent,
      reset,
    },
  };
};
