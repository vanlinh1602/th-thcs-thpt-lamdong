import { format } from 'date-fns';
import { ChevronDownIcon } from 'lucide-react';
import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { translations } from '@/locales/translations';

type Calendar24Props = {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
};

export function Calendar24({ date, setDate }: Calendar24Props) {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const [time, setTime] = React.useState(
    date ? format(date, 'HH:mm') : '00:00'
  );

  return (
    <div className="flex gap-4">
      <div className="flex items-center gap-2">
        <Label htmlFor="date-picker" className="px-1 text-sm">
          {t(translations.date)}
        </Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date-picker"
              className="w-32 justify-between font-normal"
            >
              {date ? date.toLocaleDateString() : 'Select date'}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              disabled={{
                before: new Date(),
              }}
              onSelect={(newDate) => {
                if (!newDate) return;
                const currentHours = date?.getHours() || 0;
                const curentMinutes = date?.getMinutes() || 0;
                newDate?.setHours(currentHours);
                newDate?.setMinutes(curentMinutes);
                newDate?.setSeconds(0);
                newDate?.setMilliseconds(0);
                setDate(newDate);
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex items-center gap-2">
        <Label htmlFor="time-picker" className="px-1 text-sm">
          {t(translations.time)}
        </Label>
        <Input
          type="time"
          value={time}
          id="time-picker"
          step="60"
          className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
          onChange={(e) => {
            if (e.target.value) {
              const currentDate = date ? new Date(date) : new Date();
              const [hours, minutes] = e.target.value.split(':').map(Number);
              currentDate.setHours(hours, minutes);
              setDate(currentDate);
              setTime(e.target.value);
            }
          }}
        />
      </div>
    </div>
  );
}
