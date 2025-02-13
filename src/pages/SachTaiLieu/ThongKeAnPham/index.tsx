import ColumnChart from '@/components/Chart/ColumnChart';
import DonutChart from '@/components/Chart/DonutChart';
import { EKieuHienThi, ETrangThaiMuonSach, KieuHienThi } from '@/services/SachTaiLieu/constant';
import { inputFormat } from '@/utils/utils';
import { Card, Col, Empty, Row, Segmented, Select, Space, Spin, Tabs } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useModel } from 'umi';

const ThongKeAnPham = (props: { isBanDoc?: boolean }) => {
	const { isBanDoc } = props;
	const { thongKeAnPhamMuonTraModel, dataThongKeAnPhamMuonTra, loadingThongKe } =
		useModel('sachtailieu.muontra.muontra');

	const [kieuHienThi, setKieuHienThi] = useState<EKieuHienThi>(EKieuHienThi.NAM);
	const [tabActive, setTabActive] = useState<string>('1');
	const [yearSelect, setYearSelect] = useState(moment().year());
	const [monthSelect, setMonthSelect] = useState(moment().month());

	const total = dataThongKeAnPhamMuonTra?.reduce((sum, item) => sum + Number(item.soLuong), 0);

	const chartData = (() => {
		if (!dataThongKeAnPhamMuonTra?.length) return [];
		const rawPercentages = dataThongKeAnPhamMuonTra.map((item) => ({
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
						<Select
							placeholder='Chọn tháng'
							style={{ width: 150 }}
							value={monthSelect}
							options={_.range(1, 13).map((item) => ({
								key: item,
								value: item,
								label: `Tháng ${item}`,
							}))}
							onChange={(val) => setMonthSelect(val)}
						/>
						<Select
							placeholder='Chọn năm'
							style={{ width: 150 }}
							value={yearSelect}
							options={_.range(2020, moment().year() + 1).map((item) => ({
								key: item,
								value: item,
								label: item,
							}))}
							onChange={(val) => setYearSelect(val)}
						/>
					</>
				) : kieuHienThi === EKieuHienThi.THANG ? (
					<Select
						placeholder='Chọn năm'
						style={{ width: 150 }}
						value={yearSelect}
						options={_.range(2020, moment().year() + 1).map((item) => ({
							key: item,
							value: item,
							label: item,
						}))}
						onChange={(val) => setYearSelect(val)}
					/>
				) : null}
			</Space>

			{!isBanDoc && (
				<Tabs onChange={(tab) => setTabActive(tab)} activeKey={tabActive}>
					<Tabs.TabPane tab='Ấn phẩm đang mượn' key='1' />
					<Tabs.TabPane tab='Ấn phẩm đã mượn' key='2' />
				</Tabs>
			)}

			<Spin spinning={loadingThongKe}>
				{dataThongKeAnPhamMuonTra?.length ? (
					<Row gutter={[12, 0]}>
						<Col span={24} md={16}>
							<ColumnChart
								yLabel={['Số lượt']}
								xAxis={dataThongKeAnPhamMuonTra?.map((item) =>
									kieuHienThi === EKieuHienThi.NGAY
										? moment(item.title ?? '').format('DD/MM/YYYY')
										: kieuHienThi === EKieuHienThi.THANG
										? `Tháng ${item.title ?? ''}`
										: item.title ?? 'Không có thông tin',
								)}
								yAxis={[dataThongKeAnPhamMuonTra?.map((item) => Number(item.soLuong) ?? 0)]}
								showTotal
								type={dataThongKeAnPhamMuonTra.length && dataThongKeAnPhamMuonTra.length >= 12 ? 'area' : 'bar'}
								otherOptions={{
									yaxis: {
										labels: { formatter: (val) => `${inputFormat(val)}` },
									},
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
		</Card>
	);
};

export default ThongKeAnPham;
