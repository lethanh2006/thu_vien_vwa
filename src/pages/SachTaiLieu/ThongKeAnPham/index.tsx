import ColumnChart from '@/components/Chart/ColumnChart';
import DonutChart from '@/components/Chart/DonutChart';
import MyDatePicker from '@/components/MyDatePicker';
import MyDateRangePicker from '@/components/MyDatePicker/RangePicker';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { EOperatorType } from '@/components/Table/constant';
import { EKieuHienThi, ETrangThaiMuonSach, EVaiTroMuonTra, KieuHienThi } from '@/services/SachTaiLieu/constant';
import { inputFormat } from '@/utils/utils';
import { ExportOutlined, ReloadOutlined } from '@ant-design/icons';
import { Card, Col, Empty, Row, Segmented, Select, Space, Spin, Tabs } from 'antd';
import _ from 'lodash';
import moment from 'moment';
import { useEffect, useMemo, useState } from 'react';
import { useModel } from 'umi';
import ModalExportAnPham from './ModalExport';

const ThongKeAnPham = (props: { isBanDoc?: boolean }) => {
	const { isBanDoc } = props;
	const { thongKeAnPhamMuonTraModel, dataThongKeAnPhamMuonTra, loadingThongKe } =
		useModel('sachtailieu.muontra.muontra');

	const [kieuHienThi, setKieuHienThi] = useState<EKieuHienThi>(EKieuHienThi.NAM);
	const [trangThai, setTrangThai] = useState<ETrangThaiMuonSach>(ETrangThaiMuonSach.DANG_THUE_MUON);
	const [yearSelect, setYearSelect] = useState(moment().year());
	const [monthSelect, setMonthSelect] = useState(moment().month());

	const [dateRange, setDateRange] = useState<string[]>([
		moment().startOf('M').toISOString(),
		moment().endOf('M').toISOString(),
	]);
	const [modalExport, setModalExport] = useState<boolean>(false);
	const [vaiTro, setVaiTro] = useState<EVaiTroMuonTra>(EVaiTroMuonTra.SINHVIEN);

	const [readyToFetch, setReadyToFetch] = useState(false);

	useEffect(() => {
		const startOfMonth = moment().year(yearSelect).month(monthSelect).startOf('month');
		const endOfMonth = moment().year(yearSelect).month(monthSelect).endOf('month');

		setDateRange([startOfMonth.toISOString(), endOfMonth.toISOString()]);
	}, [kieuHienThi, yearSelect, monthSelect]);

	useEffect(() => {
		setReadyToFetch(true);
	}, [dateRange, vaiTro, trangThai]);

	const getData = () => {
		const condition = {
			...(kieuHienThi === EKieuHienThi.THANG && { nam: yearSelect }),
			...{ trangThai: trangThai },
		};

		const filter = [
			vaiTro && {
				active: true,
				field: ['phieuMuonTra', 'vaiTro'],
				values: [vaiTro],
				operator: EOperatorType.INCLUDE,
			},
			kieuHienThi === EKieuHienThi.NGAY && {
				active: true,
				field: trangThai === ETrangThaiMuonSach.DANG_THUE_MUON ? 'thoiGianMuon' : 'thoiGianTra',
				values: [moment(dateRange[0]).startOf('date').toISOString(), moment(dateRange[1]).endOf('date').toISOString()],
				operator: EOperatorType.BETWEEN,
			},
		];

		thongKeAnPhamMuonTraModel(kieuHienThi, isBanDoc, condition, filter?.filter(Boolean));
	};

	useEffect(() => {
		if (readyToFetch) {
			getData();
			setReadyToFetch(false);
		}
	}, [readyToFetch]);

	const chartData = useMemo(() => {
		if (!dataThongKeAnPhamMuonTra?.length) return [];

		const rawData = dataThongKeAnPhamMuonTra.map((item) => ({
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
	}, [dataThongKeAnPhamMuonTra]);

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
						format={'DD/MM'}
						style={{ width: 180 }}
						value={[moment(dateRange[0]), moment(dateRange[1])]}
						onChange={(val: any) => {
							if (!val || val.length !== 2) return;
							setDateRange([val[0].toISOString(), val[1].toISOString()]);
						}}
					/>
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
				{dataThongKeAnPhamMuonTra?.length ? (
					<Row gutter={[12, 0]}>
						<Col span={24} md={16}>
							<ColumnChart
								yLabel={['Số lượt']}
								xAxis={dataThongKeAnPhamMuonTra?.map((item) =>
									kieuHienThi === EKieuHienThi.NGAY
										? moment(item.title ?? '').format('DD/MM')
										: kieuHienThi === EKieuHienThi.THANG
										? `Tháng ${item.title ?? ''}`
										: item.title ?? 'Không có thông tin',
								)}
								yAxis={[dataThongKeAnPhamMuonTra?.map((item) => Number(item.soLuong) ?? 0)]}
								showTotal
								type={dataThongKeAnPhamMuonTra.length >= 10 ? 'area' : 'bar'}
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
										? moment(item.x).format('DD/MM/YYYY')
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

			<ModalExportAnPham
				title='Xuất dữ liệu thống kê bạn đọc'
				visible={modalExport}
				setVisible={setModalExport}
				trangThai={trangThai}
				vaiTro={vaiTro}
			/>
		</Card>
	);
};

export default ThongKeAnPham;
