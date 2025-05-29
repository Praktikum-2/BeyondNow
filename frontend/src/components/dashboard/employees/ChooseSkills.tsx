import React from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/Button";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

interface SkillOption {
  label: string;
  value: string;
}

interface ChooseSkillsProps {
  options: SkillOption[];
  selectedSkills: string[];
  onChange: (newSelected: string[]) => void;
  placeholder?: string;
  popoverRef?: React.RefObject<HTMLDivElement | null>;
}

export const ChooseSkills: React.FC<ChooseSkillsProps> = ({
  options,
  selectedSkills,
  onChange,
  placeholder = "Dodaj veščine...",
  popoverRef,
}) => {
  const [open, setOpen] = React.useState(false);

  const toggleSkill = (value: string) => {
    if (selectedSkills.includes(value)) {
      onChange(selectedSkills.filter((skill) => skill !== value));
    } else {
      onChange([...selectedSkills, value]);
    }
  };

  const removeSkill = (value: string) => {
    onChange(selectedSkills.filter((skill) => skill !== value));
  };

  return (
    <div className='space-y-2'>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            role='combobox'
            aria-expanded={open}
            className='w-full justify-between font-medium text-gray-700'>
            {placeholder}
            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
          </Button>
        </PopoverTrigger>

        <PopoverContent ref={popoverRef} className='w-full p-0' align='start'>
          <Command className='w-full'>
            <div className='sticky top-0 z-10 bg-white'>
              <CommandInput placeholder='Išči veščino...' className='h-9' />
            </div>
            <div className='max-h-52 overflow-y-auto'>
              <CommandEmpty>Ni rezultatov.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => {
                      toggleSkill(option.value);
                      // Ne zapiramo Popoverja
                    }}
                    onMouseDown={(e) => e.preventDefault()} // 🔒 prepreči zaprtje zunanjega Popoverja
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedSkills.includes(option.value)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </div>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedSkills.length > 0 && (
        <div className='flex flex-wrap gap-2'>
          {selectedSkills.map((skill) => {
            const label =
              options.find((opt) => opt.value === skill)?.label || skill;
            return (
              <div
                key={skill}
                className='flex items-center bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full'>
                {label}
                <button
                  type='button'
                  onClick={() => removeSkill(skill)}
                  className='ml-1 text-blue-500 hover:text-blue-700'>
                  <X size={14} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
