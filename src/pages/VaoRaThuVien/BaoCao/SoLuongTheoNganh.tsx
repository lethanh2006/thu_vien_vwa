import ColumnChart from '@/components/Chart/ColumnChart';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { exportThongKe } from '@/services/QuanLyThuVien';
import { getFilenameHeader, inputFormat } from '@/utils/utils';
import { ExportOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import fileDownload from 'js-file-download';
import { useEffect } from 'react';
import { useModel } from 'umi';

const SoLuongVaoRaThuVienTheoNganh = (props: { filters?: any }) => {
	const { filters } = props;
	const { getSoLuotCheckInNganhModel, loadingNganh, dataThongKeCheckInNganh } = useModel('quanlythuvien.vaorathuvien');

	useEffect(() => {
		getSoLuotCheckInNganhModel(undefined, filters ? filters : undefined);
	}, [filters]);

	const handleExport = async () => {
		await exportThongKe('thong-ke-nganh', undefined, filters ? filters : undefined).then((response) => {
			if (response?.data) {
				fileDownload(response?.data, getFilenameHeader(response));
			}
		});
	};

	return (
		<Spin spinning={loadingNganh}>
			<div style={{ marginBottom: 12 }}>
				<ButtonExtend size='small' icon={<ExportOutlined />} onClick={() => handleExport()}>
					Xuất dữ liệu
				</ButtonExtend>
			</div>
			<ColumnChart
				height={250}
				formatY={(val) => inputFormat(val ?? 0)}
				yLabel={['Số lượt']}
				xAxis={dataThongKeCheckInNganh.map((i) => i?.nganh ?? 'Không có thông tin')}
				yAxis={[dataThongKeCheckInNganh.map((i) => i?.tongSoLuotCheckIn ?? 0)]}
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
