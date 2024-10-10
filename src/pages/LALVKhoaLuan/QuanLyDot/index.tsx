import ExpandText from '@/components/ExpandText';
import MyDateRangePicker from '@/components/MyDatePicker/RangePicker';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { EOperatorType } from '@/components/Table/constant';
import type { IColumn } from '@/components/Table/typing';
import { ELoaiDotQuanLyThuvien } from '@/services/QuanLyThuVien/constants';
import type { QuanLyThuVien } from '@/services/QuanLyThuVien/typing';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Card, Popconfirm, Space } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { history, useModel } from 'umi';
import ModalFormQuanLyDot from './components/ModalForm';

const QuanLyDotPage = () => {
	const { getModel, page, limit, handleEdit, deleteModel } = useModel('quanlythuvien.quanlydot');
	const { setLoai } = useModel('quanlythuvien.danhsachdot');
	const [datePicker, setDatePicker] = useState<any>();

	const getData = () => {
		const filter = [
			{
				active: true,
				field: 'thoiGianBatDau',
				values: [moment(datePicker?.[0]).startOf('date'), moment(datePicker?.[1]).endOf('date')],
				operator: EOperatorType.BETWEEN,
			},
		];

		getModel(undefined, datePicker ? filter : (undefined as any));
	};

	const onCell = (rec: QuanLyThuVien.IQuanLyDot) => ({
		onClick: () => handleEdit(rec),
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<QuanLyThuVien.IQuanLyDot>[] = [
		{
			title: 'Tên đợt',
			dataIndex: 'tenDot',
			width: 150,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Thời gian',
			dataIndex: 'thoiGianBatDau',
			align: 'center',
			width: 200,
			render: (val, rec) =>
				val && (
					<>
						{moment(val).format('HH:mm DD/MM/YYYY')} - {moment(rec?.thoiGianKetThuc).format('HH:mm DD/MM/YYYY')}
					</>
				),
			filterType: 'date',
			sortable: true,
			onCell,
		},
		{
			title: 'Loại',
			dataIndex: 'loai',
			align: 'center',
			width: 150,
			filterType: 'select',
			filterData: Object.values(ELoaiDotQuanLyThuvien),
			onCell,
		},
		{
			title: 'Ghi chú',
			dataIndex: 'ghiChu',
			width: 150,
			onCell,
			render: (val) => <ExpandText>{val}</ExpandText>,
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 90,
			fixed: 'right',
			render: (val, rec) => (
				<>
					<ButtonExtend
						tooltip='Chi tiết'
						onClick={() => {
							setLoai(rec?.loai);
							history.push('/la-lv-kl-sinh-vien/danh-sach-sinh-vien');
						}}
						type='link'
						icon={<EyeOutlined />}
					/>
					<ButtonExtend tooltip='Chỉnh sửa' onClick={() => handleEdit(rec)} type='link' icon={<EditOutlined />} />
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
		<Card title='Quản lý đợt luận án, luận văn, khóa luận'>
			<Space style={{ marginBottom: 12 }}>
				<MyDateRangePicker
					value={datePicker}
					onChange={(val) => setDatePicker(val)}
					allowClear
					style={{ width: 300 }}
				/>
			</Space>

			<TableBase
				getData={getData}
				columns={columns}
				dependencies={[page, limit, datePicker]}
				modelName='quanlythuvien.quanlydot'
				hideCard
				formProps={{ getData }}
				Form={ModalFormQuanLyDot}
				title='Quản lý đợt'
				widthDrawer={1000}
			/>
		</Card>
	);
};

export default QuanLyDotPage;
