import ColumnChart from '@/components/Chart/ColumnChart';
import DonutChart from '@/components/Chart/DonutChart';
import MyDatePicker from '@/components/MyDatePicker';
import MyDateRangePicker from '@/components/MyDatePicker/RangePicker';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { EOperatorType } from '@/components/Table/constant';
import { EKieuHienThi, KieuHienThi } from '@/services/SachTaiLieu/constant';
import { inputFormat } from '@/utils/utils';
import { ReloadOutlined } from '@ant-design/icons';
import { Card, Col, Empty, Row, Segmented, Space, Spin } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { useModel } from 'umi';

const ThongKeAnPhamDinhKy = () => {
	const { thongKeGhiNhanAnPhamModel, loadingThongKe, dataThongKeGhiNhanAnPham } = useModel('anphamdinhky.ghinhan');

	const [kieuHienThi, setKieuHienThi] = useState<EKieuHienThi>(EKieuHienThi.NAM);
	const [yearSelect, setYearSelect] = useState(moment().year());
	const [monthSelect, setMonthSelect] = useState(moment().month());
	const [dateRange, setDateRange] = useState<string[]>([
		moment().startOf('M').toISOString(),
		moment().endOf('M').toISOString(),
	]);

	useEffect(() => {
		let startOfMonth, endOfMonth;

		if (yearSelect && monthSelect) {
			startOfMonth = moment()
				.year(yearSelect)
				.month(monthSelect - 1)
				.startOf('month');
			endOfMonth = moment()
				.year(yearSelect)
				.month(monthSelect - 1)
				.endOf('month');
		} else {
			startOfMonth = moment().startOf('month');
			endOfMonth = moment().endOf('month');
		}

		setDateRange([startOfMonth.toISOString(), endOfMonth.toISOString()]);
	}, [yearSelect, monthSelect]);

	const getData = () => {
		const condition = {
			...(kieuHienThi === EKieuHienThi.THANG && { nam: yearSelect }),
		};

		const filter = [
			kieuHienThi === EKieuHienThi.NGAY && {
				active: true,
				field: 'ngayGhiNhan',
				values: [moment(dateRange[0]).startOf('date').toISOString(), moment(dateRange[1]).endOf('date').toISOString()],
				operator: EOperatorType.BETWEEN,
			},
		];

		thongKeGhiNhanAnPhamModel(kieuHienThi, condition, filter?.filter(Boolean));
	};

	useEffect(() => {
		getData();
	}, [kieuHienThi, monthSelect, yearSelect]);

	const total = useMemo(() => {
		return dataThongKeGhiNhanAnPham?.reduce((sum, item) => sum + Number(item.soLuong), 0);
	}, [dataThongKeGhiNhanAnPham]);

	const chartData = useMemo(() => {
		if (!dataThongKeGhiNhanAnPham?.length) return [];

		const rawPercentages = dataThongKeGhiNhanAnPham?.map((item) => ({
			x: item.title ?? 'Không có thông tin',
			y: (Number(item.soLuong) / (total || 1)) * 100,
		}));

		const roundedPercentages = rawPercentages?.map((item) => ({
			...item,
			y: _.round(item.y, 2),
		}));

		const roundedTotal = _.sumBy(roundedPercentages, 'y');
		if (roundedTotal !== 100 && roundedPercentages.length > 0) {
			const difference = 100 - roundedTotal;
			roundedPercentages[roundedPercentages.length - 1].y += difference;
		}

		return roundedPercentages;
	}, [dataThongKeGhiNhanAnPham, total]);

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
					<>
						<MyDateRangePicker
							format={'DD/MM'}
							style={{ width: 180 }}
							value={[moment(dateRange[0]), moment(dateRange[1])]}
							onChange={(val: any) => {
								setDateRange(val);
								setMonthSelect(moment(val[0]).month() + 1);
								setYearSelect(moment(val[0]).year());
							}}
							disabledDate={(current) => {
								if (!monthSelect || !yearSelect) return false;
								const startOfMonth = moment()
									.year(yearSelect)
									.month(monthSelect - 1)
									.startOf('month');
								const endOfMonth = moment()
									.year(yearSelect)
									.month(monthSelect - 1)
									.endOf('month');
								return moment(current).isBefore(startOfMonth) || moment(current).isAfter(endOfMonth);
							}}
						/>
					</>
				) : kieuHienThi === EKieuHienThi.THANG ? (
					<MyDatePicker
						style={{ width: 90 }}
						value={moment(yearSelect, 'YYYY')}
						pickerStyle={'year'}
						format={'YYYY'}
						onChange={(val) => {
							setYearSelect(moment(val).year());
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
										? moment(item.title ?? '').format('DD/MM')
										: kieuHienThi === EKieuHienThi.THANG
										? `Tháng ${item.title ?? ''}`
										: item.title ?? 'Không có thông tin',
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
										setMonthSelect(month);
									}
								}}
							/>
						</Col>
						<Col span={24} md={8}>
							<DonutChart
								xAxis={chartData?.map((item) =>
									kieuHienThi === EKieuHienThi.NGAY
										? moment(item.x).format('DD/MM/YYYY')
										: kieuHienThi === EKieuHienThi.THANG
										? `Tháng ${item.x}`
										: item.x,
								)}
								yAxis={[chartData?.map((item) => item.y)]}
								yLabel={['Phần trăm (%)']}
								showTotal
								formatY={(val) => `${inputFormat(val)} %`}
								otherOptions={{ legend: { position: 'bottom' } }}
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
