import ButtonExtend from '@/components/Table/ButtonExtend';
import type { AnPham } from '@/services/SachTaiLieu/AnPham/typing';
import { DeleteOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Alert, Popconfirm, Space } from 'antd';
import type { DKCBActionError } from './useDKCBActions';

type ActionProps = {
	busy: boolean;
	remove: (idOrIds: string | string[]) => Promise<void>;
	liquidate: (record: AnPham.IAnPhamXepGia) => Promise<void>;
};

export const DKCBRowActions = ({ record, busy, remove, liquidate }: ActionProps & { record: AnPham.IAnPhamXepGia }) => (
	<Space size={0}>
		<Popconfirm
			title={`Xóa ĐKCB ${record.soDangKyCaBiet}?`}
			description='Chỉ xóa được bản chưa từng mượn. Số đã xóa không được tự động cấp lại.'
			onConfirm={() => remove(record._id)}
			okText='Xóa'
			cancelText='Hủy'
			okButtonProps={{ danger: true }}
			disabled={busy}
		>
			<ButtonExtend tooltip='Xóa ĐKCB' type='link' danger icon={<DeleteOutlined />} disabled={busy} />
		</Popconfirm>
		<Popconfirm
			title={`Thanh lý ĐKCB ${record.soDangKyCaBiet}?`}
			description='Bản sẽ ngừng lưu thông và vẫn giữ lịch sử mượn trả.'
			onConfirm={() => liquidate(record)}
			okText='Thanh lý'
			cancelText='Hủy'
			disabled={busy || record.thanhLy}
		>
			<ButtonExtend
				tooltip={record.thanhLy ? 'Đã thanh lý' : 'Thanh lý'}
				type='link'
				icon={<ShoppingCartOutlined />}
				disabled={busy || record.thanhLy}
			/>
		</Popconfirm>
	</Space>
);

export const DKCBDeleteSelected = ({
	selectedIds,
	busy,
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
		<ButtonExtend danger disabled={busy || !selectedIds?.length} loading={busy} icon={<DeleteOutlined />}>
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
