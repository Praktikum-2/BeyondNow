import React from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/Button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

interface ManagerOption {
  label: string;
  value: string;
}

interface ChooseManagerProps {
  options: ManagerOption[];
  placeholder?: string;
  value: string | null;
  onChange: (newValue: string) => void;
  popoverRef?: React.RefObject<HTMLDivElement | null>;
}

export const ChooseManager: React.FC<ChooseManagerProps> = ({
  options,
  placeholder = "Choose project manager...",
  value,
  onChange,
  popoverRef,
}) => {
  const [open, setOpen] = React.useState(false);

  const selected = options.find((opt) => opt.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='w-full justify-between font-medium text-gray-700'>
          {selected ? selected.label : placeholder}
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>

      <PopoverContent ref={popoverRef} className='w-full p-0' align='start'>
        <Command>
          <CommandInput placeholder='Search...' className='h-9' />
          <CommandEmpty>No results.</CommandEmpty>
          <CommandGroup>
            {options.map((option) => (
              <CommandItem
                key={option.value}
                value={option.value}
                onSelect={() => {
                  onChange(option.value);
                  setOpen(false);
                }}>
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === option.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
