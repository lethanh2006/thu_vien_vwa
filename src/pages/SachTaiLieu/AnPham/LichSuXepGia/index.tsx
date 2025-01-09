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
import { DollarOutlined, EyeOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { useModel } from 'umi';
import ChiTietXepGia from './components/ChiTiet';

const LichSuXepGia = () => {
	const { page, limit, handleEdit, setRecord } = useModel('sachtailieu.anpham.xepgia');
	const { setRecord: setRecAnPham } = useModel('sachtailieu.anpham.anpham');
	const [visibleChiTiet, setVisibleChiTiet] = useState<boolean>(false);

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
			width: 90,
			fixed: 'right',
			render: (val, rec) => (
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
					<ButtonExtend
						disabled={rec?.daXepGia}
						tooltip='Xếp giá'
						onClick={() => {
							setRecAnPham({} as AnPham.IRecord);
							handleEdit(rec);
						}}
						type='link'
						icon={<DollarOutlined />}
					/>
				</>
			),
		},
	];

	return (
		<>
			<TableBase
				columns={columns}
				dependencies={[page, limit]}
				modelName='sachtailieu.anpham.xepgia'
				buttons={{ create: false }}
				hideCard
			/>

			<ChiTietXepGia visible={visibleChiTiet} setVisible={setVisibleChiTiet} />
		</>
	);
};

export default LichSuXepGia;
