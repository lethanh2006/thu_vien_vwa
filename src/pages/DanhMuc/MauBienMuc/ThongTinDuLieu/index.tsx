import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import _ from 'lodash';
import { useIntl, useModel } from 'umi';
import FormMauBienMuc from './Form';

const ThongTinDuLieuBienMucPage = () => {
	const { record: recMauBienMuc } = useModel('danhmuc.maubienmuc');
	const { page, limit, deleteModel, getModel, handleEdit } = useModel('danhmuc.thongtindulieu');
	const intl = useIntl();

	const getData = () => {
		if (recMauBienMuc?._id) getModel({ mauBienMucId: recMauBienMuc?._id });
	};

	const columns: IColumn<MauBienMuc.IThongTinKhaiBao>[] = [
		{
			title: intl.formatMessage({ id: 'danhmuc.maubienmuc.thongtindulieu.table.column.ma' }),
			dataIndex: 'tag',
			align: 'center',
			width: 100,
			render: (val, rec) => rec?.thongTinTag?.ma,
			filterType: 'number',
			sortable: true,
		},
		{
			title: intl.formatMessage({ id: 'danhmuc.maubienmuc.thongtindulieu.table.column.noidung' }),
			width: 180,
			render: (val, rec) => <ExpandText>{rec?.thongTinTag?.noiDung}</ExpandText>,
		},
		{
			title: intl.formatMessage({ id: 'danhmuc.maubienmuc.thongtindulieu.table.column.dstruongcon' }),
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
			title: intl.formatMessage({ id: 'danhmuc.maubienmuc.thongtindulieu.table.column.thaoTac' }),
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (val, rec) => (
				<>
					<ButtonExtend
						tooltip={intl.formatMessage({ id: 'danhmuc.maubienmuc.thongtindulieu.table.tooltip.chinhsua' })}
						onClick={() => handleEdit(rec)}
						type='link'
						icon={<EditOutlined />}
					/>
					<Popconfirm
						onConfirm={() => deleteModel(rec?._id, getData)}
						title={intl.formatMessage({ id: 'danhmuc.maubienmuc.thongtindulieu.table.popconfirm.xoa' })}
						placement='topRight'
					>
						<ButtonExtend
							tooltip={intl.formatMessage({ id: 'danhmuc.maubienmuc.thongtindulieu.table.tooltip.xoa' })}
							danger
							type='link'
							icon={<DeleteOutlined />}
						/>
					</Popconfirm>
				</>
			),
		},
	];

	return (
		<TableBase
			title={intl.formatMessage({ id: 'danhmuc.maubienmuc.thongtindulieu.table.title' })}
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
