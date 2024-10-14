import LineChart from '@/components/Chart/LineChart';
import MyDatePicker from '@/components/MyDatePicker';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { exportThongKe } from '@/services/QuanLyThuVien';
import { getFilenameHeader } from '@/utils/utils';
import { ArrowRightOutlined, ExportOutlined } from '@ant-design/icons';
import { Card, Space } from 'antd';
import fileDownload from 'js-file-download';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Link, useModel } from 'umi';

const SoLuongVaoRaThuVienTheoThang = (props: { isDashBoard?: boolean }) => {
	const { isDashBoard } = props;
	const { loadingThang, getSoLuotCheckInThangModel, dataThongKeCheckInThang } = useModel('quanlythuvien.vaorathuvien');
	const [currentMonth, setCurrentMonth] = useState<moment.Moment>(moment());

	useEffect(() => {
		getSoLuotCheckInThangModel(moment(currentMonth).get('month'), moment(currentMonth).get('year'));
	}, [currentMonth]);

	const handleExport = async () => {
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
	};

	return (
		<Card
			loading={loadingThang}
			title='Số lượt vào/ra thư viện theo tháng'
			extra={
				isDashBoard ? (
					<Link to='/vao-ra-thu-vien/tong-hop'>
						Xem thêm <ArrowRightOutlined />
					</Link>
				) : null
			}
		>
			<Space style={{ marginBottom: 12 }}>
				<MyDatePicker
					value={currentMonth}
					pickerStyle={'month'}
					format={'MM/YYYY'}
					onChange={(val) => {
						setCurrentMonth(val as any);
					}}
				/>
				<ButtonExtend icon={<ExportOutlined />} onClick={() => handleExport()}>
					Xuất dữ liệu
				</ButtonExtend>
			</Space>
			<LineChart
				xAxis={dataThongKeCheckInThang.map((item) => `${item.ngay}/${item.thang + 1}`)}
				yAxis={[
					dataThongKeCheckInThang.map((item) => item.tongSoLuotCheckIn),
					dataThongKeCheckInThang.map((item) => item.tongSoLuotCheckOut),
				]}
				yLabel={['Số lượng vào', 'Số lượng ra']}
				colors={['#0982c9', '#18b903']}
				title='Thống kê'
				height={350}
				formatY={(val) => `${val}`}
				otherOptions={{
					legend: {
						position: 'bottom',
						horizontalAlign: 'center',
					},
				}}
			/>
		</Card>
	);
};

export default SoLuongVaoRaThuVienTheoThang;
