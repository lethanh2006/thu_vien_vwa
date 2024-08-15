import MyDateRangePicker from '@/components/MyDatePicker/RangePicker';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { EOperatorType } from '@/components/Table/constant';
import type { IColumn } from '@/components/Table/typing';
import type { QuanLyThuVien } from '@/services/QuanLyThuVien/typing';
import { ExportOutlined, EyeOutlined, QrcodeOutlined, SettingOutlined } from '@ant-design/icons';
import { Card, DatePicker, Select, Space, Tag } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { useModel } from 'umi';
import ChiTietSinhVien from './components/ChiTiet';
import Form from './components/Form';
import { exportDanhSachRaVaoThuVien } from '@/services/QuanLyThuVien';
import fileDownload from 'js-file-download';
import CauHinhVaoRaThuVien from './CauHinh';
import SelectKhoaSinhVien from '@/pages/DaoTao/KhoaSinhVien/Select';
import SelectNganhCoSo from '@/pages/DaoTao/Nganh/Select';

const VaoRaThuVienPage = () => {
	const { page, limit, setPage, filters, setFilters, setRecord } = useModel('quanlythuvien.vaorathuvien');
	const [typeSoft, setTypeSoft] = useState<string>();
	const [visibleChiTiet, setVisibleChiTiet] = useState<boolean>(false);
	const [visibleSetting, setVisibleSetting] = useState<boolean>(false);
	const [loadingExport, setLoadingExport] = useState<boolean>(false);

	const onCell = (rec: QuanLyThuVien.IVaoRaThuVien) => ({
		onClick: () => {
			setRecord(rec);
			setVisibleChiTiet(true);
		},
		style: { cursor: 'pointer' },
	});

	const handleChange = (value: string) => {
		setPage(1);
		setTypeSoft(value);
		if (value) {
			switch (value) {
				case 'week':
					setFilters([
						{
							active: true,
							field: 'thoiGianCheckIn',
							values: [moment().subtract(7, 'days').startOf('day').toISOString(), moment().endOf('day').toISOString()],
							operator: EOperatorType.BETWEEN,
						},
						...filters,
					]);
					break;
				case 'month':
					setFilters([
						{
							active: true,
							field: 'thoiGianCheckIn',
							values: [
								moment()
									.set('month', moment().month() - 1)
									.startOf('month')
									.toISOString(),
								moment().endOf('day').toISOString(),
							],
							operator: EOperatorType.BETWEEN,
						},
						...filters,
					]);
					break;
				case 'precious':
					setFilters([
						{
							active: true,
							field: 'thoiGianCheckIn',
							values: [
								moment()
									.set('month', moment().month() - 6)
									.startOf('month')
									.toISOString(),
								moment().endOf('day').toISOString(),
							],
							operator: EOperatorType.BETWEEN,
						},
						...filters,
					]);
					break;
				case 'year':
					setFilters([
						{
							active: true,
							field: 'thoiGianCheckIn',
							values: [
								moment()
									.set('year', moment().year() - 1)
									.startOf('year')
									.toISOString(),
								moment().endOf('day').toISOString(),
							],
							operator: EOperatorType.BETWEEN,
						},
						...filters,
					]);
					break;
				case 'detail':
					break;
				case 'about':
					break;
			}
		} else {
			const temp = [...(filters ?? [])].filter((item) => item.field !== 'thoiGianCheckIn');
			setFilters(temp);
		}
	};

	const handleChangeTime = (value: any) => {
		setPage(1);
		if (value) {
			setFilters([
				{
					active: true,
					field: 'thoiGianCheckIn',
					values: [moment(value[0]).startOf('day').toISOString(), moment(value[1]).endOf('day').toISOString()],
					operator: EOperatorType.BETWEEN,
				},
				...filters,
			]);
		} else {
			const temp = [...(filters ?? [])].filter((item) => item.field !== 'thoiGianCheckIn');
			setFilters(temp);
		}
	};

	const handleChangeTimeDate = (value: any) => {
		setPage(1);
		if (value) {
			setFilters([
				{
					active: true,
					field: 'thoiGianCheckIn',
					values: [moment(value).startOf('day').toISOString(), moment(value).endOf('day').toISOString()],
					operator: EOperatorType.BETWEEN,
				},
				...filters,
			]);
		} else {
			const temp = [...(filters ?? [])].filter((item) => item.field !== 'thoiGianCheckIn');
			setFilters(temp);
		}
	};

	const handlExport = () => {
		setLoadingExport(true);
		exportDanhSachRaVaoThuVien({
			filters: filters ?? undefined,
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
			title: 'Mã sinh viên',
			dataIndex: 'maSv',
			width: 150,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Họ và tên',
			dataIndex: 'hoTen',
			width: 150,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Ngày sinh',
			dataIndex: 'ngaySinh',
			width: 120,
			filterType: 'date',
			render: (val, rec) => val && moment(val).format('DD/MM/YYYY'),
			sortable: true,
			onCell,
		},
		{
			title: 'Khóa sinh viên',
			dataIndex: 'maKhoaSinhVien',
			align: 'center',
			width: 150,
			render: (val, rec) => rec?.tenKhoaSinhVien,
			filterType: 'customselect',
			filterCustomSelect: <SelectKhoaSinhVien multiple selectMa />,
			onCell,
		},
		{
			title: 'Ngành đào tạo',
			dataIndex: 'maNganh',
			align: 'center',
			width: 150,
			render: (val, rec) => rec?.tenNganh,
			filterType: 'customselect',
			filterCustomSelect: <SelectNganhCoSo multiple selectMa />,
			onCell,
		},
		{
			title: 'Số điện thoại',
			dataIndex: 'soDienThoai',
			align: 'center',
			width: 150,
			filterType: 'string',
			onCell,
		},
		{
			title: 'Thời gian vào',
			dataIndex: 'thoiGianCheckIn',
			align: 'center',
			width: 120,
			render: (val, rec) => val && moment(val).format('HH:mm DD/MM/YYYY'),
			filterType: 'date',
			sortable: true,
			onCell,
		},
		{
			title: 'Thời gian ra',
			dataIndex: 'thoiGianCheckOut',
			align: 'center',
			width: 120,
			render: (val, rec) => val && moment(val).format('HH:mm DD/MM/YYYY'),
			filterType: 'date',
			sortable: true,
			onCell,
		},
		{
			title: 'Trạng thái vào',
			dataIndex: 'trangThaiCheckIn',
			align: 'center',
			onCell,
			width: 150,
			render: (val, rec) => {
				return val ? <Tag color={'green'}>Đã vào</Tag> : <Tag color={'red'}>Chưa vào</Tag>;
			},
		},
		{
			title: 'Trạng thái ra',
			dataIndex: 'trangThaiCheckOut',
			align: 'center',
			onCell,
			width: 150,
			render: (val, rec) => {
				return val ? <Tag color={'green'}>Đã ra</Tag> : <Tag color={'red'}>Chưa ra</Tag>;
			},
		},
		{
			title: 'Thao tác',
			align: 'center',
			fixed: 'right',
			width: 100,
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
		},
	];

	return (
		<Card
			title='Ra vào thư viện'
			extra={<ButtonExtend icon={<SettingOutlined />} onClick={() => setVisibleSetting(true)} />}
		>
			<Space style={{ marginBottom: 12 }}>
				<Select
					onChange={handleChange}
					style={{ width: 250 }}
					value={typeSoft}
					placeholder='Chọn khoảng thời gian'
					options={[
						{
							value: 'week',
							label: 'Tuần trước',
						},
						{
							value: 'month',
							label: 'Tháng trước',
						},
						{
							value: 'precious',
							label: '6 tháng trước',
						},
						{
							value: 'year',
							label: '1 Năm trước',
						},
						{
							value: 'detail',
							label: 'Thời gian cụ thể',
						},
						{
							value: 'about',
							label: 'Khoảng thời gian cụ thể',
						},
					]}
					allowClear
				/>
				{typeSoft === 'detail' && (
					<DatePicker
						style={{ marginRight: '16px' }}
						onChange={handleChangeTimeDate}
						disabledDate={(cur) => moment(cur).isAfter(moment())}
					/>
				)}
				{typeSoft === 'about' && (
					<MyDateRangePicker
						style={{ marginRight: '16px' }}
						onChange={handleChangeTime}
						disabledDate={(cur) => moment(cur).isAfter(moment())}
					/>
				)}
			</Space>
			<TableBase
				columns={columns}
				dependencies={[page, limit]}
				modelName='quanlythuvien.vaorathuvien'
				hideCard
				Form={Form}
				title='Ra vào thư viện'
				otherButtons={[
					<ButtonExtend loading={loadingExport} key='1' icon={<ExportOutlined />} onClick={() => handlExport()}>
						Xuất dữ liệu
					</ButtonExtend>,
					<ButtonExtend
						key='2'
						icon={<QrcodeOutlined />}
						onClick={() => {
							window.open(`${APP_CONFIG_URL_VPS}/qr-thu-vien.jpg`, '_blank');
						}}
					>
						Mã QR
					</ButtonExtend>,
				]}
			/>

			<ChiTietSinhVien visible={visibleChiTiet} setVisible={setVisibleChiTiet} />
			<CauHinhVaoRaThuVien visible={visibleSetting} setVisible={setVisibleSetting} />
		</Card>
	);
};

export default VaoRaThuVienPage;
