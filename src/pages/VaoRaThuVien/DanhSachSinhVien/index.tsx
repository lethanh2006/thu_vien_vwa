import MyDateRangePicker from '@/components/MyDatePicker/RangePicker';
import TableBase from '@/components/Table';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { EOperatorType } from '@/components/Table/constant';
import type { IColumn } from '@/components/Table/typing';
import SelectKhoaSinhVien from '@/pages/DaoTao/KhoaSinhVien/Select';
import SelectNganhCoSo from '@/pages/DaoTao/Nganh/Select';
import { exportDanhSachRaVaoThuVien } from '@/services/QuanLyThuVien';
import type { QuanLyThuVien } from '@/services/QuanLyThuVien/typing';
import { ExportOutlined, EyeOutlined, QrcodeOutlined, SettingOutlined } from '@ant-design/icons';
import { Card, DatePicker, Select, Space, Tag } from 'antd';
import fileDownload from 'js-file-download';
import moment from 'moment';
import { useState } from 'react';
import { useModel } from 'umi';
import CauHinhVaoRaThuVien from './CauHinh';
import ChiTietSinhVien from './components/ChiTiet';
import Form from './components/Form';

const VaoRaThuVienPage = (props: { maSinhVien?: string }) => {
	const { maSinhVien } = props;
	const { getModel, page, limit, setPage, filters, setFilters, setRecord } = useModel('quanlythuvien.vaorathuvien');
	const [typeSoft, setTypeSoft] = useState<string>();
	const [visibleChiTiet, setVisibleChiTiet] = useState<boolean>(false);
	const [visibleSetting, setVisibleSetting] = useState<boolean>(false);
	const [loadingExport, setLoadingExport] = useState<boolean>(false);

	const getData = () => {
		if (maSinhVien)
			getModel(undefined, [
				{
					active: true,
					field: 'maSv',
					values: [maSinhVien],
					operator: EOperatorType.INCLUDE,
				},
			]);
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
			align: 'center',
			dataIndex: 'maSv',
			width: 120,
			filterType: 'string',
			hide: !!maSinhVien,
			onCell,
		},
		{
			title: 'Họ và tên',
			dataIndex: 'hoTen',
			width: 150,
			filterType: 'string',
			hide: !!maSinhVien,
			onCell,
		},
		{
			title: 'Thời gian vào',
			dataIndex: 'thoiGianCheckIn',
			align: 'center',
			width: 120,
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
			title: 'Khóa sinh viên',
			dataIndex: 'maKhoaSinhVien',
			width: 120,
			render: (val, rec) => rec?.tenKhoaSinhVien,
			filterType: 'customselect',
			filterCustomSelect: <SelectKhoaSinhVien multiple selectMa />,
			hide: !!maSinhVien,
			onCell,
		},
		{
			title: 'Ngành đào tạo',
			dataIndex: 'maNganh',
			width: 180,
			render: (val, rec) => rec?.tenNganh,
			filterType: 'customselect',
			filterCustomSelect: <SelectNganhCoSo multiple selectMa />,
			hide: !!maSinhVien,
			onCell,
		},
		{
			title: 'Số điện thoại',
			dataIndex: 'soDienThoai',
			align: 'center',
			width: 120,
			filterType: 'string',
			hide: !!maSinhVien,
			onCell,
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
			title='Danh sách sinh viên vào ra thư viện'
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
							window.open(`${APP_CONFIG_URL_THU_VIEN}qr-thu-vien.jpg`, '_blank');
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
