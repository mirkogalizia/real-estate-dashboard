import * as React from "react";
import { ChevronsUpDown, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "./popover";
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "./command";
import { Button } from "./button";

interface Option {
  value: string;
  label: string;
}

interface ComboboxProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder = "Seleziona...",
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
  const selected = options.find((o) => o.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", isMobile && "text-lg py-4")}
        >
          {selected ? selected.label : placeholder}
          <ChevronsUpDown className="ml-2 h-5 w-5 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          isMobile
            ? "fixed left-0 top-0 right-0 bottom-0 z-[200] rounded-none w-full max-w-full h-[75vh] flex flex-col p-0"
            : "w-[300px] p-0"
        )}
        side={isMobile ? undefined : "bottom"}
        align="center"
        onOpenAutoFocus={e => {
          // Autofocus input
          setTimeout(() => {
            const inp = document.querySelector<HTMLInputElement>("[cmdk-input]");
            inp?.focus();
          }, 50);
        }}
      >
        {isMobile && (
          <div className="flex justify-between items-center px-4 py-2 border-b">
            <span className="font-semibold text-lg">Scegli</span>
            <button
              onClick={() => setOpen(false)}
              className="rounded-full p-2 bg-gray-100 hover:bg-gray-200 text-xl"
              aria-label="Chiudi"
              type="button"
            >
              <X />
            </button>
          </div>
        )}
        <Command>
          <CommandInput
            placeholder={placeholder}
            className={cn("px-4 py-3 text-lg", isMobile && "text-xl")}
          />
          <CommandEmpty>Nessun risultato.</CommandEmpty>
          <CommandGroup>
            {options.map((option) => (
              <CommandItem
                key={option.value}
                value={option.value}
                onSelect={(currentValue) => {
                  onChange(currentValue === value ? "" : currentValue);
                  setOpen(false);
                }}
                className={cn(
                  "cursor-pointer px-4 py-4 text-lg",
                  isMobile && "text-xl",
                  value === option.value && "bg-blue-50 font-bold border-l-4 border-blue-500"
                )}
              >
                <Check
                  className={cn(
                    "mr-2 h-5 w-5",
                    value === option.value ? "opacity-100 text-blue-500" : "opacity-0"
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
}

