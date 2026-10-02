import type { AnPham } from '@/services/SachTaiLieu/AnPham/typing';
import { Button, Modal, Tooltip } from 'antd';
import DanhSachDKCB from '../DanhSachDKCB';

export const DkcbSummary = ({ record, onClick }: { record: AnPham.IRecord; onClick: () => void }) => {
	const numbers = (record.danhSachAnPhamVatLy ?? []).map((copy) => copy.soDangKyCaBiet).filter(Boolean);
	return (
		<Tooltip title='Xem danh sách đăng ký cá biệt'>
			<Button type='link' onClick={onClick} style={{ padding: 0, maxWidth: '100%', whiteSpace: 'nowrap' }}>
				{numbers.length ? `${numbers[0]}${numbers.length > 1 ? ` · +${numbers.length - 1} bản` : ''}` : 'Chưa có ĐKCB'}
			</Button>
		</Tooltip>
	);
};

export const DkcbDetailsModal = ({
	record,
	onClose,
	onChanged,
}: {
	record?: AnPham.IRecord;
	onClose: () => void;
	onChanged: () => unknown;
}) => (
	<Modal
		title={`Đăng ký cá biệt — ${record?.nhanDe ?? ''}`}
		open={!!record}
		onCancel={onClose}
		footer={null}
		width={1100}
		destroyOnClose
	>
		{record && <DanhSachDKCB key={record._id} onChanged={onChanged} />}
	</Modal>
);
