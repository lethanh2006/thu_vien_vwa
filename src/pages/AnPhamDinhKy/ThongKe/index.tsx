import ColumnChart from '@/components/Chart/ColumnChart';
import DonutChart from '@/components/Chart/DonutChart';
import MyDatePicker from '@/components/MyDatePicker';
import MyDateRangePicker from '@/components/MyDatePicker/RangePicker';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { EOperatorType } from '@/components/Table/constant';
import { EKieuHienThi, KieuHienThi } from '@/services/SachTaiLieu/constant';
import dayjs from '@/utils/dayjs';
import { inputFormat } from '@/utils/utils';
import { ReloadOutlined } from '@ant-design/icons';
import { Card, Col, Empty, Row, Segmented, Space, Spin } from 'antd';
import _ from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { useModel } from 'umi';

const ThongKeAnPhamDinhKy = () => {
	const { thongKeGhiNhanAnPhamModel, loadingThongKe, dataThongKeGhiNhanAnPham } = useModel('anphamdinhky.ghinhan');

	const [kieuHienThi, setKieuHienThi] = useState<EKieuHienThi>(EKieuHienThi.NAM);
	const [yearSelect, setYearSelect] = useState(dayjs().year());
	const [monthSelect, setMonthSelect] = useState(dayjs().month());
	const [dateRange, setDateRange] = useState<string[]>([
		dayjs().startOf('M').toISOString(),
		dayjs().endOf('M').toISOString(),
	]);

	useEffect(() => {
		const startOfMonth = dayjs().year(yearSelect).month(monthSelect).startOf('month');
		const endOfMonth = dayjs().year(yearSelect).month(monthSelect).endOf('month');

		setDateRange([startOfMonth.toISOString(), endOfMonth.toISOString()]);
	}, [kieuHienThi, yearSelect, monthSelect]);

	const getData = () => {
		const condition = {
			...(kieuHienThi === EKieuHienThi.THANG && { nam: yearSelect }),
		};

		const filter = [
			kieuHienThi === EKieuHienThi.NGAY && {
				active: true,
				field: 'ngayGhiNhan',
				values: [dayjs(dateRange[0]).startOf('date').toISOString(), dayjs(dateRange[1]).endOf('date').toISOString()],
				operator: EOperatorType.BETWEEN,
			},
		];

		thongKeGhiNhanAnPhamModel(kieuHienThi, condition, filter?.filter(Boolean));
	};

	useEffect(() => {
		getData();
	}, [kieuHienThi, monthSelect, yearSelect, dateRange]);

	const chartData = useMemo(() => {
		if (!dataThongKeGhiNhanAnPham?.length) return [];

		const rawData = dataThongKeGhiNhanAnPham.map((item) => ({
			x: item.title ?? 'Không có thông tin',
			soLuong: Number(item.soLuong),
		}));

		const totalSoLuong = _.sumBy(rawData, 'soLuong');

		const chart = rawData.map((item) => ({
			...item,
			y: _.round((item.soLuong / (totalSoLuong || 1)) * 100, 2),
		}));

		const diff = 100 - _.sumBy(chart, 'y');
		if (chart.length > 0) {
			chart[chart.length - 1].y += diff;
		}

		return chart;
	}, [dataThongKeGhiNhanAnPham]);

	return (
		<Card title='Thống kê ghi nhận ấn phẩm định kỳ'>
			<Space wrap style={{ marginBottom: 12 }}>
				<Segmented
					value={kieuHienThi}
					onChange={(val) => setKieuHienThi(val as EKieuHienThi)}
					options={Object.entries(EKieuHienThi).map(([val, item]) => ({
						key: val,
						value: item,
						label: KieuHienThi[item],
					}))}
				/>

				{kieuHienThi === EKieuHienThi.NGAY ? (
					<MyDateRangePicker
						format={'DD/MM'}
						style={{ width: 180 }}
						value={[dayjs(dateRange[0]), dayjs(dateRange[1])]}
						onChange={(val: any) => {
							if (!val || val.length !== 2) return;
							setDateRange([val[0].toISOString(), val[1].toISOString()]);
						}}
					/>
				) : kieuHienThi === EKieuHienThi.THANG ? (
					<MyDatePicker
						style={{ width: 90 }}
						value={dayjs(yearSelect, 'YYYY')}
						pickerStyle={'year'}
						format={'YYYY'}
						onChange={(val) => {
							setYearSelect(dayjs(val).year());
						}}
					/>
				) : null}

				<ButtonExtend icon={<ReloadOutlined />} onClick={getData}>
					Tải lại
				</ButtonExtend>
			</Space>

			<Spin spinning={loadingThongKe}>
				{dataThongKeGhiNhanAnPham?.length ? (
					<Row gutter={[12, 0]}>
						<Col span={24} md={16}>
							<ColumnChart
								yLabel={['Số lượt']}
								xAxis={dataThongKeGhiNhanAnPham?.map((item) =>
									kieuHienThi === EKieuHienThi.NGAY
										? dayjs(item.title ?? '').format('DD/MM')
										: kieuHienThi === EKieuHienThi.THANG
											? `Tháng ${item.title ?? ''}`
											: (item.title ?? 'Không có thông tin'),
								)}
								yAxis={[dataThongKeGhiNhanAnPham?.map((item) => Number(item.soLuong) ?? 0)]}
								showTotal
								type={dataThongKeGhiNhanAnPham.length >= 10 ? 'area' : 'bar'}
								otherOptions={{
									yaxis: {
										labels: { formatter: (val) => `${inputFormat(val)}` },
									},
									plotOptions: {
										bar: {
											columnWidth: '20%',
											dataLabels: {
												position: 'top',
											},
										},
									},
									dataLabels: {
										enabled: true,
										formatter: function (val: any) {
											return inputFormat(val);
										},
										offsetY: -20,
										style: {
											fontSize: '15px',
											fontWeight: 600,
											colors: ['#333'],
										},
									},
									tooltip: {
										shared: true,
										intersect: false,
										y: { formatter: (val) => `${inputFormat(val)}` },
									},
									responsive: [
										{
											options: {
												plotOptions: {
													bar: {
														columnWidth: '40%',
													},
												},
												dataLabels: {
													enabled: true,
													formatter: function (val: any) {
														return `${inputFormat(val)}`;
													},
													offsetY: -10,
												},
											},
										},
									],
								}}
								onColumnClick={(value) => {
									if (kieuHienThi === EKieuHienThi.NAM) {
										setKieuHienThi(EKieuHienThi.THANG);
										setYearSelect(Number(value));
									} else if (kieuHienThi === EKieuHienThi.THANG) {
										const month = Number(value.replace('Tháng ', ''));
										setKieuHienThi(EKieuHienThi.NGAY);
										setMonthSelect(month - 1);
									}
								}}
							/>
						</Col>
						<Col span={24} md={8}>
							<DonutChart
								xAxis={chartData?.map((item) =>
									kieuHienThi === EKieuHienThi.NGAY
										? dayjs(item.x).format('DD/MM/YYYY')
										: kieuHienThi === EKieuHienThi.THANG
											? `Tháng ${item.x}`
											: item.x,
								)}
								yAxis={[chartData?.map((item) => item.y)]}
								yLabel={['Phần trăm (%)']}
								showTotal
								formatY={(val) => `${inputFormat(val)} %`}
								otherOptions={{
									legend: { position: 'bottom' },
									tooltip: {
										y: {
											formatter: function (val, { dataPointIndex }) {
												const value = chartData?.[dataPointIndex]?.soLuong ?? 0;
												return `${inputFormat(value)} lượt`;
											},
										},
									},
								}}
							/>
						</Col>
					</Row>
				) : (
					<Empty description='Không có dữ liệu' style={{ marginBottom: 32, marginTop: 32 }} />
				)}
			</Spin>
		</Card>
	);
};

export default ThongKeAnPhamDinhKy;
