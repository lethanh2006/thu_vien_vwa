import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { type IColumn } from '@/components/Table/typing';
import SelectGiaSach from '@/pages/DanhMuc/GiaSach/components/Select';
import SelectKhoSach from '@/pages/DanhMuc/KhoSach/components/Select';
import SelectKieuTuLieu from '@/pages/DanhMuc/KieuTuLieu/components/Select';
import SelectNguonBoSung from '@/pages/DanhMuc/NguonBoSung/components/Select';
import SelectThuVien from '@/pages/DanhMuc/ThuVien/components/Select';
import type { AnPham } from '@/services/SachTaiLieu/AnPham/typing';
import { inputFormat } from '@/utils/utils';
import { CheckOutlined, DeleteOutlined, EditOutlined, EyeOutlined, MenuOutlined } from '@ant-design/icons';
import { Button, Modal, Popconfirm, Popover, Tag } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { useModel } from 'umi';
import ChiTietXepGia from '../../XepGia/components/ChiTiet';
import FormLichSuXepGia from './components/Form';

const LichSuXepGia = () => {
	const { record: recAnPham } = useModel('sachtailieu.anpham.anpham');
	const { getModel, page, limit, putModel, setRecord, deleteModel, thongKeXepGiaModel } =
		useModel('sachtailieu.anpham.xepgia');
	const [visibleModal, setVisibleModal] = useState<boolean>(false);
	const [visibleChiTiet, setVisibleChiTiet] = useState<boolean>(false);

	const getData = () => {
		if (recAnPham?._id) getModel({ anPhamId: recAnPham?._id });
	};

	const handleXepGia = (rec: AnPham.IXepGia) => {
		putModel(
			rec?._id,
			{ ...rec, daXepGia: true },
			() => {
				getData();
				thongKeXepGiaModel({ anPhamId: recAnPham?._id });
			},
			undefined,
			false,
		)
			.then()
			.catch((err) => console.log(err));
	};

	const onCell = (rec: AnPham.IXepGia) => ({
		onClick: () => {
			setRecord(rec);
			setVisibleChiTiet(true);
		},
		style: { cursor: 'pointer' },
	});

	const columns: IColumn<AnPham.IXepGia>[] = [
		{
			title: 'Nhan đề',
			width: 180,
			render: (val, rec) => <ExpandText>{rec?.anPham?.nhanDe}</ExpandText>,
			onCell,
		},
		{
			title: 'Tác giả',
			width: 120,
			render: (val, rec) => rec?.anPham?.tacGia,
			onCell,
		},
		{
			title: 'Nguồn bổ sung',
			dataIndex: 'maNguonBoSung',
			width: 130,
			render: (val, rec) => rec?.nguonBoSung?.ten,
			filterType: 'customselect',
			filterCustomSelect: <SelectNguonBoSung multiple selectMa />,
			onCell,
		},
		{
			title: 'Kiểu tư liệu',
			dataIndex: 'maKieuTuLieu',
			width: 130,
			render: (val, rec) => rec?.kieuTuLieu?.ten,
			filterType: 'customselect',
			filterCustomSelect: <SelectKieuTuLieu multiple selectMa />,
			onCell,
		},
		{
			title: 'Thư viện',
			dataIndex: 'thuVienId',
			width: 130,
			render: (val, rec) => rec?.thuVien?.ten,
			filterType: 'customselect',
			filterCustomSelect: <SelectThuVien multiple />,
			onCell,
		},
		{
			title: 'Kho',
			dataIndex: 'khoSachId',
			width: 130,
			render: (val, rec) => rec?.khoSach?.ten,
			filterType: 'customselect',
			filterCustomSelect: <SelectKhoSach multiple />,
			onCell,
		},
		{
			title: 'Giá sách',
			dataIndex: 'giaSachId',
			width: 130,
			render: (val, rec) => rec?.giaSach?.ten,
			filterType: 'customselect',
			filterCustomSelect: <SelectGiaSach multiple />,
			onCell,
		},
		{
			title: 'Ngày bổ sung',
			dataIndex: 'ngayBoSung',
			align: 'center',
			width: 120,
			render: (val, rec) => val && moment(val).format('DD/MM/YYYY'),
			filterType: 'date',
			sortable: true,
			onCell,
		},
		{
			title: 'Số lượng',
			dataIndex: 'soLuong',
			width: 80,
			align: 'center',
			filterType: 'number',
			sortable: true,
			onCell,
		},
		{
			title: 'Đơn giá',
			dataIndex: 'donGia',
			width: 120,
			align: 'right',
			render: (val, rec) => `${inputFormat(val ?? 0)} VNĐ`,
			filterType: 'number',
			sortable: true,
			onCell,
		},
		{
			title: 'Trạng thái',
			dataIndex: 'daXepGia',
			align: 'center',
			width: 120,
			render: (val, rec) => (val ? <Tag color='green'>Đã xếp giá</Tag> : <Tag color='blue'>Đang xếp giá</Tag>),
			fixed: 'right',
			onCell,
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
							<ButtonExtend
								tooltip='Chi tiết'
								onClick={() => {
									setRecord(rec);
									setVisibleChiTiet(true);
								}}
								type='link'
								icon={<EyeOutlined />}
							/>
							<Popconfirm
								onConfirm={() => handleXepGia(rec)}
								title='Xác nhận áp dụng xếp giá vào ấn phẩm này?'
								placement='topRight'
							>
								<ButtonExtend
									disabled={rec?.daXepGia}
									tooltip='Áp dụng'
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
								onConfirm={() =>
									deleteModel(rec._id, getData).then(() => {
										thongKeXepGiaModel({ anPhamId: recAnPham?._id });
									})
								}
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
			<TableBase
				getData={getData}
				columns={columns}
				dependencies={[page, limit, recAnPham?._id]}
				modelName='sachtailieu.anpham.xepgia'
				buttons={{ create: false }}
				hideCard
			/>

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
						thongKeXepGiaModel({ anPhamId: recAnPham?._id });
						setVisibleModal(false);
					}}
				/>
			</Modal>

			<ChiTietXepGia visible={visibleChiTiet} setVisible={setVisibleChiTiet} />
		</>
	);
};

export default LichSuXepGia;
