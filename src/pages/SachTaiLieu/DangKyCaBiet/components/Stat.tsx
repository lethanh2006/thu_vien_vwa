import type { AnPham } from '@/services/SachTaiLieu/AnPham/typing';
import { inputFormat } from '@/utils/utils';
import { Card, Col, Row, Spin } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';

const StatDanhSachDKCB = (props: { condition?: Partial<AnPham.IAnPhamXepGia> }) => {
	const { condition } = props;
	const { thongKeDangKyCaBietModel, loadingThongKe, thongKeDKCB, soDKCBRanh, soDKCBThanhLy } = useModel(
		'sachtailieu.anpham.anphamxepgia',
	);
	const conditionKey = JSON.stringify(condition ?? {});

	useEffect(() => {
		thongKeDangKyCaBietModel(condition).catch(() => undefined);
	}, [conditionKey]);

	const metrics = [
		{
			label: 'Tổng số ĐKCB',
			value: thongKeDKCB?.tongSoAnPham,
			color: 'blue',
			description: 'Bao gồm cả ĐKCB đã thanh lý',
		},
		{ label: 'ĐKCB đang cho mượn', value: thongKeDKCB?.tongSoAnPhamDangThueMuon, color: 'red' },
		{ label: 'Trong đó quá hạn', value: thongKeDKCB?.tongSoAnPhamQuaHan, color: 'orange' },
		{ label: 'ĐKCB Rảnh', value: soDKCBRanh, color: 'green' },
		{ label: 'ĐKCB đã thanh lý', value: soDKCBThanhLy, color: 'gray' },
	];

	return (
		<Spin spinning={loadingThongKe}>
			<Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
				{metrics.map((metric) => (
					<Col key={metric.label} flex='1 1 220px'>
						<Card className='card-stat-small'>
							<span className='num' style={{ color: metric.color }}>
								{metric.value == null ? '--' : inputFormat(metric.value)}
							</span>
							<span title={metric.description}>{metric.label}</span>
						</Card>
					</Col>
				))}
			</Row>
		</Spin>
	);
};

export default StatDanhSachDKCB;
