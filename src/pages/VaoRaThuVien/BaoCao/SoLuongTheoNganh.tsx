import ColumnChart from '@/components/Chart/ColumnChart';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { EOperatorType } from '@/components/Table/constant';
import { exportThongKe } from '@/services/QuanLyThuVien';
import { getFilenameHeader, inputFormat } from '@/utils/utils';
import { ExportOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import fileDownload from 'js-file-download';
import _ from 'lodash';
import { useEffect } from 'react';
import { useModel } from 'umi';

const SoLuongVaoRaThuVienTheoNganh = (props: { dateRange?: any }) => {
	const { dateRange } = props;
	const { getSoLuotCheckInNganhModel, loadingNganh, dataThongKeCheckInNganh } = useModel('quanlythuvien.vaorathuvien');

	const filters = [
		{
			active: true,
			field: 'thoiGianCheckIn',
			values: [dateRange?.[0], dateRange?.[1]],
			operator: EOperatorType.BETWEEN,
		},
	];

	useEffect(() => {
		getSoLuotCheckInNganhModel(undefined, dateRange ? filters : undefined);
	}, [dateRange]);

	const handleExport = async () => {
		await exportThongKe('thong-ke-nganh', undefined, dateRange ? filters : undefined).then((response) => {
			if (response?.data) {
				fileDownload(response?.data, getFilenameHeader(response));
			}
		});
	};

	const sortedData = _.sortBy(
		dataThongKeCheckInNganh,
		(i) => {
			const nganh = i?.nganh ?? 'Không có thông tin';
			return nganh === 'Không có thông tin' || nganh === 'Chưa cập nhật' ? 'zzz' : nganh;
		},
		['nganh'],
	);

	return (
		<Spin spinning={loadingNganh}>
			<div style={{ marginBottom: 12 }}>
				<ButtonExtend icon={<ExportOutlined />} onClick={() => handleExport()}>
					Xuất dữ liệu
				</ButtonExtend>
			</div>
			<ColumnChart
				height={350}
				formatY={(val) => inputFormat(val ?? 0)}
				yLabel={['Số lượt']}
				xAxis={sortedData.map((i) => i?.nganh ?? 'Không có thông tin')}
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

export default SoLuongVaoRaThuVienTheoNganh;
