'use client';

import { useCallback, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AWS_SERVICES, type Service } from '@/constants/aws-services';

type ServiceSelectorProps = {
  selectedService: Service | null;
  onServiceSelect: (service: Service | null) => void;
};

const CATEGORY_COLORS = {
  compute: 'bg-blue-100 text-blue-800',
  storage: 'bg-green-100 text-green-800',
  database: 'bg-purple-100 text-purple-800',
  messaging: 'bg-orange-100 text-orange-800',
  analytics: 'bg-red-100 text-red-800',
  ai: 'bg-pink-100 text-pink-800',
  security: 'bg-yellow-100 text-yellow-800',
  iac: 'bg-indigo-100 text-indigo-800',
  cicd: 'bg-teal-100 text-teal-800',
  authentication: 'bg-amber-100 text-amber-800',
  configuration: 'bg-slate-100 text-slate-800',
  other: 'bg-gray-100 text-gray-800',
} as const;

const CATEGORY_LABELS = {
  compute: 'Compute',
  storage: 'Storage',
  database: 'Database',
  messaging: 'Messaging',
  analytics: 'Analytics',
  ai: 'AI/ML',
  security: 'Security',
  iac: 'IaC',
  cicd: 'CI/CD',
  authentication: 'Auth',
  configuration: 'Config',
  other: 'Other',
} as const;

export const ServiceSelector = ({ selectedService, onServiceSelect }: ServiceSelectorProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredServices = useMemo(() => {
    return AWS_SERVICES.filter((service) => {
      const matchesSearch =
        searchQuery === '' ||
        service.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.name.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    });
  }, [searchQuery]);

  const handleServiceSelect = useCallback(
    (serviceName: string) => {
      const service = AWS_SERVICES.find((s) => s.name === serviceName) || null;
      onServiceSelect(service);
    },
    [onServiceSelect],
  );

  return (
    <div>
      <Label htmlFor="service-selector" className="leading-none font-semibold mb-1 block">
        Select AWS Service
      </Label>
      <p className="text-sm text-muted-foreground mb-2">Choose the AWS service you want to generate events for</p>
      <Select
        value={selectedService?.name || ''}
        onValueChange={handleServiceSelect}
        onOpenChange={(open) => {
          if (!open) {
            setSearchQuery('');
          }
        }}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Search and select a service..." />
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          <div className="sticky top-0 bg-background border-b p-2">
            <input
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              onKeyDown={(e) => e.stopPropagation()}
            />
          </div>

          <div className="max-h-[250px] overflow-y-auto">
            {filteredServices.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                {searchQuery ? 'No services found' : 'No services in this category'}
              </div>
            ) : (
              filteredServices.map((service) => (
                <SelectItem key={service.name} value={service.name} className="py-3">
                  <div className="flex items-center justify-between w-full space-x-2">
                    <div className="font-medium">{service.displayName}</div>
                    <Badge variant="secondary" className={CATEGORY_COLORS[service.category]}>
                      {CATEGORY_LABELS[service.category]}
                    </Badge>
                  </div>
                </SelectItem>
              ))
            )}
          </div>
        </SelectContent>
      </Select>

      {searchQuery ? (
        <div className="text-sm text-muted-foreground">
          Showing {filteredServices.length} of {AWS_SERVICES.length} services
        </div>
      ) : null}
    </div>
  );
};
