import { Edit } from "@mui/icons-material";
import type { Homework } from "../type";
import DataTable, { type TableColumn, type TableAction } from "../components/DataTable";

interface Props {
  homeworks: Homework[];
  showDescriptionTooltip?: boolean;
  onEdit?: (hw: Homework) => void;
  showEditColumn?: boolean;
}

export default function HomeworkTable({ homeworks, showDescriptionTooltip = false, onEdit, showEditColumn = true }: Props) {
  const columns: TableColumn<Homework>[] = [
    {
      key: 'subject',
      label: 'Subject',
    },
    {
      key: 'description',
      label: 'Description',
    },
    {
      key: 'teacher',
      label: 'Teacher',
      render: (value) => value || "-",
    },
    {
      key: 'date',
      label: 'Due Date',
    },
  ];

  const actions: TableAction<Homework>[] = [];

  if (showEditColumn && onEdit) {
    actions.push({
      label: 'Edit',
      icon: <Edit fontSize="small" />,
      onClick: (row) => onEdit(row),
    });
  }

  return (
    <DataTable
      data={homeworks}
      columns={columns}
      actions={actions}
      emptyMessage="No homework"
    />
  );
}

export {};
