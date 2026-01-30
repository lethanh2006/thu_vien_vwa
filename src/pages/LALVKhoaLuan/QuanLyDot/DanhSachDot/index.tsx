import ExpandText from '@/components/ExpandText';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import type { IColumn } from '@/components/Table/typing';
import { colorTrangThaiNopThuVien, ETrangThaiNopThuVien } from '@/services/QuanLyThuVien/constants';
import type { QuanLyThuVien } from '@/services/QuanLyThuVien/typing';
import dayjs from '@/utils/dayjs';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { Alert, Popconfirm, Tag } from 'antd';
import { useIntl, useModel } from 'umi';
import ChiTietDanhSach from './components/ChiTiet';
import FormDanhSachNop from './components/Form';

const DanhSachDot = () => {
	const intl = useIntl();
	const { record: recDot } = useModel('quanlythuvien.quanlydot');
	const { getModel, page, limit, handleEdit, handleView, isView, deleteModel } = useModel('quanlythuvien.danhsachdot');
	const isNgoaiThoiGian = dayjs(recDot?.thoiGianKetThuc).isBefore(dayjs());

	const getData = () => {
		getModel({ idDot: recDot?._id });
	};

	const columns: IColumn<QuanLyThuVien.IQuanLyDanhSachNop>[] = [
		{
			title: intl.formatMessage({ id: 'luananluanvankhoaluan.label.maSinhVien' }),
			dataIndex: 'maSinhVien',
			align: 'center',
			filterType: 'string',
			width: 180,
		},
		{
			title: intl.formatMessage({ id: 'luananluanvankhoaluan.label.hoVaTen' }),
			dataIndex: 'hoTenTacGia',
			filterType: 'string',
			render: (val, rec) => val ?? rec?.sinhVien?.ten,
			width: 180,
		},
		{
			title: intl.formatMessage({ id: 'luananluanvankhoaluan.label.soDienThoai' }),
			width: 180,
			render: (val, rec) => rec?.sinhVien?.soDienThoai,
		},
		{
			title: intl.formatMessage({ id: 'luananluanvankhoaluan.label.tenDeTai' }),
			dataIndex: 'tenDeTai',
			width: 250,
			render: (val: any) => <ExpandText>{val}</ExpandText>,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'luananluanvankhoaluan.label.nguoiHuongDan' }),
			dataIndex: 'nguoiHuongDan',
			width: 180,
			filterType: 'string',
		},
		{
			title: intl.formatMessage({ id: 'luananluanvankhoaluan.label.trangThai' }),
			dataIndex: 'trangThai',
			align: 'center',
			width: 130,
			render: (val, rec) => <Tag color={colorTrangThaiNopThuVien[val as ETrangThaiNopThuVien]}>{val}</Tag>,
			filterType: 'select',
			filterData: Object.values(ETrangThaiNopThuVien),
			fixed: 'right',
		},
		{
			title: intl.formatMessage({ id: 'luananluanvankhoaluan.table.column.thaoTac' }),
			align: 'center',
			fixed: 'right',
			width: 120,
			render: (val, rec) => {
				return (
					<>
						<ButtonExtend
							title={intl.formatMessage({ id: 'global.button.chitiet' })}
							type='link'
							icon={<EyeOutlined />}
							onClick={() => handleView(rec)}
						/>
						<ButtonExtend
							title={intl.formatMessage({ id: 'luananluanvankhoaluan.button.xemChiTiet' })}
							type='link'
							icon={<EyeOutlined />}
							onClick={() => handleView(rec)}
						/>
						<ButtonExtend
							title={intl.formatMessage({ id: 'global.button.chinhsua' })}
							type='link'
							icon={<EditOutlined />}
							onClick={() => handleEdit(rec)}
							disabled={isNgoaiThoiGian}
						/>

						<Popconfirm
							title={intl.formatMessage({ id: 'luananluanvankhoaluan.confirm.xoa' })}
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
					message={intl.formatMessage({ id: 'luananluanvankhoaluan.alert.quaThoiGian' })}
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
				title={intl.formatMessage({ id: 'luananluanvankhoaluan.title.quanLyNop' })}
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
