import LineChart from '@/components/Chart/LineChart';
import MyDatePicker from '@/components/MyDatePicker';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { exportThongKe } from '@/services/QuanLyThuVien';
import dayjs from '@/utils/dayjs';
import { getFilenameHeader } from '@/utils/utils';
import { ArrowRightOutlined, ExportOutlined } from '@ant-design/icons';
import { Card, Space, Spin } from 'antd';
import fileDownload from 'js-file-download';
import { useEffect, useState } from 'react';
import { Link, useIntl, useModel } from 'umi';

const SoLuongVaoRaThuVienTheoThang = (props: { isDashBoard?: boolean }) => {
	const intl = useIntl();
	const { isDashBoard } = props;
	const { loadingThang, getSoLuotCheckInThangModel, dataThongKeCheckInThang } = useModel('quanlythuvien.vaorathuvien');
	const [currentMonth, setCurrentMonth] = useState<dayjs.Dayjs>(dayjs());

	useEffect(() => {
		getSoLuotCheckInThangModel(dayjs(currentMonth).get('month'), dayjs(currentMonth).get('year'));
	}, [currentMonth]);

	const handleExport = async () => {
		await exportThongKe('thong-ke-thang', {
			thang: dayjs(currentMonth).get('month'),
			nam: dayjs(currentMonth).get('year'),
		}).then((response) => {
			if (response?.data) {
				fileDownload(response?.data, getFilenameHeader(response));
			}
		});
	};

	return (
		<Card
			title={intl.formatMessage({ id: 'vaorathuvien.card.title.danhSachVaoRaThuVienTheoThang' })}
			extra={
				isDashBoard ? (
					<Link to='/vao-ra-thu-vien/tong-hop'>
						{intl.formatMessage({ id: 'vaorathuvien.label.xemThem' })} <ArrowRightOutlined />
					</Link>
				) : null
			}
			variant='borderless'
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
					{intl.formatMessage({ id: 'vaorathuvien.button.xuatDuLieu' })}
				</ButtonExtend>
			</Space>

			<Spin spinning={loadingThang}>
				<LineChart
					xAxis={dataThongKeCheckInThang.map((item) => `${item.ngay}/${item.thang + 1}`)}
					yAxis={[
						dataThongKeCheckInThang.map((item) => item.tongSoLuotCheckIn),
						dataThongKeCheckInThang.map((item) => item.tongSoLuotCheckOut),
					]}
					yLabel={[
						intl.formatMessage({ id: 'vaorathuvien.label.soluongvao' }),
						intl.formatMessage({ id: 'vaorathuvien.label.soluongra' }),
					]}
					colors={['#0982c9', '#18b903']}
					title={intl.formatMessage({ id: 'vaorathuvien.label.soLuot' })}
					height={450}
					formatY={(val) => `${val}`}
					otherOptions={{
						legend: {
							position: 'bottom',
							horizontalAlign: 'center',
						},
					}}
				/>
			</Spin>
		</Card>
	);
};

export default SoLuongVaoRaThuVienTheoThang;
