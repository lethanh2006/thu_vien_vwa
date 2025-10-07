import MyDateRangePicker from '@/components/MyDatePicker/RangePicker';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { EOperatorType } from '@/components/Table/constant';
import type { IColumn } from '@/components/Table/typing';
import ModalCapNhatAnhNhanDien from '@/pages/SinhVien/CapNhatKhuonMat/Modal';
import { exportDanhSachRaVaoThuVien } from '@/services/QuanLyThuVien';
import type { QuanLyThuVien } from '@/services/QuanLyThuVien/typing';
import { ExportOutlined, EyeOutlined, QrcodeOutlined, SettingOutlined, SmileOutlined } from '@ant-design/icons';
import { Card, Space, Tag } from 'antd';
import fileDownload from 'js-file-download';
import moment from 'moment';
import { useState } from 'react';
import { useModel } from 'umi';
import CauHinhVaoRaThuVien from './CauHinh';
import ChiTietSinhVien from './components/ChiTiet';
import Form from './components/Form';

const VaoRaThuVienPage = (props: { maSinhVien?: string; dateRange?: any }) => {
	const { maSinhVien, dateRange: dateRangeProps } = props;
	const { getModel, page, limit, setRecord } = useModel('quanlythuvien.vaorathuvien');
	const [visibleChiTiet, setVisibleChiTiet] = useState<boolean>(false);
	const [visibleSetting, setVisibleSetting] = useState<boolean>(false);
	const [loadingExport, setLoadingExport] = useState<boolean>(false);
	const [visibleFaceReg, setVisibleFaceReg] = useState<boolean>(false);
	const [dateRange, setDateRange] = useState<string[]>([
		moment().startOf('M').toISOString(),
		moment().endOf('M').toISOString(),
	]);

	const filters = [
		maSinhVien && {
			field: 'maSv',
			values: [maSinhVien],
			operator: EOperatorType.INCLUDE,
		},
		dateRange?.length && {
			field: 'thoiGianCheckIn',
			values: [moment(dateRange[0]).startOf('date').toISOString(), moment(dateRange[1]).endOf('date').toISOString()],
			operator: EOperatorType.BETWEEN,
		},
	];

	const getData = () => {
		getModel(undefined, filters?.filter(Boolean) as any);
	};

	const onCell = (rec: QuanLyThuVien.IVaoRaThuVien) => ({
		onClick: () => {
			if (!maSinhVien) {
				setRecord(rec);
				setVisibleChiTiet(true);
			}
		},
		style: { cursor: !maSinhVien ? 'pointer' : undefined },
	});

	const handlExport = () => {
		setLoadingExport(true);
		exportDanhSachRaVaoThuVien({
			filters: filters?.filter(Boolean),
		})
			.then((res) => {
				fileDownload(res.data, 'Danh sách sinh viên ra vào thư viện.docx');
			})
			.finally(() => {
				setLoadingExport(false);
			});
	};

	const columns: IColumn<QuanLyThuVien.IVaoRaThuVien>[] = [
		{
			title: 'Mã SV',
			align: 'center',
			dataIndex: 'maSv',
			width: 120,
			filterType: 'string',
			hide: !!maSinhVien,
			onCell,
		},
		{
			title: 'Họ tên',
			dataIndex: 'hoTen',
			width: 160,
			filterType: 'string',
			hide: !!maSinhVien,
			onCell,
		},
		{
			title: 'Thời gian vào',
			dataIndex: 'thoiGianCheckIn',
			align: 'center',
			width: 150,
			render: (val, rec) =>
				val ? (
					<>
						Buổi {rec?.buoi ?? '--'}, {moment(val).format('HH:mm DD/MM/YYYY')}
					</>
				) : (
					<Tag color='red'>Chưa vào</Tag>
				),
			filterType: 'date',
			sortable: true,
			onCell,
		},
		{
			title: 'Thời gian ra',
			dataIndex: 'thoiGianCheckOut',
			align: 'center',
			width: 120,
			render: (val, rec) => (val ? moment(val).format('HH:mm DD/MM/YYYY') : <Tag color='red'>Chưa ra</Tag>),
			filterType: 'date',
			sortable: true,
			onCell,
		},
		{
			title: 'SĐT',
			dataIndex: 'soDienThoai',
			align: 'center',
			width: 120,
			filterType: 'string',
			hide: !!maSinhVien,
			onCell,
		},
		{
			title: 'Ngày sinh',
			dataIndex: 'ngaySinh',
			align: 'center',
			width: 120,
			render: (val, rec) => val && moment(val).format('DD/MM/YYYY'),
			filterType: 'date',
			sortable: true,
			hide: !!maSinhVien,
			onCell,
		},
		{
			title: 'Khóa sinh viên',
			dataIndex: 'tenKhoaSinhVien',
			width: 120,
			filterType: 'string',
			hide: !!maSinhVien,
			onCell,
		},
		{
			title: 'Ngành đào tạo',
			dataIndex: 'tenNganh',
			width: 180,
			render: (val, rec) => `${val} - ${rec?.maNganh}`,
			filterType: 'string',
			hide: !!maSinhVien,
			onCell,
		},
		{
			title: 'Lớp hành chính',
			dataIndex: 'tenLopHanhChinh',
			width: 120,
			filterType: 'string',
			hide: !!maSinhVien,
			onCell,
		},
		{
			title: 'Thao tác',
			align: 'center',
			fixed: 'right',
			width: 60,
			render: (val, rec) => (
				<ButtonExtend
					tooltip='Chi tiết'
					type='link'
					icon={<EyeOutlined />}
					onClick={() => {
						setRecord(rec);
						setVisibleChiTiet(true);
					}}
				/>
			),
			hide: !!maSinhVien,
		},
	];

	if (maSinhVien)
		return (
			<TableBase
				getData={getData}
				columns={columns}
				dependencies={[page, limit, maSinhVien]}
				modelName='quanlythuvien.vaorathuvien'
				hideCard
				buttons={{ create: false }}
			/>
		);

	return (
		<Card
			title='Lịch sử sinh viên vào ra thư viện'
			extra={<ButtonExtend icon={<SettingOutlined />} onClick={() => setVisibleSetting(true)} />}
		>
			<Space style={{ marginBottom: 12 }}>
				<MyDateRangePicker
					value={dateRange?.length ? [moment(dateRange[0]), moment(dateRange[1])] : null}
					onChange={(val: any) => setDateRange(val ?? [])}
					ranges={{
						'Hôm nay': [moment().startOf('date'), moment().endOf('date')],
						'Tuần này': [moment().startOf('week'), moment().endOf('week')],
						'Tháng này': [moment().startOf('M'), moment().endOf('M')],
					}}
					allowClear
				/>
				<ButtonExtend
					key='2'
					icon={<QrcodeOutlined />}
					onClick={() => {
						window.open(`${APP_CONFIG_URL_THU_VIEN}qr-thu-vien.jpg`, '_blank');
					}}
					tooltip='Mã QR checkin vào/ra thư viện'
				>
					Mã QR
				</ButtonExtend>
				<ButtonExtend
					icon={<SmileOutlined />}
					onClick={() => setVisibleFaceReg(true)}
					tooltip='Cập nhật ảnh nhận diện khuôn mặt sinh viên'
				>
					Cập nhật nhận diện khuôn mặt
				</ButtonExtend>
			</Space>

			<TableBase
				getData={getData}
				columns={columns}
				dependencies={[page, limit, dateRange, dateRangeProps]}
				modelName='quanlythuvien.vaorathuvien'
				hideCard
				Form={Form}
				formProps={{ getData }}
				title='Lịch sử vào ra thư viện'
				otherButtons={[
					<ButtonExtend loading={loadingExport} key='1' icon={<ExportOutlined />} onClick={() => handlExport()}>
						Xuất dữ liệu
					</ButtonExtend>,
				]}
			/>

			<ChiTietSinhVien visible={visibleChiTiet} setVisible={setVisibleChiTiet} />

			<CauHinhVaoRaThuVien visible={visibleSetting} setVisible={setVisibleSetting} />

			<ModalCapNhatAnhNhanDien visible={visibleFaceReg} setVisible={setVisibleFaceReg} />
		</Card>
	);
};

export default VaoRaThuVienPage;
