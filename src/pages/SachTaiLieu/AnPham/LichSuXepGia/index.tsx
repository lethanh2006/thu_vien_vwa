import ExpandText from '@/components/ExpandText';
import ButtonExtend from '@/components/Table/ButtonExtend';
import TableStaticData from '@/components/Table/TableStaticData';
import { type IColumn } from '@/components/Table/typing';
import SelectGiaSach from '@/pages/DanhMuc/GiaSach/components/Select';
import SelectKhoSach from '@/pages/DanhMuc/KhoSach/components/Select';
import SelectKieuTuLieu from '@/pages/DanhMuc/KieuTuLieu/components/Select';
import SelectNguonBoSung from '@/pages/DanhMuc/NguonBoSung/components/Select';
import SelectThuVien from '@/pages/DanhMuc/ThuVien/components/Select';
import type { AnPham } from '@/services/SachTaiLieu/AnPham/typing';
import { inputFormat } from '@/utils/utils';
import { CheckOutlined, DeleteOutlined, EditOutlined, MenuOutlined } from '@ant-design/icons';
import { Button, Modal, Popconfirm, Popover, Tag } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { useModel } from 'umi';
import FormLichSuXepGia from './components/Form';

const LichSuXepGia = () => {
	const { record: recAnPham } = useModel('sachtailieu.anpham.anpham');
	const { getAllModel, danhSach, putModel, setRecord, deleteModel } = useModel('sachtailieu.anpham.xepgia');
	const [visibleModal, setVisibleModal] = useState<boolean>(false);

	const getData = () => {
		if (recAnPham?._id) getAllModel(undefined, undefined, { anPhamId: recAnPham?._id });
	};

	const handleXepGia = (rec: AnPham.IXepGia) => {
		putModel(rec?._id, { daXepGia: true }, getData)
			.then()
			.catch((err) => console.log(err));
	};

	const columns: IColumn<AnPham.IXepGia>[] = [
		{
			title: 'Nhan đề',
			width: 180,
			render: (val, rec) => <ExpandText>{rec?.anPham?.nhanDe}</ExpandText>,
		},
		{
			title: 'Tác giả',
			width: 120,
			render: (val, rec) => rec?.anPham?.tacGia,
		},
		{
			title: 'Nguồn bổ sung',
			dataIndex: 'maNguonBoSung',
			width: 130,
			render: (val, rec) => rec?.nguonBoSung?.ten,
			filterType: 'customselect',
			filterCustomSelect: <SelectNguonBoSung multiple selectMa />,
		},
		{
			title: 'Kiểu tư liệu',
			dataIndex: 'maKieuTuLieu',
			width: 130,
			render: (val, rec) => rec?.kieuTuLieu?.ten,
			filterType: 'customselect',
			filterCustomSelect: <SelectKieuTuLieu multiple selectMa />,
		},
		{
			title: 'Thư viện',
			dataIndex: 'thuVienId',
			width: 130,
			render: (val, rec) => rec?.thuVien?.ten,
			filterType: 'customselect',
			filterCustomSelect: <SelectThuVien multiple />,
		},
		{
			title: 'Kho',
			dataIndex: 'khoSachId',
			width: 130,
			render: (val, rec) => rec?.khoSach?.ten,
			filterType: 'customselect',
			filterCustomSelect: <SelectKhoSach multiple />,
		},
		{
			title: 'Giá sách',
			dataIndex: 'giaSachId',
			width: 130,
			render: (val, rec) => rec?.giaSach?.ten,
			filterType: 'customselect',
			filterCustomSelect: <SelectGiaSach multiple />,
		},
		{
			title: 'Ngày bổ sung',
			dataIndex: 'ngayBoSung',
			align: 'center',
			width: 120,
			render: (val, rec) => val && moment(val).format('DD/MM/YYYY'),
			filterType: 'date',
			sortable: true,
		},
		{
			title: 'ĐKCB',
			dataIndex: 'soDangKyCaBien',
			align: 'center',
			width: 80,
			filterType: 'string',
		},
		{
			title: 'Số lượng',
			dataIndex: 'soLuong',
			width: 80,
			align: 'center',
			filterType: 'number',
			sortable: true,
		},
		{
			title: 'Đơn giá',
			dataIndex: 'donGia',
			width: 120,
			align: 'right',
			render: (val, rec) => `${inputFormat(val ?? 0)} VNĐ`,
			filterType: 'number',
			sortable: true,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'daXepGia',
			align: 'center',
			width: 120,
			render: (val, rec) => (val ? <Tag color='green'>Đã xếp giá</Tag> : <Tag color='blue'>Đang xếp giá</Tag>),
			fixed: 'right',
		},
		{
			title: 'Thao tác',
			align: 'center',
			width: 60,
			fixed: 'right',
			render: (val, rec) => (
				<Popover
					placement='topRight'
					content={
						<>
							<Popconfirm
								onConfirm={() => handleXepGia(rec)}
								title='Xác nhận áp dụng xếp giá vào ấn phẩm này?'
								placement='topRight'
							>
								<ButtonExtend
									disabled={rec?.daXepGia}
									tooltip='Xác nhận'
									type='link'
									className='text-success'
									icon={<CheckOutlined />}
								/>
							</Popconfirm>
							<ButtonExtend
								tooltip='Chinh sửa'
								onClick={() => {
									setRecord(rec);
									setVisibleModal(true);
								}}
								type='link'
								icon={<EditOutlined />}
							/>
							<Popconfirm
								onConfirm={() => deleteModel(rec._id, getData)}
								title='Bạn có chắc chắn muốn xóa thông tin này?'
								placement='topRight'
							>
								<ButtonExtend disabled={rec?.daXepGia} tooltip='Xóa' danger type='link' icon={<DeleteOutlined />} />
							</Popconfirm>
						</>
					}
				>
					<Button type='link' icon={<MenuOutlined />} />
				</Popover>
			),
		},
	];

	return (
		<>
			<TableStaticData columns={columns} data={danhSach ?? []} addStt hasTotal otherProps={{ pagination: true }} />

			<Modal
				title='Chỉnh sửa xếp giá'
				visible={visibleModal}
				onCancel={() => setVisibleModal(false)}
				width={800}
				footer={null}
			>
				<FormLichSuXepGia
					onCancel={() => setVisibleModal(false)}
					onOk={() => {
						getData();
						setVisibleModal(false);
					}}
				/>
			</Modal>
		</>
	);
};

export default LichSuXepGia;
