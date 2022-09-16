import { Select } from '@chakra-ui/react';
import { FlagItem } from 'hooks/use-list-flags';

export const VariationSelect = ({
  flag,
  variationId,
  setVariationId,
}: {
  flag: FlagItem;
  variationId: string | null;
  setVariationId: (variationId: string) => void;
}) => {
  return (
    <Select
      variant="outline"
      value={variationId ?? 'rollout'}
      onChange={(e) => setVariationId(e.target.value as any)}
    >
      {flag.variations.map((variation) => {
        const name = variation.name
          ? `${variation.name} (${variation.value.toString()})`
          : variation.value.toString();
        return (
          <option key={variation._id} value={variation._id}>
            {name}
          </option>
        );
      })}
      <option value={'rollout'} disabled>
        Percentage rollout (not yet supported)
      </option>
    </Select>
  );
};
