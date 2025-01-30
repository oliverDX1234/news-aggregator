import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-day-picker";

import { DateRangePickerProps } from "@/types/types";

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  selectedRange,
  onChange,
  placeholderText = "Select a date range",
}) => {
  const [open, setOpen] = useState(false);

  const handleDateSelect = (range: DateRange | undefined) => {
    if (range) {
      onChange(range);
    }
  };

  const formattedRange =
    selectedRange?.from && selectedRange?.to
      ? `${format(selectedRange.from, "dd/MM/yyyy")} - ${format(
          selectedRange.to,
          "dd/MM/yyyy"
        )}`
      : placeholderText;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`w-full justify-start text-left border-neutral font-normal hover:bg-transparent ${
            formattedRange !== placeholderText ? "text-black" : "text-gray-500"
          }`}
        >
          {formattedRange}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-auto">
        <Calendar
          mode="range"
          selected={selectedRange}
          onSelect={handleDateSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

export default DateRangePicker;
