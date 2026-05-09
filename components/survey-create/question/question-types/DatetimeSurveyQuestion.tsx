"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DatetimeQuestionConfig,
  DateTimeMode,
} from "@/types/question-type";
import { Calendar as CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { Calendar } from "@/components/ui/calendar";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useSurveyStore } from "@/stores/survey-create/survey_store";

interface DatetimeSurveyQuestionProps {
  questionID: string;
  sectionID: string;
}

export default function DatetimeSurveyQuestion({
  sectionID,
  questionID,
}: DatetimeSurveyQuestionProps) {
  const [mode, setMode] = useState<DateTimeMode>("date");

  const updateQuestionConfig = useSurveyStore((s) => s.updateQuestionConfig);

  useEffect(() => {
    const config: DatetimeQuestionConfig = {
      mode,
    };
    console.log(config);
    updateQuestionConfig(sectionID, questionID, config);
  }, [mode, sectionID, questionID, updateQuestionConfig]);

  function getPicker() {
    if (mode === "date") {
      return <DatePickerInput date={new Date()} setDate={() => {}} />;
    }

    if (mode === "datetime") {
      return <DatePickerTime date={new Date()} setDate={() => {}} />;
    }

    return <TimePicker date={new Date()} setDate={() => {}} />;
  }

  return (
    <FieldGroup>
      <Field orientation="horizontal" className="w-44">
        <FieldLabel>Type:</FieldLabel>
        <Select value={mode} onValueChange={(e) => setMode(e as DateTimeMode)}>
          <SelectTrigger className="w-full max-w-48">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="datetime">Datetime</SelectItem>
              <SelectItem value="time">Time</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>

      {getPicker()}
    </FieldGroup>
  );
}

function formatDate(date: Date | undefined) {
  if (!date) return "";

  return date.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function isValidDate(date: Date | undefined) {
  if (!date) return false;
  return !isNaN(date.getTime());
}

interface DatePickerInputProps {
  date: Date | undefined;
  setDate: (date: Date) => void;
}

export function DatePickerInput({ date, setDate }: DatePickerInputProps) {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState<Date | undefined>(date);
  const [value, setValue] = useState(formatDate(date));

  useEffect(() => {
    setValue(formatDate(date));
    setMonth(date);
  }, [date]);

  return (
    <Field className="w-48">
      <FieldLabel htmlFor="date-required">Date</FieldLabel>
      <InputGroup>
        <InputGroupInput
          id="date-required"
          value={value}
          placeholder="06/01/2025"
          onChange={(e) => {
            const nextValue = e.target.value;
            setValue(nextValue);

            const parsed = new Date(nextValue);
            if (isValidDate(parsed)) {
              setDate(parsed);
              setMonth(parsed);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
            }
          }}
        />

        <InputGroupAddon align="inline-end">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <InputGroupButton
                id="date-picker"
                variant="ghost"
                size="icon-xs"
                aria-label="Select date"
              >
                <CalendarIcon />
                <span className="sr-only">Select date</span>
              </InputGroupButton>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="end"
              alignOffset={-8}
              sideOffset={10}
            >
              <Calendar
                mode="single"
                selected={date}
                month={month}
                onMonthChange={setMonth}
                onSelect={(selectedDate) => {
                  if (!selectedDate) return;
                  setDate(selectedDate);
                  setValue(formatDate(selectedDate));
                  setOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </InputGroupAddon>
      </InputGroup>
    </Field>
  );
}

interface DatePickerTimeProps {
  date: Date;
  setDate: (date: Date) => void;
}

export function DatePickerTime({ date, setDate }: DatePickerTimeProps) {
  return (
    <FieldGroup>
      <DatePickerInput date={date} setDate={setDate} />
      <TimePicker date={date} setDate={setDate} />
    </FieldGroup>
  );
}

interface TimePickerProps {
  date: Date;
  setDate: (date: Date) => void;
}

export function TimePicker({ date, setDate }: TimePickerProps) {
  function handleTimeChange(value: string) {
    if (!value) return;

    const [hours, minutes] = value.split(":").map(Number);
    if (Number.isNaN(hours) || Number.isNaN(minutes)) return;

    const nextDate = new Date(date);
    nextDate.setHours(hours, minutes, 0, 0);
    setDate(nextDate);
  }

  const timeValue = `${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes(),
  ).padStart(2, "0")}`;

  return (
    <Field className="w-32">
      <FieldLabel htmlFor="time-picker-optional">Time</FieldLabel>
      <Input
        type="time"
        id="time-picker-optional"
        value={timeValue}
        className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        onChange={(e) => handleTimeChange(e.target.value)}
      />
    </Field>
  );
}
