import ColumnChart from '@/components/Chart/ColumnChart';
import DonutChart from '@/components/Chart/DonutChart';
import MyDatePicker from '@/components/MyDatePicker';
import MyDateRangePicker from '@/components/MyDatePicker/RangePicker';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { EOperatorType } from '@/components/Table/constant';
import { EKieuHienThi, ETrangThaiMuonSach, EVaiTroMuonTra, KieuHienThi } from '@/services/SachTaiLieu/constant';
import dayjs from '@/utils/dayjs';
import { inputFormat } from '@/utils/utils';
import { ExportOutlined, ReloadOutlined } from '@ant-design/icons';
import { Card, Col, Empty, Row, Segmented, Select, Space, Spin, Tabs } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useModel } from 'umi';
import ModalExportAnPham from './ModalExport';

const ThongKeAnPham = (props: { isBanDoc?: boolean }) => {
	const { isBanDoc } = props;
	const { thongKeAnPhamMuonTraModel, dataThongKeAnPhamMuonTra, loadingThongKe } =
		useModel('sachtailieu.muontra.muontra');

	const [kieuHienThi, setKieuHienThi] = useState<EKieuHienThi>(EKieuHienThi.NAM);
	const [trangThai, setTrangThai] = useState<ETrangThaiMuonSach>(ETrangThaiMuonSach.DANG_THUE_MUON);
	const [yearSelect, setYearSelect] = useState(dayjs().year());
	const [monthSelect, setMonthSelect] = useState(dayjs().month());

	const [dateRange, setDateRange] = useState<any>([
		dayjs().startOf('M').toISOString(),
		dayjs().endOf('M').toISOString(),
	]);
	const [modalExport, setModalExport] = useState<boolean>(false);
	const [vaiTro, setVaiTro] = useState<EVaiTroMuonTra>(EVaiTroMuonTra.SINHVIEN);

	const [readyToFetch, setReadyToFetch] = useState(false);

	useEffect(() => {
		const startOfMonth = dayjs().year(yearSelect).month(monthSelect).startOf('month');
		const endOfMonth = dayjs().year(yearSelect).month(monthSelect).endOf('month');
		setDateRange([startOfMonth.toISOString(), endOfMonth.toISOString()]);
	}, [kieuHienThi, yearSelect, monthSelect]);

	useEffect(() => {
		setReadyToFetch(true);
	}, [dateRange, vaiTro, trangThai]);

	const getData = () => {
		const condition: any = {
			...(kieuHienThi === EKieuHienThi.THANG && { nam: yearSelect }),
			trangThai,
		};

		const filter: any[] = [];

		if (vaiTro) {
			filter.push({
				active: true,
				field: ['phieuMuonTra', 'vaiTro'],
				values: [vaiTro],
				operator: EOperatorType.INCLUDE,
			});
		}

		if (kieuHienThi === EKieuHienThi.NGAY && dateRange?.length === 2) {
			filter.push({
				active: true,
				field: trangThai === ETrangThaiMuonSach.DANG_THUE_MUON ? 'thoiGianMuon' : 'thoiGianTra',
				values: [dayjs(dateRange[0]).startOf('date').toISOString(), dayjs(dateRange[1]).endOf('date').toISOString()],
				operator: EOperatorType.BETWEEN,
			});
		}

		thongKeAnPhamMuonTraModel(kieuHienThi, isBanDoc, condition, filter);
	};

	useEffect(() => {
		if (readyToFetch) {
			getData();
			setReadyToFetch(false);
		}
	}, [readyToFetch]);

	const filteredData = useMemo(() => {
		if (!dataThongKeAnPhamMuonTra?.length) return [];

		let data = [...dataThongKeAnPhamMuonTra];

		if (kieuHienThi === EKieuHienThi.NGAY && dateRange?.length === 2) {
			const start = dayjs(dateRange[0]).startOf('day');
			const end = dayjs(dateRange[1]).endOf('day');
			data = data.filter((item) => {
				const date = dayjs(item.title, 'YYYY-MM-DD', true);
				return date.isValid() && date.isBetween(start, end, undefined, '[]');
			});
		}

		return data;
	}, [dataThongKeAnPhamMuonTra, kieuHienThi, dateRange]);

	const chartData = useMemo(() => {
		if (!filteredData.length) return [];

		return filteredData.map((item) => ({
			x: item.title ?? 'Không có thông tin',
			soLuong: Number(item.soLuong) || 0,
		}));
	}, [filteredData]);

	return (
		<Card title={isBanDoc ? 'Thống kê bạn đọc' : 'Thống kê mượn trả ấn phẩm'}>
			<div>
				<Select
					style={{ width: 250, marginBottom: 12 }}
					value={vaiTro}
					placeholder='Chọn đối tượng'
					options={Object.values(EVaiTroMuonTra).map((item) => ({
						value: item,
						label: item,
					}))}
					onChange={(val) => setVaiTro(val)}
				/>
			</div>
			<Space wrap>
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
						value={dateRange}
						onChange={(val) => setDateRange(val || [])}
						style={{ width: 180 }}
						placeholder={['Từ ngày', 'Đến ngày']}
						ranges={{
							'Hôm nay': [dayjs().startOf('date'), dayjs().endOf('date')],
							'Tuần này': [dayjs().startOf('week'), dayjs().endOf('week')],
							'Tháng này': [dayjs().startOf('M'), dayjs().endOf('M')],
						}}
						format='DD/MM'
					/>
				) : kieuHienThi === EKieuHienThi.THANG ? (
					<MyDatePicker
						style={{ width: 90 }}
						value={yearSelect ? dayjs().year(yearSelect).startOf('year') : undefined}
						pickerStyle='year'
						format='YYYY'
						onChange={(val) => {
							if (val) setYearSelect(dayjs(val).year());
						}}
					/>
				) : null}

				<ButtonExtend icon={<ReloadOutlined />} onClick={getData}>
					Tải lại
				</ButtonExtend>
			</Space>
			<Tabs onChange={(tab) => setTrangThai(tab as ETrangThaiMuonSach)} activeKey={trangThai}>
				<Tabs.TabPane tab='Ấn phẩm đang mượn' key={ETrangThaiMuonSach.DANG_THUE_MUON} />
				<Tabs.TabPane tab='Ấn phẩm đã trả' key={ETrangThaiMuonSach.DA_TRA} />
			</Tabs>
			<div style={{ marginBottom: 12 }}>
				<ButtonExtend icon={<ExportOutlined />} onClick={() => setModalExport(true)}>
					Xuất dữ liệu
				</ButtonExtend>
			</div>

			<Spin spinning={loadingThongKe}>
				{filteredData.length ? (
					<Row gutter={[12, 0]}>
						<Col span={24} md={16}>
							<ColumnChart
								yLabel={['Số lượt']}
								xAxis={filteredData.map((item) => {
									if (kieuHienThi === EKieuHienThi.NGAY) {
										return dayjs(item.title, 'YYYY-MM-DD').format('DD/MM');
									}
									if (kieuHienThi === EKieuHienThi.THANG) return `Tháng ${item.title ?? ''}`;
									return item.title ?? 'Không có thông tin';
								})}
								yAxis={[filteredData.map((item) => Number(item.soLuong) || 0)]}
								showTotal
								type={filteredData.length >= 10 ? 'area' : 'bar'}
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
								xAxis={chartData?.map((item) => {
									if (kieuHienThi === EKieuHienThi.NGAY) {
										return dayjs(item.x, undefined, true).isValid() ? dayjs(item.x).format('DD/MM/YYYY') : 'Không rõ';
									}
									if (kieuHienThi === EKieuHienThi.THANG) return `Tháng ${item.x}`;
									return item.x;
								})}
								yAxis={[chartData?.map((item) => item.soLuong)]}
								yLabel={['Số lượt']}
								showTotal
								formatY={(val) => `${inputFormat(val)} lượt`}
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

			<ModalExportAnPham
				title={isBanDoc ? 'Xuất dữ liệu thống kê bạn đọc' : 'Xuất dữ liệu thống kê ấn phẩm'}
				visible={modalExport}
				setVisible={setModalExport}
				trangThai={trangThai}
				vaiTro={vaiTro}
			/>
		</Card>
	);
};

export default ThongKeAnPham;
