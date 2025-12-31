import { useCallback, useRef } from "react";
import { useGridFilter, type CustomFilterProps } from "ag-grid-react";
import type { IRowNode } from "ag-grid-community";

type Model = string | null;

export type SelectFilterParams = {
  values: string[];
};

type Props = CustomFilterProps<Model> & SelectFilterParams;

export default function SelectFilter(props: Props) {
  const { model, onModelChange, getValue, values } = props;
  const hidePopupRef = useRef<(() => void) | undefined>(undefined);

  const doesFilterPass = useCallback(
    ({ node }: { node: IRowNode }) => {
      if (model == null) return true; // no filter
      return getValue(node) === model; // exact match
    },
    [model, getValue],
  );

  useGridFilter({
    doesFilterPass,
    afterGuiAttached: (params) => {
      hidePopupRef.current = params?.hidePopup;
    },
  });

  return (
    <select
      className="p-2"
      style={{ width: "100%" }}
      value={model ?? ""}
      onChange={(e) => {
        onModelChange(e.target.value === "" ? null : e.target.value);
        hidePopupRef.current?.();
      }}
    >
      <option value="">All</option>
      {values.map((v) => (
        <option key={v} value={v}>
          {v}
        </option>
      ))}
    </select>
  );
}
