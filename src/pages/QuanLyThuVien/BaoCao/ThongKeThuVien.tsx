import ColumnChart from '@/components/Chart/ColumnChart';
import DonutChart from '@/components/Chart/DonutChart';
import LineChart from '@/components/Chart/LineChart';
import MyDatePicker from '@/components/MyDatePicker';
import MyDateRangePicker from '@/components/MyDatePicker/RangePicker';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { EOperatorType } from '@/components/Table/constant';
import TableStaticData from '@/components/Table/TableStaticData';
import type { IColumn } from '@/components/Table/typing';
import { exportThongKe } from '@/services/QuanLyThuVien';
import type { QuanLyThuVien } from '@/services/QuanLyThuVien/typing';
import { getFilenameHeader } from '@/utils/utils';
import { ExportOutlined } from '@ant-design/icons';
import { Card, Col, DatePicker, Divider, Row, Select, Space } from 'antd';
import fileDownload from 'js-file-download';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const ThongKeThuVien = () => {
	const {
		getSoLuotCheckInNganhModel,
		loadingNganh,
		dataThongKeCheckInNganh,
		loadingTop,
		getSoLuotCheckInTopModel,
		dataThongKeCheckInTop,
		loadingKhoa,
		getSoLuotCheckInKhoaModel,
		dataThongKeCheckInKhoa,
		loadingThang,
		getSoLuotCheckInThangModel,
		dataThongKeCheckInThang,
	} = useModel('quanlythuvien.vaorathuvien');
	const [filters, setFilters] = useState<any[]>([]);
	const [typeSoft, setTypeSoft] = useState<string>();
	const [currentMonth, setCurrentMonth] = useState<moment.Moment>(moment());

	useEffect(() => {
		getSoLuotCheckInThangModel(moment(currentMonth).get('month') + 1, moment(currentMonth).get('year'));
	}, [currentMonth]);

	useEffect(() => {
		getSoLuotCheckInNganhModel(undefined, filters ? filters : undefined);
		getSoLuotCheckInTopModel(undefined, filters ? filters : undefined);
		getSoLuotCheckInKhoaModel(undefined, filters ? filters : undefined);
	}, [filters]);

	const handleChange = (value: string) => {
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
					]);
					break;
				case 'detail':
					break;
				case 'about':
					break;
			}
		} else {
			setFilters([]);
		}
	};

	const handleChangeTime = (value: any) => {
		if (value) {
			setFilters([
				{
					active: true,
					field: 'thoiGianCheckIn',
					values: [moment(value[0]).startOf('day').toISOString(), moment(value[1]).endOf('day').toISOString()],
					operator: EOperatorType.BETWEEN,
				},
			]);
		} else {
			setFilters([]);
		}
	};

	const handleChangeTimeDate = (value: any) => {
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
			setFilters([]);
		}
	};

	const handleExport = async (type: 'thong-ke-khoa' | 'thong-ke-nganh' | 'thong-ke-thang' | 'top') => {
		if (type === 'thong-ke-thang') {
			await exportThongKe(
				'thong-ke-thang',
				undefined,
				undefined,
				moment(currentMonth).get('month') + 1,
				moment(currentMonth).get('year'),
			).then((response) => {
				if (response?.data) {
					fileDownload(response?.data, getFilenameHeader(response));
				}
			});
		} else {
			await exportThongKe(type, undefined, filters ? filters : undefined).then((response) => {
				if (response?.data) {
					fileDownload(response?.data, getFilenameHeader(response));
				}
			});
		}
	};

	const columns: IColumn<QuanLyThuVien.IThongKeCheckInTop>[] = [
		{
			title: 'Mã sinh viên',
			dataIndex: 'maSv',
			width: 90,
			filterType: 'string',
		},
		{
			title: 'Họ tên',
			dataIndex: 'hoTen',
			width: 120,
			filterType: 'string',
		},
		{
			title: 'Tổng',
			dataIndex: 'total',
			align: 'center',
			width: 80,
			filterType: 'number',
			sortable: true,
		},
	];

	return (
		<div>
			<Space style={{ marginBottom: 12 }}>
				<Select
					onChange={(val) => handleChange(val)}
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

			<Row gutter={[16, 16]}>
				<Col xs={24} lg={24}>
					<Card loading={loadingNganh} title='Số lượng vào thư viện theo ngành'>
						<div style={{ marginBottom: 12 }}>
							<ButtonExtend icon={<ExportOutlined />} onClick={() => handleExport('thong-ke-nganh')}>
								Xuất dữ liệu
							</ButtonExtend>
						</div>
						<ColumnChart
							height={250}
							formatY={(val) => val + ''}
							yLabel={['Số lượt']}
							xAxis={dataThongKeCheckInNganh.map((i) => i?.nganh ?? 'Không có thông tin')}
							yAxis={[dataThongKeCheckInNganh.map((i) => i?.tongSoLuotCheckIn ?? 0)]}
							otherOptions={{
								plotOptions: { bar: { columnWidth: '20%' } },
								responsive: [
									{
										breakpoint: 1600,
										options: {
											plotOptions: {
												bar: {
													columnWidth: '40%',
												},
											},
										},
									},
								],
							}}
						/>
					</Card>
				</Col>
				<Col xs={24} lg={10}>
					<Card loading={loadingTop} title='Bạn đọc có số lượt vào thư viện nhiều nhất'>
						<TableStaticData
							columns={columns}
							data={dataThongKeCheckInTop ?? []}
							size='small'
							otherProps={{ pagination: true }}
							hasTotal
							addStt
						>
							<ButtonExtend size='small' icon={<ExportOutlined />} onClick={() => handleExport('top')}>
								Xuất dữ liệu
							</ButtonExtend>
						</TableStaticData>
					</Card>
				</Col>
				<Col xs={24} lg={14}>
					<Card loading={loadingKhoa} title='SL vào theo khóa'>
						<div style={{ marginBottom: 12 }}>
							<ButtonExtend icon={<ExportOutlined />} onClick={() => handleExport('thong-ke-khoa')}>
								Xuất dữ liệu
							</ButtonExtend>
						</div>
						<DonutChart
							yAxis={[dataThongKeCheckInKhoa?.map((item) => item?.tongSoLuotCheckIn ?? 0)]}
							xAxis={dataThongKeCheckInKhoa?.map((item) => item?.khoa ?? 'Không có thông tin')}
							yLabel={['Số lượt']}
							height={320}
							formatY={(val) => `${val} lượt`}
							showTotal
							otherOptions={{
								legend: {
									position: 'bottom',
									horizontalAlign: 'center',
								},
							}}
						/>
					</Card>
				</Col>
			</Row>

			<Divider type='horizontal' />

			<Card loading={loadingThang} bodyStyle={{ padding: 20 }} title='Số lượt vào/ra thư viện theo tháng'>
				<Space style={{ marginBottom: 12 }}>
					<MyDatePicker
						value={currentMonth}
						pickerStyle={'month'}
						format={'MM/YYYY'}
						onChange={(val) => {
							setCurrentMonth(val as any);
						}}
					/>
					<ButtonExtend icon={<ExportOutlined />} onClick={() => handleExport('thong-ke-thang')}>
						Xuất dữ liệu
					</ButtonExtend>
				</Space>
				<LineChart
					xAxis={dataThongKeCheckInThang.map((item) => `${item.ngay}/${item.thang}`)}
					yAxis={[
						dataThongKeCheckInThang.map((item) => item.tongSoLuotCheckIn),
						dataThongKeCheckInThang.map((item) => item.tongSoLuotCheckOut),
					]}
					yLabel={['Số lượng vào', 'Số lượng ra']}
					colors={['#0982c9', '#18b903']}
					title='Thống kê'
					height={300}
					formatY={(val) => `${val}`}
				/>
			</Card>
		</div>
	);
};

export default ThongKeThuVien;
