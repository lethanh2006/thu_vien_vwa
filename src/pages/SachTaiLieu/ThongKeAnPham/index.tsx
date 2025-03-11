import ColumnChart from '@/components/Chart/ColumnChart';
import DonutChart from '@/components/Chart/DonutChart';
import MyDatePicker from '@/components/MyDatePicker';
import MyDateRangePicker from '@/components/MyDatePicker/RangePicker';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { EKieuHienThi, ETrangThaiMuonSach, KieuHienThi } from '@/services/SachTaiLieu/constant';
import { inputFormat } from '@/utils/utils';
import { ExportOutlined } from '@ant-design/icons';
import { Card, Col, Empty, Row, Segmented, Select, Space, Spin, Tabs } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';
import ModalExportAnPham from './ModalExport';

const ThongKeAnPham = (props: { isBanDoc?: boolean }) => {
	const { isBanDoc } = props;
	const { thongKeAnPhamMuonTraModel, dataThongKeAnPhamMuonTra, loadingThongKe } =
		useModel('sachtailieu.muontra.muontra');

	const [kieuHienThi, setKieuHienThi] = useState<EKieuHienThi>(EKieuHienThi.NAM);
	const [tabActive, setTabActive] = useState<string>('1');
	const [yearSelect, setYearSelect] = useState(moment().year());
	const [monthSelect, setMonthSelect] = useState(moment().month());
	const [dateRange, setDateRange] = useState<string[] | null>(null);
	const [modalExport, setModalExport] = useState<boolean>(false);

	const filteredData = dataThongKeAnPhamMuonTra?.filter((item) => {
		if (!dateRange || dateRange.length < 2 || kieuHienThi !== EKieuHienThi.NGAY) {
			return true;
		}

		const itemDate = moment.utc(item.title, 'YYYY-MM-DD').startOf('day');
		const startDate = moment.utc(dateRange[0]).startOf('day');
		const endDate = moment.utc(dateRange[1]).startOf('day');

		return itemDate.isBetween(startDate, endDate, 'day', '[]');
	});

	const total = filteredData?.reduce((sum, item) => sum + Number(item.soLuong), 0);

	const chartData = (() => {
		if (!filteredData?.length) return [];
		const rawPercentages = filteredData.map((item) => ({
			x: item.title ?? 'Không có thông tin',
			y: (Number(item.soLuong) / (total ?? 1)) * 100,
		}));
		const roundedPercentages = rawPercentages.map((item) => ({
			...item,
			y: _.round(item.y, 2),
		}));
		const roundedTotal = _.sumBy(roundedPercentages, 'y');
		if (roundedTotal !== 100 && roundedPercentages.length > 0) {
			const difference = 100 - roundedTotal;
			roundedPercentages[roundedPercentages.length - 1].y += difference;
		}
		return roundedPercentages;
	})();

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

	useEffect(() => {
		const params = {
			...(kieuHienThi === EKieuHienThi.THANG && { nam: yearSelect }),
			...(kieuHienThi === EKieuHienThi.NGAY && { nam: yearSelect, thang: monthSelect }),
			...(!isBanDoc && {
				trangThai: tabActive === '1' ? ETrangThaiMuonSach.DANG_THUE_MUON : ETrangThaiMuonSach.DA_TRA,
			}),
		};

		thongKeAnPhamMuonTraModel(kieuHienThi, isBanDoc, params);
	}, [kieuHienThi, monthSelect, yearSelect, tabActive, isBanDoc]);

	return (
		<Card title={isBanDoc ? 'Thống kê bạn đọc' : 'Thống kê mượn trả ấn phẩm'}>
			<Space style={{ marginBottom: 12 }} wrap>
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
							value={dateRange ? [moment(dateRange[0]), moment(dateRange[1])] : undefined}
							onChange={(val: any) => {
								if (!val) {
									setDateRange(null);
									return;
								}
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
							allowClear
						/>

						<Select
							placeholder='Chọn tháng'
							style={{ width: 120 }}
							value={monthSelect}
							options={_.range(1, 13).map((item) => ({
								key: item,
								value: item,
								label: `Tháng ${item}`,
							}))}
							onChange={(val) => {
								setMonthSelect(val);

								if (dateRange) {
									const startOfMonth = moment()
										.year(yearSelect)
										.month(val - 1)
										.startOf('month');
									const endOfMonth = moment()
										.year(yearSelect)
										.month(val - 1)
										.endOf('month');
									setDateRange([startOfMonth.toISOString(), endOfMonth.toISOString()]);
								}
							}}
						/>

						<MyDatePicker
							style={{ width: 90 }}
							value={moment(yearSelect, 'YYYY')}
							pickerStyle={'year'}
							format={'YYYY'}
							onChange={(val) => {
								setYearSelect(moment(val).year());

								if (dateRange) {
									const startOfMonth = moment()
										.year(moment(val).year())
										.month(monthSelect - 1)
										.startOf('month');
									const endOfMonth = moment()
										.year(moment(val).year())
										.month(monthSelect - 1)
										.endOf('month');
									setDateRange([startOfMonth.toISOString(), endOfMonth.toISOString()]);
								}
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
			</Space>

			{!isBanDoc && (
				<div>
					<ButtonExtend icon={<ExportOutlined />} onClick={() => setModalExport(true)}>
						Xuất dữ liệu
					</ButtonExtend>
				</div>
			)}

			{!isBanDoc && (
				<Tabs onChange={(tab) => setTabActive(tab)} activeKey={tabActive}>
					<Tabs.TabPane tab='Ấn phẩm đang mượn' key='1' />
					<Tabs.TabPane tab='Ấn phẩm đã mượn' key='2' />
				</Tabs>
			)}

			<Spin spinning={loadingThongKe}>
				{filteredData?.length ? (
					<Row gutter={[12, 0]}>
						<Col span={24} md={16}>
							<ColumnChart
								yLabel={['Số lượt']}
								xAxis={filteredData?.map((item) =>
									kieuHienThi === EKieuHienThi.NGAY
										? moment(item.title ?? '').format('DD/MM')
										: kieuHienThi === EKieuHienThi.THANG
										? `Tháng ${item.title ?? ''}`
										: item.title ?? 'Không có thông tin',
								)}
								yAxis={[filteredData?.map((item) => Number(item.soLuong) ?? 0)]}
								showTotal
								type={filteredData.length && filteredData.length >= 10 ? 'area' : 'bar'}
								otherOptions={{
									yaxis: {
										labels: { formatter: (val) => `${inputFormat(val)}` },
									},
									plotOptions: { bar: { columnWidth: '20%' } },
									responsive: [
										{
											options: {
												plotOptions: {
													bar: {
														columnWidth: '40%',
													},
												},
											},
										},
									],
									tooltip: {
										shared: true,
										intersect: false,
										y: { formatter: (val) => `${inputFormat(val)}` },
									},
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
								xAxis={
									chartData?.map((item) =>
										kieuHienThi === EKieuHienThi.NGAY
											? moment(item.x).format('DD/MM/YYYY')
											: kieuHienThi === EKieuHienThi.THANG
											? `Tháng ${item.x}`
											: item.x,
									) ?? []
								}
								yAxis={[chartData?.map((item) => item.y) ?? []]}
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

			<ModalExportAnPham visible={modalExport} setVisible={setModalExport} />
		</Card>
	);
};

export default ThongKeAnPham;
