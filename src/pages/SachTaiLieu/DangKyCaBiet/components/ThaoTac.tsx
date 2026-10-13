import ButtonExtend from '@/components/Table/ButtonExtend';
import type { AnPham } from '@/services/SachTaiLieu/AnPham/typing';
import { DeleteOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import { useIntl, useModel } from 'umi';

/** Xóa, thanh lý một ĐKCB; thành công thì tải lại danh sách và thống kê */
const ThaoTacDKCB = (props: { record: AnPham.IAnPhamXepGia; getData: () => void; getThongKe: () => void }) => {
	const intl = useIntl();
	const { record, getData, getThongKe } = props;
	const { deleteModel, thanhLyDangKyCaBietModel } = useModel('sachtailieu.anpham.anphamxepgia');

	return (
		<>
			<Popconfirm
				onConfirm={() =>
					deleteModel(record._id, getData)
						.then(() => getThongKe())
						.catch((er) => console.log(er))
				}
				title={intl.formatMessage({ id: 'sachtailieu.dkcb.xacNhanXoa' }, { soDangKyCaBiet: record.soDangKyCaBiet })}
				description={intl.formatMessage({ id: 'sachtailieu.dkcb.moTaXoa' })}
				placement='topRight'
			>
				<ButtonExtend
					tooltip={intl.formatMessage({ id: 'global.button.xoa' })}
					danger
					type='link'
					icon={<DeleteOutlined />}
				/>
			</Popconfirm>
			<Popconfirm
				onConfirm={() =>
					thanhLyDangKyCaBietModel({ _id: record._id, thanhLy: true }, getData)
						.then(() => getThongKe())
						.catch((er) => console.log(er))
				}
				title={intl.formatMessage({ id: 'sachtailieu.dkcb.xacNhanThanhLy' }, { soDangKyCaBiet: record.soDangKyCaBiet })}
				description={intl.formatMessage({ id: 'sachtailieu.dkcb.moTaThanhLy' })}
				placement='topRight'
			>
				<ButtonExtend
					tooltip={intl.formatMessage({ id: 'sachtailieu.dkcb.thanhLy' })}
					disabled={record.thanhLy}
					type='link'
					icon={<ShoppingCartOutlined />}
				/>
			</Popconfirm>
		</>
	);
};

/** Xóa các ĐKCB đang chọn; xóa nhiều của base chỉ tải lại danh sách nên tải lại thống kê ở đây */
export const XoaNhieuDKCB = (props: { getData: () => void; getThongKe: () => void }) => {
	const intl = useIntl();
	const { selectedIds, setSelectedIds, deleteManyModel } = useModel('sachtailieu.anpham.anphamxepgia');

	if (!selectedIds?.length) return null;

	return (
		<Popconfirm
			onConfirm={() =>
				deleteManyModel(selectedIds, props.getData)
					.then(() => {
						setSelectedIds(undefined);
						props.getThongKe();
					})
					.catch((er) => console.log(er))
			}
			title={intl.formatMessage({ id: 'global.table.index.button.xoa.title' }, { count: selectedIds.length })}
			description={intl.formatMessage({ id: 'sachtailieu.dkcb.moTaXoaNhieu' })}
		>
			<ButtonExtend danger icon={<DeleteOutlined />}>
				{intl.formatMessage({ id: 'global.table.index.button.xoa' }, { count: selectedIds.length })}
			</ButtonExtend>
		</Popconfirm>
	);
};

export default ThaoTacDKCB;
