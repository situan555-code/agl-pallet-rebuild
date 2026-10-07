import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "agl-pallet";

// Options come from content/forms.json (carrier + supplier forms).
export const EquipmentTypeOpen = () => (
  <div className="min-h-[600px] bg-moss p-8 text-bone">
    <label className="block max-w-sm">
      <span className="mb-2 block text-sm font-semibold">Equipment type</span>
      <Select defaultOpen defaultValue="Dry van" name="equipmentType">
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Choose equipment" />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectGroup>
            <SelectLabel>Equipment you run</SelectLabel>
            <SelectItem value="Dry van">Dry van</SelectItem>
            <SelectItem value="Flatbed">Flatbed</SelectItem>
            <SelectItem value="Both">Both</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </label>
  </div>
);

export const HeatTreatPlaceholder = () => (
  <div className="bg-moss p-8 text-bone">
    <label className="block max-w-sm">
      <span className="mb-2 block text-sm font-semibold">
        Heat treat on site <span className="font-normal text-current/70">(optional)</span>
      </span>
      <Select name="heatTreat">
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Yes, no, or not sure" />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectItem value="Yes">Yes</SelectItem>
          <SelectItem value="No">No</SelectItem>
          <SelectItem value="Not sure">Not sure</SelectItem>
        </SelectContent>
      </Select>
    </label>
  </div>
);
