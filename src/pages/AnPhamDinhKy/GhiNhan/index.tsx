import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import SelectKhoSach from '@/pages/DanhMuc/KhoSach/components/Select';
import { colorTrangThaiGhiNhanAnPhamDinhKy, ETrangThaiGhiNhanAnPhamDinhKy } from '@/services/AnPhamDinhKy/constant';
import type { AnPhamDinhKy } from '@/services/AnPhamDinhKy/typing';
import { tienVietNam } from '@/utils/utils';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Popconfirm, Tag } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';
import Form from './components/CardForm';

const GhiNhanAnPhamDinhKyPage = (props: { type: 'ghi_nhan' | 'lich_su'; getData?: () => void }) => {
	const { getData: getDataExternal } = props;
	const { type = 'ghi_nhan' } = props;
	const { record: recAnPhamDinhKy } = useModel('anphamdinhky.anphamdinhky');
	const { getModel, page, limit, handleEdit, deleteModel } = useModel('anphamdinhky.ghinhan');

	const getData = () => {
		getModel(
			type === 'lich_su' && recAnPhamDinhKy?._id
				? {
						anPhamDinhKyId: recAnPhamDinhKy?._id,
				  }
				: undefined,
		);
	};

	const columns: IColumn<AnPhamDinhKy.GhiNhanAnPhamDinhKy>[] = [
		{
			title: 'Mã ấn phẩm định kỳ',
			dataIndex: 'anPhamDinhKyId',
			width: 120,
			render: (val, rec) => rec?.anPhamDinhKy?.maAnPhamDinhKy,
			hide: type === 'lich_su',
		},
		{
			title: 'Tên ấn phẩm định kỳ',
			dataIndex: 'anPhamDinhKyId',
			width: 180,
			render: (val, rec) => rec?.anPhamDinhKy?.ten,
			hide: type === 'lich_su',
		},
		{
			title: 'Kho',
			dataIndex: 'khoSachId',
			width: 120,
			render: (val, rec) => rec?.khoSach?.ten,
			filterType: 'customselect',
			filterCustomSelect: <SelectKhoSach multiple />,
		},
		{
			title: 'Số ấn phẩm định kỳ',
			dataIndex: 'soAnPhamDinhKy',
			width: 130,
			filterType: 'string',
		},
		{
			title: 'Số lượng',
			dataIndex: 'soLuong',
			align: 'center',
			width: 80,
			filterType: 'number',
			sortable: true,
		},
		{
			title: 'Đơn giá',
			dataIndex: 'donGia',
			width: 130,
			render: (val, rec) => tienVietNam(val),
			filterType: 'number',
			sortable: true,
		},
		{
			title: 'Ngày nhận',
			dataIndex: 'ngayGhiNhan',
			width: 130,
			render: (val, rec) => val && moment(val).format('DD/MM/YYYY'),
			filterType: 'date',
			sortable: true,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThaiGhiNhan',
			align: 'center',
			width: 120,
			render: (val, rec) => (
				<Tag color={colorTrangThaiGhiNhanAnPhamDinhKy[val as ETrangThaiGhiNhanAnPhamDinhKy]}>{val}</Tag>
			),
			filterType: 'select',
			filterData: Object.values(ETrangThaiGhiNhanAnPhamDinhKy),
			fixed: 'right',
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (val, rec) => (
				<>
					<ButtonExtend tooltip='Xếp giá' onClick={() => handleEdit(rec)} type='link' icon={<EditOutlined />} />
					<Popconfirm
						onConfirm={() => deleteModel(rec._id)}
						title='Bạn có chắc chắn muốn xóa thông tin này?'
						placement='topRight'
					>
						<ButtonExtend tooltip='Xóa' danger type='link' icon={<DeleteOutlined />} />
					</Popconfirm>
				</>
			),
		},
	];

	return (
		<TableBase
			getData={getData}
			columns={columns}
			dependencies={[page, limit]}
			modelName='anphamdinhky.ghinhan'
			title='Danh sách ghi nhận ấn phẩm định kỳ'
			buttons={{ create: type === 'ghi_nhan' }}
			hideCard={type === 'lich_su'}
			Form={Form}
			formProps={{
				getData: () => {
					if (getDataExternal) getDataExternal();
					getData();
				},
			}}
			widthDrawer={800}
		/>
	);
};

export default GhiNhanAnPhamDinhKyPage;
