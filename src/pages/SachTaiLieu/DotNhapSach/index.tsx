import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import SelectHocKy from '@/pages/DaoTao/HocKy/SelectHocKy';
import type { AnPham } from '@/services/SachTaiLieu/AnPham/typing';
import { DeleteOutlined, EditOutlined, ExportOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { useIntl, useModel } from 'umi';
import Form from './components/Form';
import ModalExportDangKyTongQuat from './components/ModalExport';

const DotNhapSachPage = () => {
	const intl = useIntl();
	const { danhSach: danhSachHocKy, record: recHocKy, setRecord: setRecHocKy } = useModel('daotao.hocky');
	const { getModel, page, limit, handleEdit, deleteModel } = useModel('sachtailieu.anpham.dotnhapsach');
	const [visibleThongKe, setVisibleThongKe] = useState(false);

	const getData = () => {
		if (recHocKy?.ma) getModel({ maHocKy: recHocKy?.ma });
	};

	const columns: IColumn<AnPham.IDotNhapSach>[] = [
		{
			title: 'Tên đợt',
			dataIndex: 'ten',
			width: 160,
			filterType: 'string',
		},
		{
			title: 'Bắt đầu',
			dataIndex: 'thoiGianBatDau',
			width: 100,
			align: 'center',
			render: (val) => val && moment(val).format('DD/MM/YYYY'),
			filterType: 'date',
			sortable: true,
		},
		{
			title: 'Kết thúc',
			dataIndex: 'thoiGianKetThuc',
			width: 100,
			align: 'center',
			render: (val) => val && moment(val).format('DD/MM/YYYY'),
			filterType: 'date',
			sortable: true,
		},
		{
			title: 'Số chứng từ',
			dataIndex: 'soChungTu',
			width: 120,
			filterType: 'string',
		},
		{
			title: 'Ngày chứng từ',
			dataIndex: 'ngayChungTu',
			width: 100,
			align: 'center',
			render: (val) => val && moment(val).format('DD/MM/YYYY'),
			filterType: 'date',
			sortable: true,
		},
		{
			title: 'Mô tả',
			dataIndex: 'moTa',
			width: 200,
			render: (val) => <ExpandText>{val}</ExpandText>,
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
			dependencies={[page, limit, recHocKy?.ma]}
			modelName='sachtailieu.anpham.dotnhapsach'
			title={intl.formatMessage({ id: 'sachtailieu.dotnhapsach.title' })}
			Form={Form}
			widthDrawer={800}
		>
			<div style={{ marginBottom: 12 }}>
				<SelectHocKy
					style={{ width: 250 }}
					value={recHocKy?.ma}
					onChange={(val) => setRecHocKy(danhSachHocKy?.find((item) => item?.ma === val))}
					selectMa
				/>
				<ButtonExtend onClick={() => setVisibleThongKe(true)} icon={<ExportOutlined />}>
					Thống kê đăng ký tổng quát
				</ButtonExtend>
			</div>

			<ModalExportDangKyTongQuat visible={visibleThongKe} setVisible={setVisibleThongKe} />
		</TableBase>
	);
};

export default DotNhapSachPage;
