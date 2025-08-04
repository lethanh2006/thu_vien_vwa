import { inputFormat } from '@/utils/utils';
import { Card, Col, Row, Spin } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const StatAnPhamDinhKy = () => {
	const { thongKeDangKyCaBietModel, dataThongKeAnPhamDinhKy, loadingThongKe } = useModel('anphamdinhky.anphamdinhky');

	useEffect(() => {
		thongKeDangKyCaBietModel();
	}, []);

	return (
		<Spin spinning={loadingThongKe}>
			<Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
				<Col span={24} md={12}>
					<Card className='card-stat-small'>
						<span className='num' style={{ color: 'blue' }}>
							{inputFormat(dataThongKeAnPhamDinhKy?.tongSoAnPhamDinhKy ?? 0)}
						</span>
						<span>Tổng số ấn phẩm định kỳ</span>
					</Card>
				</Col>
				<Col span={24} md={12}>
					<Card className='card-stat-small'>
						<span className='num' style={{ color: 'orange' }}>
							{inputFormat(dataThongKeAnPhamDinhKy?.tongSoAnPhamDinhKyGhiNhan ?? 0)}
						</span>
						<span>Tổng số ẩn phẩm định kỳ ghi nhận</span>
					</Card>
				</Col>
			</Row>
		</Spin>
	);
};

export default StatAnPhamDinhKy;
