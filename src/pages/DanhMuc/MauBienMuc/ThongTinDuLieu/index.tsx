import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import { useModel } from 'umi';
import FormMauBienMuc from './Form';
import _ from 'lodash';

const ThongTinDuLieuBienMucPage = () => {
	const { record: recMauBienMuc } = useModel('danhmuc.maubienmuc');
	const { page, limit, deleteModel, getModel, handleEdit } = useModel('danhmuc.thongtindulieu');

	const getData = () => {
		if (recMauBienMuc?._id) getModel({ mauBienMucId: recMauBienMuc?._id });
	};

	const columns: IColumn<MauBienMuc.IThongTinKhaiBao>[] = [
		{
			title: 'Mã',
			dataIndex: 'tag',
			align: 'center',
			width: 100,
			render: (val, rec) => rec?.thongTinTag?.ma,
			filterType: 'number',
			sortable: true,
		},
		{
			title: 'Nội dung',
			width: 180,
			render: (val, rec) => <ExpandText>{rec?.thongTinTag?.noiDung}</ExpandText>,
		},
		{
			title: 'DS trường con',
			width: 220,
			render: (val, rec) => (
				<ExpandText>
					{_.orderBy(rec?.thuocTinhDuLieu, 'code')
						?.map((item) => `${item?.code}${item?.ten}`)
						.join(', ')}
				</ExpandText>
			),
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (val, rec) => (
				<>
					<ButtonExtend tooltip='Chỉnh sửa' onClick={() => handleEdit(rec)} type='link' icon={<EditOutlined />} />
					<Popconfirm
						onConfirm={() => deleteModel(rec?._id, getData)}
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
			title='Thông tin cấu hình mẫu biên mục'
			getData={getData}
			columns={columns}
			dependencies={[page, limit, recMauBienMuc?._id]}
			modelName='danhmuc.thongtindulieu'
			hideCard
			Form={FormMauBienMuc}
			formProps={{ getData }}
			widthDrawer={700}
		/>
	);
};

export default ThongTinDuLieuBienMucPage;
