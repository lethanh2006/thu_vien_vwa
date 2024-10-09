import DonutChart from '@/components/Chart/DonutChart';
import ButtonExtend from '@/components/Table/ButtonExtend';
import { exportThongKe } from '@/services/QuanLyThuVien';
import { getFilenameHeader } from '@/utils/utils';
import { ExportOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import fileDownload from 'js-file-download';
import { useEffect } from 'react';
import { useModel } from 'umi';

const SoLuongVaoRaThuVienTheoKhoa = (props: { filters?: any }) => {
	const { filters } = props;
	const { loadingKhoa, getSoLuotCheckInKhoaModel, dataThongKeCheckInKhoa } = useModel('quanlythuvien.vaorathuvien');

	useEffect(() => {
		getSoLuotCheckInKhoaModel(undefined, filters ? filters : undefined);
	}, [filters]);

	const handleExport = async () => {
		await exportThongKe('thong-ke-khoa', undefined, filters ? filters : undefined).then((response) => {
			if (response?.data) {
				fileDownload(response?.data, getFilenameHeader(response));
			}
		});
	};

	return (
		<Spin spinning={loadingKhoa}>
			<div style={{ marginBottom: 12 }}>
				<ButtonExtend size='small' icon={<ExportOutlined />} onClick={() => handleExport()}>
					Xuất dữ liệu
				</ButtonExtend>
			</div>
			<DonutChart
				yAxis={[dataThongKeCheckInKhoa?.map((item) => item?.tongSoLuotCheckIn ?? 0)]}
				xAxis={dataThongKeCheckInKhoa?.map((item) => item?.khoa ?? 'Không có thông tin')}
				yLabel={['Số lượt']}
				height={320}
				formatY={(val) => `${val} lượt`}
				showTotal
				otherOptions={{
					legend: {
						position: 'bottom',
						horizontalAlign: 'center',
					},
				}}
			/>
		</Spin>
	);
};

export default SoLuongVaoRaThuVienTheoKhoa;
