import ButtonExtend from '@/components/Table/ButtonExtend';
import type { AnPham } from '@/services/SachTaiLieu/AnPham/typing';
import { DeleteOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Alert, Popconfirm, Space } from 'antd';
import type { DKCBActionError, DKCBPendingAction } from './useDKCBActions';

type ActionProps = {
	busy: boolean;
	activeAction?: DKCBPendingAction;
	activeActions?: DKCBPendingAction[];
	remove: (idOrIds: string | string[]) => Promise<void>;
	liquidate: (record: AnPham.IAnPhamXepGia) => Promise<void>;
};

export const DKCBRowActions = ({
	record,
	activeAction,
	activeActions,
	remove,
	liquidate,
}: ActionProps & { record: AnPham.IAnPhamXepGia }) => {
	const rowAction = (activeActions ?? (activeAction ? [activeAction] : [])).find((action) =>
		action.ids.includes(record._id),
	);
	const rowBusy = !!rowAction;
	return (
		<Space size={0}>
			<Popconfirm
				title={`Xóa ĐKCB ${record.soDangKyCaBiet}?`}
				description='Chỉ xóa được bản chưa từng mượn. Số đã xóa không được tự động cấp lại.'
				onConfirm={() => remove(record._id)}
				okText='Xóa'
				cancelText='Hủy'
				okButtonProps={{ danger: true }}
				disabled={rowBusy}
			>
				<ButtonExtend
					tooltip='Xóa ĐKCB'
					type='link'
					danger
					icon={<DeleteOutlined />}
					disabled={rowBusy}
					loading={rowAction?.type === 'delete'}
				/>
			</Popconfirm>
			<Popconfirm
				title={`Thanh lý ĐKCB ${record.soDangKyCaBiet}?`}
				description='Bản sẽ ngừng lưu thông và vẫn giữ lịch sử mượn trả.'
				onConfirm={() => liquidate(record)}
				okText='Thanh lý'
				cancelText='Hủy'
				disabled={rowBusy || record.thanhLy}
			>
				<ButtonExtend
					tooltip={record.thanhLy ? 'Đã thanh lý' : 'Thanh lý'}
					type='link'
					icon={<ShoppingCartOutlined />}
					disabled={rowBusy || record.thanhLy}
					loading={rowAction?.type === 'liquidate'}
				/>
			</Popconfirm>
		</Space>
	);
};

export const DKCBDeleteSelected = ({
	selectedIds,
	busy,
	activeAction,
	activeActions,
	remove,
}: Omit<ActionProps, 'liquidate'> & { selectedIds?: string[] }) => (
	<Popconfirm
		title={`Xóa ${selectedIds?.length ?? 0} ĐKCB đã chọn?`}
		description='Nếu có bản từng mượn, toàn bộ danh sách đã chọn sẽ giữ nguyên.'
		onConfirm={() => remove(selectedIds ?? [])}
		okText='Xóa'
		cancelText='Hủy'
		okButtonProps={{ danger: true }}
		disabled={busy || !selectedIds?.length}
	>
		<ButtonExtend
			danger
			disabled={busy || !selectedIds?.length}
			loading={(activeActions ?? (activeAction ? [activeAction] : [])).some(
				(action) => action.type === 'delete' && action.batch,
			)}
			icon={<DeleteOutlined />}
		>
			Xóa ĐKCB đã chọn ({selectedIds?.length ?? 0})
		</ButtonExtend>
	</Popconfirm>
);

export const DKCBActionAlert = ({ error }: { error?: DKCBActionError }) =>
	error ? (
		<Alert
			type='error'
			showIcon
			message={error.message}
			description={
				error.hasBorrowingHistory
					? 'Các số đã chọn vẫn được giữ nguyên. Dùng nút Thanh lý của bản tương ứng để giữ lịch sử mượn trả.'
					: undefined
			}
			style={{ marginBottom: 12 }}
		/>
	) : null;
