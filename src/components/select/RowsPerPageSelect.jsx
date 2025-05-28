import { createListCollection } from "@chakra-ui/react";
import { SelectContent, SelectRoot, SelectTrigger, SelectValueText, SelectItem } from "../ui"

export const RowsPerPageSelect = ({ options, onChange }) => {
  const frameworks = createListCollection({ items: options });

  return (
    <SelectRoot
      collection={frameworks}
      defaultValue={options[0].value}
      onValueChange={(option) => onChange(option.value[0])}
    >
      <SelectTrigger>
        <SelectValueText />
      </SelectTrigger>
      <SelectContent>
        {frameworks.items.map((framework, index) => (
          <SelectItem key={index} item={framework}>
            {framework.label}
          </SelectItem>
        ))}
      </SelectContent>
    </SelectRoot>
  )
}