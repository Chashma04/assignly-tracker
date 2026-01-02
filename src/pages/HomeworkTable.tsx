import { Edit } from "@mui/icons-material";
import type { Homework } from "../type";
import DataTable, { type TableAction } from "../components/DataTable";
import {
  getHomeworkColumns,
  TABLE_EMPTY_MESSAGES,
} from "../config/tableColumns";

interface Props {
  homeworks: Homework[];
  showDescriptionTooltip?: boolean;
  onEdit?: (hw: Homework) => void;
  showEditColumn?: boolean;
  showClassColumn?: boolean;
}

export default function HomeworkTable({
  homeworks,
  showDescriptionTooltip = false,
  onEdit,
  showEditColumn = true,
  showClassColumn = false,
}: Props) {
  const columns = getHomeworkColumns(showClassColumn);

  const actions: TableAction<Homework>[] = [];

  if (showEditColumn && onEdit) {
    actions.push({
      label: "Edit",
      icon: <Edit fontSize="small" />,
      onClick: (row) => onEdit(row),
    });
  }

  return (
    <DataTable
      data={homeworks}
      columns={columns}
      actions={actions}
      emptyMessage={TABLE_EMPTY_MESSAGES.NO_HOMEWORK}
      showSerialNumber={true}
    />
  );
}

export {};
