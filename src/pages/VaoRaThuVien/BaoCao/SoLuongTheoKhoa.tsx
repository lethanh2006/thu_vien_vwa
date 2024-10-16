import ColumnChart from '@/components/Chart/ColumnChart';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { exportThongKe } from '@/services/QuanLyThuVien';
import { getFilenameHeader, inputFormat } from '@/utils/utils';
import { ExportOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import fileDownload from 'js-file-download';
import _ from 'lodash';
import { useEffect } from 'react';
import { useModel } from 'umi';

const SoLuongVaoRaThuVienTheoKhoa = (props: { dateRange?: any }) => {
	const { dateRange } = props;
	const { loadingKhoa, getSoLuotCheckInKhoaModel, dataThongKeCheckInKhoa } = useModel('quanlythuvien.vaorathuvien');

	useEffect(() => {
		getSoLuotCheckInKhoaModel(dateRange?.[0], dateRange?.[1]);
	}, [dateRange]);

	const handleExport = async () => {
		await exportThongKe('thong-ke-khoa', {
			thoiGianBatDau: dateRange?.[0],
			thoiGianKetThuc: dateRange?.[1],
		}).then((response) => {
			if (response?.data) {
				fileDownload(response?.data, getFilenameHeader(response));
			}
		});
	};

	const sortedData = _.sortBy(
		dataThongKeCheckInKhoa,
		(i) => {
			const khoa = i?.khoa ?? 'Không có thông tin';
			return khoa === 'Không có thông tin' || khoa === 'Chưa cập nhật' ? 'zzz' : khoa;
		},
		['khoa'],
	);

	return (
		<Spin spinning={loadingKhoa}>
			<div style={{ marginBottom: 12 }}>
				<ButtonExtend icon={<ExportOutlined />} onClick={() => handleExport()}>
					Xuất dữ liệu
				</ButtonExtend>
			</div>

			<ColumnChart
				height={450}
				formatY={(val) => inputFormat(val ?? 0)}
				yLabel={['Số lượt']}
				xAxis={sortedData.map((i) => i?.khoa ?? 'Không có thông tin')}
				yAxis={[sortedData.map((i) => i?.tongSoLuotCheckIn ?? 0)]}
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
		</Spin>
	);
};

export default SoLuongVaoRaThuVienTheoKhoa;
