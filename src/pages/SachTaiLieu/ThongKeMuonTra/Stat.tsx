import { inputFormat } from '@/utils/utils';
import { Card, Col, Row, Spin, Tooltip } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const StatThongKeMuonTra = (props: { filter?: any }) => {
	const { filter } = props;
	const { thongKeTongSoMuonTraAnPhamModel, loadingThongKe, dataTheMuonAnPham } =
		useModel('sachtailieu.muontra.muontra');

	useEffect(() => {
		thongKeTongSoMuonTraAnPhamModel(undefined, filter?.filter(Boolean)?.length ? filter?.filter(Boolean) : undefined);
	}, [JSON.stringify(filter)]);

	const renderCard = (value: number, color: string, title: string, description: string) => (
		<Tooltip title={description}>
			<Card className='card-stat-small'>
				<span className='num' style={{ color }}>
					{inputFormat(value)}
				</span>
				<span>{title}</span>
			</Card>
		</Tooltip>
	);

	return (
		<Spin spinning={loadingThongKe}>
			<Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
				<Col span={24} md={6}>
					{renderCard(dataTheMuonAnPham?.tongSoLuot ?? 0, 'blue', 'Tổng số', 'Thống kê tổng số ghi mượn/ghi trả')}
				</Col>
				<Col span={24} md={6}>
					{renderCard(
						dataTheMuonAnPham?.theoDkcb ?? 0,
						'orange',
						'Theo ĐKCB',
						'Thống kê tổng số ĐKCB ghi mượn/ghi trả',
					)}
				</Col>
				<Col span={24} md={6}>
					{renderCard(dataTheMuonAnPham?.theoBanDoc ?? 0, 'red', 'Theo bạn đọc', 'Thống kê số bạn đọc mượn/trả')}
				</Col>
				<Col span={24} md={6}>
					{renderCard(
						dataTheMuonAnPham?.theoDauAnPham ?? 0,
						'green',
						'Theo ấn phẩm',
						'Thống kê số đầu ấn phẩm ghi mượn/ghi trả',
					)}
				</Col>
			</Row>
		</Spin>
	);
};

export default StatThongKeMuonTra;
