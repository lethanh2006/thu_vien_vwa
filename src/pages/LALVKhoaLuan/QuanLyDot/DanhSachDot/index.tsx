import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import type { IColumn } from '@/components/Table/typing';
import { colorTrangThaiNopThuVien, ETrangThaiNopThuVien } from '@/services/QuanLyThuVien/constants';
import type { QuanLyThuVien } from '@/services/QuanLyThuVien/typing';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Alert, Popconfirm, Tag } from 'antd';
import moment from 'moment';
import { useModel } from 'umi';
import ChiTietDanhSach from './components/ChiTiet';
import FormDanhSachNop from './components/Form';

const DanhSachDot = () => {
	const { record: recDot } = useModel('quanlythuvien.quanlydot');
	const { getModel, page, limit, handleEdit, handleView, isView, deleteModel } = useModel('quanlythuvien.danhsachdot');
	const isNgoaiThoiGian = moment(recDot?.thoiGianKetThuc).isBefore(moment());

	const getData = () => {
		getModel({ idDot: recDot?._id });
	};

	const columns: IColumn<QuanLyThuVien.IQuanLyDanhSachNop>[] = [
		{
			title: 'Mã học viên',
			dataIndex: 'maSinhVien',
			align: 'center',
			filterType: 'string',
			width: 180,
		},
		{
			title: 'Họ và tên',
			dataIndex: 'hoTenTacGia',
			filterType: 'string',
			render: (val, rec) => val ?? rec?.sinhVien?.ten,
			width: 180,
		},
		{
			title: 'Số điện thoại',
			width: 180,
			render: (val, rec) => rec?.sinhVien?.soDienThoai,
		},
		{
			title: 'Tên đề tài',
			dataIndex: 'tenDeTai',
			width: 250,
			render: (val: any) => <ExpandText>{val}</ExpandText>,
			filterType: 'string',
		},
		{
			title: 'Người hướng dẫn',
			dataIndex: 'nguoiHuongDan',
			width: 180,
			filterType: 'string',
		},
		{
			title: 'Trạng thái',
			dataIndex: 'trangThai',
			align: 'center',
			width: 130,
			render: (val, rec) => <Tag color={colorTrangThaiNopThuVien[val as ETrangThaiNopThuVien]}>{val}</Tag>,
			filterType: 'select',
			filterData: Object.values(ETrangThaiNopThuVien),
			fixed: 'right',
		},
		{
			title: 'Thao tác',
			align: 'center',
			fixed: 'right',
			width: 120,
			render: (val, rec) => {
				return (
					<>
						<ButtonExtend title='Xem chi tiết' type='link' icon={<EyeOutlined />} onClick={() => handleView(rec)} />
						<ButtonExtend
							title='Chỉnh sửa'
							type='link'
							icon={<EditOutlined />}
							onClick={() => handleEdit(rec)}
							disabled={isNgoaiThoiGian}
						/>

						<Popconfirm
							title='Bạn có chắc chắn xoá?'
							onConfirm={() => {
								deleteModel(rec?._id);
							}}
						>
							<ButtonExtend disabled={isNgoaiThoiGian} type='link' danger icon={<DeleteOutlined />} />
						</Popconfirm>
					</>
				);
			},
		},
	];

	return (
		<>
			{isNgoaiThoiGian && (
				<Alert
					style={{ marginBottom: 12 }}
					type='error'
					showIcon
					message='Đợt đã quá thời gian không được thêm danh sách nộp!'
				/>
			)}

			<TableBase
				getData={getData}
				columns={columns}
				params={{ idDot: recDot?._id }}
				dependencies={[page, limit]}
				modelName='quanlythuvien.danhsachdot'
				hideCard
				Form={isView ? ChiTietDanhSach : FormDanhSachNop}
				formProps={{ getData }}
				hideChildrenRows
				title='Quản lý nộp'
				widthDrawer={900}
				buttons={{
					create: isNgoaiThoiGian ? false : true,
					import: isNgoaiThoiGian ? false : true,
					export: isNgoaiThoiGian ? false : true,
				}}
			/>
		</>
	);
};

export default DanhSachDot;
